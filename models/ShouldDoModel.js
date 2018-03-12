const mobx = require('../vendor/mobx');

const ShouldDoModel = function (shouldDo) {
  this.id = shouldDo.id

  mobx.extendObservable(this, {
    content: shouldDo.content,
    status: shouldDo.status,
    category: shouldDo.category
  });

  this.setContent = function (content) {
    this.content = content;
  };

  this.setCategory = function (category) {
    this.category = category;
  }

  this.setStatus = function (status){
    this.status = status;
  }
}

module.exports = {
  ShouldDoModel: ShouldDoModel
}
