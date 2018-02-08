const mobx = require('../vendor/mobx');

const UserModel = function(user = {}) {
  mobx.extendObservable(
    this,
    Object.assign({}, user)
  )
};

module.exports = UserModel;
