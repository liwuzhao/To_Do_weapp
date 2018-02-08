const apiBaseURL = require('../config').apiBaseURL;
const constants = require('./constants');
const session = require('./session');
const auth = require('./auth');

const api = {};

const RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

const buildHeader = function(originalHeader) {
  let header = originalHeader || {};
  header['content-type'] = header['content-type'] || 'application/json';

  let currentSession = session.currentSession();
  if (currentSession && currentSession.token) {
    header['Authorization'] = currentSession.token;
  }

  return header;
};

const buildRequest = function(options, requestCallback) {
  let success = options.success;
  let fail = options.fail;
  let complete = options.complete;

  let successCallback = function(result) {
    if (typeof complete === 'function') {
      complete(result);
    }
    if (typeof success === 'function') {
      success(result);
    }
  }

  let failCallback = function(error) {
    if (options.handleError &&
        !(error instanceof auth.LoginError) &&
        !(error instanceof session.SessionError)) {
      api.handleRequestError(error, options.notifyError);
    }
    if (typeof complete === 'function') {
      complete(error);
    }
    if (typeof fail === 'function') {
      fail(error);
    }
  }

  let hasRetried = false;
  let doRequest = function() {
    options.header = buildHeader(options.header);

    options.success = function(response) {
      let res = {};
      res.status = response.statusCode;
      res.data = response.data;
      if (response.data && (typeof response.data === 'string')) {
        try {
          res.data = JSON.parse(response.data);
        } catch (error) {
          res.data = { message: response.data };
        }
      }

      if (res.status >= 200 && res.status < 300) {
        if (typeof options.success === 'function') {
          successCallback(res);
        }
      } else if (res.status >= 300 && res.status < 400) {
        let error = new RequestError(constants.ERROR_REQUEST_REDIRECT_ERROR, '重定向错误')
        error.detail = res;
        failCallback(error);
      } else if (res.status >= 400 && res.status < 500) {
        if (res.status === 401) {
          session.clearSession();
          if (!hasRetried) {
            hasRetried = true;
            doRequestWithLogin();
            return;
          }
        }

        let error = new RequestError(constants.ERROR_REQUEST_CLIENT_ERROR, '客户端错误')
        error.detail = res;
        failCallback(error);
      } else if (res.status >= 500) {
        let error = new RequestError(constants.ERROR_REQUEST_SERVER_ERROR, '服务端错误')
        error.detail = res;
        failCallback(error);
      }
    };

    options.fail = function(wxRequestError) {
      if (wxRequestError.errMsg && wxRequestError.errMsg.includes('statusCode : 401')) {
        session.clearSession();
        if (!hasRetried) {
          hasRetried = true;
          doRequestWithLogin();
          return;
        }
      }

      let error = new RequestError(constants.ERROR_WX_REQUEST_FAILED, '微信发送请求失败')
      error.detail = wxRequestError;
      failCallback(error);
    };

    options.complete = undefined;

    if (requestCallback) {
      requestCallback(options);
    }
  };

  let doRequestWithLogin = function() {
    auth.login({
      handleError: options.handleError,
      success: function() {
        doRequest();
      },
      fail: failCallback
    });
  };

  if (options.requireLogin) {
    doRequestWithLogin();
  } else {
    doRequest();
  }
};

api.request = function(options) {
  let requestOptions = {};

  if (typeof options.requireLogin === 'undefined') {
    requestOptions.requireLogin = false;
  } else {
    requestOptions.requireLogin = options.requireLogin;
  }

  if (typeof options.handleError === 'undefined') {
    requestOptions.handleError = true;
  } else {
    requestOptions.handleError = options.handleError;
  }

  if (options.notifyError) {
    requestOptions.notifyError = options.notifyError;
  }

  if (options.path) {
    requestOptions.url = apiBaseURL + options.path;
  }

  if (options.data) {
    requestOptions.data = options.data;
  }

  if (options.header) {
    requestOptions.header = options.header;
  }

  if (options.method) {
    requestOptions.method = options.method;
  }

  if (options.dataType) {
    requestOptions.dataType = options.dataType;
  } else {
    requestOptions.dataType = 'json';
  }

  requestOptions.success = options.success;
  requestOptions.fail = options.fail;
  requestOptions.complete = options.complete;

  buildRequest(requestOptions, wx.request);
};

api.uploadFile = function(options) {
  let uploadFileOptions = {};

  if (typeof options.requireLogin === 'undefined') {
    uploadFileOptions.requireLogin = false;
  } else {
    uploadFileOptions.requireLogin = options.requireLogin;
  }

  if (typeof options.handleError === 'undefined') {
    uploadFileOptions.handleError = true;
  } else {
    uploadFileOptions.handleError = options.handleError;
  }

  if (options.notifyError) {
    uploadFileOptions.notifyError = options.notifyError;
  }

  if (options.path) {
    uploadFileOptions.url = apiBaseURL + options.path;
  }

  if (options.filePath) {
    uploadFileOptions.filePath = options.filePath;
  }

  if (options.name) {
    uploadFileOptions.name = options.name;
  }

  if (options.header) {
    uploadFileOptions.header = options.header;
  }

  if (options.formData) {
    uploadFileOptions.formData = options.formData;
  }

  uploadFileOptions.success = options.success;
  uploadFileOptions.fail = options.fail;
  uploadFileOptions.complete = options.complete;

  buildRequest(uploadFileOptions, wx.uploadFile);
};

api.get = function(options) {
  options.method = 'GET';
  api.request(options);
};

api.post = function(options) {
  options.method = 'POST';
  api.request(options);
};

api.put = function(options) {
  options.method = 'PUT';
  api.request(options);
};

api.delete = function(options) {
  options.method = 'DELETE';
  api.request(options);
};

api.handleRequestError = function(error, notifyError) {
  let errorType;
  let title = '出错了';
  let content = '请求失败，请重试';
  let success = function() {};

  switch (error.type) {
    case constants.ERROR_WX_REQUEST_FAILED:
      errorType = 'WX_ERROR'
      content = '网络可能存在异常，请重试';
      break;
    case constants.ERROR_REQUEST_REDIRECT_ERROR:
      errorType = 'SYSTEM_ERROR'
      content = '操作失败，请重试';
      break;
    case constants.ERROR_REQUEST_CLIENT_ERROR:
      content = '操作失败，请重试';
      switch(error.detail.status) {
        case 401:
          errorType = 'SYSTEM_ERROR'
          content = '授权失败，请重试'
          break;
        case 403:
          errorType = 'SYSTEM_ERROR'
          content = '你无法进行该操作'
          break;
        case 404:
          errorType = 'SYSTEM_ERROR'
          content = '你要操作的资源未找到'
          break;
        case 422:
          errorType = 'USER_ERROR'
          if (error.detail.data.errors && error.detail.data.errors.length > 0) {
            content = error.detail.data.errors[0].message;
          } else {
            content = error.detail.data.message;
          }
          break;
      }
      break;
    case constants.ERROR_REQUEST_SERVER_ERROR:
      content = '服务器开小差，请稍后再试';
      break;
  }

  if (errorType === 'USER_ERROR' && typeof notifyError === 'function') {
    notifyError(content);
  } else {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: success
    });
  }
};

module.exports = api;
