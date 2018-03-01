const mobx = require('../vendor/mobx');
const ShouldDoModel = require('./ShouldDoModel').ShouldDoModel;
const utils = require('../libs/utils');

const ListModel = function (list) {
  this.id = list.id;

  mobx.extendObservable(this, {
    list_date: list.list_date,
    // should_do: new ShouldDoModel(list.should_do || {})
    should_dos: []
  });

  this.setList_date = function (list_date) {
    this.list_date = list_date;
  };

  this.setShouldDo = function (should_do) {
    this.should_dos.push(new ShouldDoModel(should_do))
  };

  this.toJS = function () {
    return mobx.toJS(this);
  };
}

module.exports = {
  ListModel: ListModel
};
