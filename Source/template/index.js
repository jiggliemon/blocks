define(['./mixin'], function( TemplateMixin ) {


  function Template (config) {
    config = config || {};
    this._template = null;
    this._context = {}
    if( (typeof config.template === 'string') || (typeof config == 'string') ) {
      this._template = config.template || config;
    }
  } 

  Template.prototype = TemplateMixin;

  return Template;

});