define(['./mixin', '../utilities'], function () {
var TemplateMixin = require('./mixin')
  , utilities = require('../utilities')

function Template (config) {
  config = config || {}
  var self = this
  self._template = null
  self._context = {}
  if( (typeof config.template === 'string') || (typeof config == 'string') ) {
    self._template = config.template || config
  }
} 

Template.prototype = utilities.extend({}, TemplateMixin)

return Template

})
