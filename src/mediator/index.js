//@ sourceURL = blocks/mediator/index.js
define(['./mixin','yaul/extend'], 
function(
   MediatorMixin
  ,extend
){

function Mediator (){
  var self = this
  self._events = {};
  self._latched = {};
  self._arguments = {};
  self._switched = {};
}
Mediator.prototype = extend({}, MediatorMixin)

return Mediator;
})
//@ sourceURL = blocks/mediator/index.js