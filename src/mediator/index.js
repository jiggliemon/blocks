define(['./mixin','../utilities'], 
function(
   MediatorMixin
  ,utilities
){

function Mediator (){
  var self = this
  self._events = {};
  self._latched = {};
  self._arguments = {};
  self._switched = {};
}
Mediator.prototype = utilities.extend({}, MediatorMixin)

return Mediator;
})