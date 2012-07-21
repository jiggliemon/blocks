//@ sourceURL = blocks/template/index.js
define([
   './mixin'
  ,'yaul/extend'
], function (
   TemplateMixin
  ,extend
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

Template.prototype = extend({}, TemplateMixin)
Template.setTags = Template.prototype.setTags
return Template

})
//@ sourceURL = blocks/template/index.js