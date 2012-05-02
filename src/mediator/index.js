define(['./mixin','../utilities'], 
function(){
var EventsMixin = require('./mixin')
  , utilities = require('../utilities')

function Mediator (){
  var self = this
  self._events = {};
  self._latched = {};
  self._arguments = {};
  self._switched = {};
}
Mediator.prototype = utilities.extend({},EventsMixin)

return Mediator;
})