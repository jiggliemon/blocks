//@ sourceURL = blocks/module/index.js
var ModuleMixin = require('./mixin') 
  , TemplateMixin = require('../template/mixin') 
  , BlockMixin  = require('../block/mixin') 
  , MediatorMixin = require('../mediator/mixin') 
  , utilities = require('../utilities')

function implement (key, value, retain, undef){
  var k
  if (key === undef) return

  if (utilities.typeOf(key,'object')) {
    for ( k in key ) {
      if (utilities.hasOwn.call(key,k)) {    
        implement.call(this,k, key[k])
      }
    }  
    return;
  }

  this[key] = utilities.typeOf( value, 'function') ? (retain) ? value : wrap(this, key, value) : value
  
  return this
}

function wrap (self, key, method){
  function wrapper () {
    var  caller = this.caller 
        ,current = this.$caller
        ,result

    this.caller = current 
    this.$caller = wrapper
    result = method.apply(this, arguments)
    this.$caller = current
    this.caller = caller
    
    return result
  }

  wrapper.$parent = self[key]
  wrapper.$name = key
    
  return wrapper
}


/** @constructor */
function Module (methods) {

  function Module () {
    implement.call(this,methods)
    this.initialize && this.initialize.apply(this, arguments)
  }

  Module.prototype = utilities.extend({
    /**
     *
     *
     */
     parent: function (){
      var  name = this.$caller.$name
          ,parent = this.$caller.$parent
      if (!parent) {
        throw new Error('The method "' + name + '" has no parent.')
      }
      return parent.apply(this, arguments)
    }
  }, ModuleMixin, BlockMixin, TemplateMixin, MediatorMixin )

  return Module
}

module.exports = Module

//@ sourceURL = blocks/module/index.js
