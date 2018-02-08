const constants = require('./constants');

const SESSION_KEY = 'SESSION-' + constants.SESSION_KEY_UNIQUE_ID;

const sessionStorage = {
  getSession: function () {
    try {
      return wx.getStorageSync(SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  setSession: function (session) {
    wx.setStorageSync(SESSION_KEY, session);
  },

  removeSession: function () {
    wx.removeStorageSync(SESSION_KEY);
  }
};

module.exports = sessionStorage;