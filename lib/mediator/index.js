// @ sourceURL = blocks/mediator/index.js
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

module.exports = Mediator;
// @ sourceURL = blocks/mediator/index.js