define(['./mixin'], function(EventsMixin){
  
  function Mediator (){
    this._events = {};
    this._latched = {};
    this._arguments = {};
    this._switched = {};
  }
  Mediator.prototype = EventsMixin;

  return Mediator;
  
});