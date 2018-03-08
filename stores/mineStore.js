const mobx = require('../vendor/mobx');
const api = require('../libs/api');
const safeSetCurrentSession = require('../libs/session').safeSetCurrentSession;
const UserModel = require('../models/UserModel');

const MineStore = function() {
  mobx.extendObservable(this, {
    me: new UserModel
  });

  this.setMe = function(me) {
    this.me = new UserModel(me);
    safeSetCurrentSession('user', me);
  }
}

module.exports = new MineStore;
