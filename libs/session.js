const apiBaseURL = require('../config').apiBaseURL;
const constants = require('./constants');
const sessionStorage = require('./sessionStorage');

const SessionError = (function () {
  function SessionError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  SessionError.prototype = new Error();
  SessionError.prototype.constructor = SessionError;

  return SessionError;
})();

function currentSession() {
  return sessionStorage.getSession();
}

function clearSession() {
  sessionStorage.removeSession();
}

function safeSetCurrentSession(key, value) {
  let data = null;
  if (key === 'user') {
    data = sessionStorage.getSession();
    data[key] = value;
    sessionStorage.setSession(data);
  }
}

function createSession(options) {
  wx.request({
    url: apiBaseURL + '/sessions',
    data: options.data,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    success: function (response) {
      let res = {
        status: response.statusCode,
        data: response.data
      };

      if (res.status >= 200 && res.status < 300) {
        let session = res.data;
        sessionStorage.setSession(session);
        if (typeof options.success === 'function') {
          options.success(session);
        }
      } else {
        if (typeof options.fail === 'function') {
          let error = new SessionError(constants.ERROR_CREATE_SESSION_FAILED, '创建会话失败');
          error.detail = res;
          options.fail(error);
        }
      }
    },
    fail: function (createSessionError) {
      if (typeof options.fail === 'function') {
        let error = new SessionError(constants.ERROR_CREATE_SESSION_REQUEST_FAILED, '创建会话微信发送请求失败');
        error.detail = createSessionError;
        options.fail(error);
      }
    },
    complete: function (result) {
      if (typeof options.complete === 'function') {
        options.complete(result);
      }
    }
  });
}

function handleSessionError(error) {
  let title = '出错了';
  let content = '授权失败，请重试';
  let success = function () { };

  switch (error.type) {
    case constants.ERROR_CREATE_SESSION_REQUEST_FAILED:
      content = '网络可能存在异常，请重试';
      break;
    case constants.ERROR_CREATE_SESSION_FAILED:
      content = '授权失败，请重试';
      break;
  }

  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: success
  });
}

module.exports = {
  currentSession: currentSession,
  clearSession: clearSession,
  safeSetCurrentSession: safeSetCurrentSession,
  createSession: createSession,
  SessionError: SessionError,
  handleSessionError: handleSessionError
};