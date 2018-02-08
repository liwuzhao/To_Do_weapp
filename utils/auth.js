const constants = require('./constants');
const session = require('./session');

const LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

function wxLogin(options) {
  wx.login({
    success: function (result) {
      if (result.code) {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (res) {
            res.code = result.code;
            if (typeof options.success === 'function') {
              options.success(res);
            }
          },
          fail: function (wxGetUserInfoError) {
            if (typeof options.fail === 'function') {
              let error = new LoginError(constants.ERROR_WX_GET_USER_INFO_FAILED, '获取微信用户信息失败');
              error.detail = wxGetUserInfoError;
              options.fail(error);
            }
          }
        });
      } else {
        if (typeof options.fail === 'function') {
          let error = new LoginError(constants.ERROR_WX_LOGIN_FAILED, '获取微信用户登录态失败');
          error.detail = result;
          options.fail(error);
        }
      }
    },
    fail: function (wxLoginError) {
      if (typeof options.fail === 'function') {
        let error = new LoginError(constants.ERROR_WX_LOGIN_FAILED, '微信登录失败');
        error.detail = wxLoginError;
        options.fail(error);
      }
    }
  });
}

function login(options) {
  let that = this;

  let handleError = options.handleError
  if (typeof handleError === 'undefined') {
    handleError = true;
  }

  let fail = options.fail;
  if (handleError) {
    options.fail = function (error) {
      that.handleLoginError(error);
      if (typeof fail === 'function') {
        fail(error);
      }
    }
  }

  let doLogin = function () {
    wxLogin({
      success: function (result) {
        let data = {
          code: result.code,
          encrypted_data: result.encryptedData,
          iv: result.iv
        };
        session.createSession({
          data: data,
          success: function (session) {
            if (typeof options.success === 'function') {
              options.success(session);
            }
          },
          fail: function (error) {
            if (typeof options.fail === 'function') {
              options.fail(error);
            }
          }
        });
      },
      fail: function (error) {
        if (typeof options.fail === 'function') {
          options.fail(error);
        }
      }
    });
  };

  let currentSession = session.currentSession();
  if (currentSession) {
    wx.checkSession({
      success: function () {
        if (typeof options.success === 'function') {
          options.success(currentSession);
        }
      },
      fail: function () {
        session.clearSession();
        doLogin();
      }
    });
  } else {
    doLogin();
  }
}

function handleLoginError(error) {
  if (error instanceof session.SessionError) {
    session.handleSessionError(error);
    return;
  }

  let title = '出错了';
  let content = '登录失败，请重试';
  let success = function () { };
  switch (error.type) {
    case constants.ERROR_WX_LOGIN_FAILED:
      content = '网络可能存在异常，请重试';
      break;
    case constants.ERROR_WX_GET_USER_INFO_FAILED:
      if (!error.detail.errMsg.includes('deny')) {
        content = '网络可能存在异常，请重试';
        break;
      }

      title = '您拒绝了授权请求';

      if (!wx.openSetting) {
        content = '我们需要获得您的公开信息才能正常提供服务。您需要先删除每天读财报，然后再次打开小程序，并在请求授权时点击“允许”。';
        break;
      }

      content = '我们需要获得您的公开信息才能正常提供服务。请在设置界面允许小程序使用您的“用户信息”。';
      success = function () {
        wx.openSetting({
          success: function (result) {
            if (result.authSetting['scope.userInfo']) {
              wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 1000
              });
            }
          }
        });
      };
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
  login: login,
  wxLogin: wxLogin,
  LoginError: LoginError,
  handleLoginError: handleLoginError
};
