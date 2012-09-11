var BlockMixin = require('./mixin')
var TemplateMixin = require('yate/mixin')
var MediatorMixin = require('yeah/mixin')
var hasOwn = require('yaul/hasOwn')
var forEach = require('yaul/forEach')
var slice = require('yaul/slice')
var isArray = require('yaul/isArray')
var make = require('yaul/make')
var typeOf = require('yaul/typeOf')
var css = require('text!./styles.css')

;(function (doc) {
  var style = doc.createElement('style')
  style.innerHTML = css
  var s = doc.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(style, s)
}(document))

function extend (obj) {
  forEach(slice(arguments, 1),function(source){
    for (var property in source) {
      if (hasOwn(source,property)) {
        obj[property] = source[property]
      }
    }
  })
  return obj;
}

/** @constructor */
function Block (arg1,arg2,arg3  ) {

  if ( !(this instanceof Block) ) {
    return new Block(arg1, arg2, arg3)
  }
  
  var self = this
  // new Block('name', {
  //   ... options ...
  // }[,{...methods...}])
  if ( typeOf(arg1, 'string') ) {
    self.key = arg1

    if( typeOf(arg2, 'object') ) {
      self.setOptions(arg2)
    }
    
    if ( typeOf(arg3, object) ) {
      extend(this, arg3)
    }
  }

  // new Block({
  //  ... options ...
  // }[, {... methods ...}]);
  if ( typeOf(arg1, 'object') ) {
    self.setOptions(arg1)

    if( typeOf(arg2, 'object') ) {
      extend(this, arg2)
    }
  }

  self.initialize(self.options)
}


Block.prototype = extend({
  
  defaults: {
    onReady: ['template:ready', function blockReady () {
      var self = this
      self.ready = true

      self.setContext(self.options.context)
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
    make(this,'events', options.events || {})
    
    self.setChildren( options.children )
    self.setContainer( options.container )
    self.setTemplate( options.template )
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
    
    args = isArray(args) ? args : slice(arguments,0)
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
    var _options = make(self,'options',{})
    var _defaults = make(self,'defaults',{})
    return extend(_options, _defaults, options || {})
  } 


}, TemplateMixin, MediatorMixin, BlockMixin )

module.exports = Block


