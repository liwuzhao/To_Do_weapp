const mobx = require('../vendor/mobx');
const ShouldDoModel = require('./ShouldDoModel').ShouldDoModel;

const ListModel = function(list){
  this.id = list.id;

  mobx.extendObservable(this,{
    list_date: list.list_date,
    shouldDo: new ShouldDoModel(list.shouldDo || {})
  });

  this.setShouldDo = function(shouldDo){
    this.shouldDo = shouldDo;
  };

  this.setList_date = function (list_date){
    this.list_date = list_date;
  }

}

module.exports = {
  ListModel: ListModel
}
