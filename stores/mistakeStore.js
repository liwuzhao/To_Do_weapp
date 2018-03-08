const mobx = require('../vendor/mobx');
const api = require('../libs/api');
const UserModel = require('../models/UserModel');

const MistakeStore = function() {
  mobx.extendObservable(this, {
    mistakes: []
  });

  this.createMistake = function(options) {
    var mistake = options.mistake;
    api.post({
      path: '/mistakes',
      data: mistake,
      success: options.mistake,
      fail: options.fail,
      complete: options.complete,
      handleError: options.handleError
    })
  }

  this.loadAllMistakes = function(options) {
    api.get({
      path: '/mistakes',
      success: options.success,
      fail: options.fail,
      complete: options.complete,
      handleError: options.handleError
    });
  };
};

module.exports = {
  mistakeStore: new MistakeStore
};
