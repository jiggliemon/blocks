//@ sourceURL = blocks/template/index.js
define(['./mixin', '../utilities'], function (
   TemplateMixin
  ,utilities
) {

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
//@ sourceURL = blocks/template/index.js