/* mixins */
var BlockMixin = require('./mixin')
var TemplateMixin = require('yate/mixin')
var MediatorMixin = require('yeah/mixin')

/* helpers */
var lodash = require('lodash')
var hasOwn = lodash.has
var isArray = lodash.isArray
/** 
 * Also: isObject, isString, isUndefined
 */
var extend = lodash.extend

var css = require('text!./styles.css')

/**
 * todo: Only works in browser
 */
;(function () {
  var style = document.createElement('style')
  style.innerHTML = css
  var s = document.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(style, s)
}())

/** @constructor */
function Block ( arg1, arg2, arg3 ) {

  if ( !(this instanceof Block) ) {
    return new Block( arg1, arg2, arg3 )
  }
  
  var self = this
  // new Block('name', {
  //   ... options ...
  // }[,{...methods...}])

  if ( lodash.isString(arg1)) {
    self.key = arg1
    self.setOptions(arg2 || {})
  } else if ( lodash.isObject(arg1) || lodash.isUndefined(arg1) ) {
    self.setOptions(arg1 || {})
  }


  self.initialize(self.options)
}


Block.prototype = extend({
  
  defaults: {
    onReady: ['template:ready', function blockReady () {
      var self = this
      self.ready = true
      self.bindTemplate()
      self.fillContainer()
    }]
  }

  /**
   *
   *
   *
   */
  ,initialize: function (options) {
    var self = this
    self.readyReady()

    // if(options.attachEvents) {
    //   self.attachEvents = options.attachEvents
    // }
    self.events = (options.events || {})

    if (options.lang || options.context) {
      self.setContext(extend({},options.lang, options.context))
    }
    self.setContext('id',self.getUniqueId())
    self.setChildren( options.children )
    self.setContainer( options.container )
    self.setTemplate( options.template || this.template )
  }

  /**
   *
   *
   *
   */
  ,readyReady: function (args) {
    var self = this
    if(!args && self.options.onReady) {
      args = self.options.onReady
    } else {
      return
    }
    
    args = isArray(args) ? args : Array.prototype.slice.call(arguments,0)
    // todo: wtf is going on in here
    var callback = args[args.length -1]
    self.addEvent(Array.prototype.slice.call(args,0,-1),'block:ready', callback.bind(self))
  }

  /**
   *
   *
   */
   ,setOptions: function (options) {
    var self = this
    var _options = self.options = self.options || {}
    var _defaults = self.defaults = self.defaults || {}
    return extend(_options, _defaults, options || {})
  } 


}, TemplateMixin, MediatorMixin, BlockMixin )

Block.create = function ( defaults, methods ) {
  function constructor ( arg1, arg2 ) {
    var self = this
    
    Block.prototype.setOptions.call(self, defaults)

    // new Block('name', {
    //   ... options ...
    // }[,{...methods...}])
    if ( lodash.isString(arg1) ) {
      self.key = arg1
      self.setOptions(arg2 || {})
    } else if ( lodash.isObject(arg1) || lodash.isUndefined(arg1) ) {
      self.setOptions(arg1 || {})
    }

    self.construct && self.construct.call(this, self.options)
    self.initialize(self.options)

  }

  constructor.prototype = extend(methods || {}, Block.prototype)

  return constructor
}

module.exports = Block


