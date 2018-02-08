const mobx = require('../vendor/mobx');

const ShouldDoModel = function(shouldDo){
  this.id = shouldDo.id

  mobx.extendObservable(this,{
    content: shouldDo.content
  });

  this.setContent = function(content){
    this.content = content;
  };
}

module.exports = {
  ShouldDoModel: ShouldDoModel
}
