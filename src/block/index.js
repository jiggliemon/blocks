var blocks = require('../main')
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

;(function () {
  var style = document.createElement('style')
  style.innerHTML = css
  var s = document.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(style, s)
}())

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
function Block ( arg1, arg2, arg3 ) {

  if ( !(this instanceof Block) ) {
    return new Block( arg1, arg2, arg3 )
  }
  
  var self = this
  // new Block('name', {
  //   ... options ...
  // }[,{...methods...}])
  var type1 = typeOf(arg1)
  var type2 = typeOf(arg2)

  if ( type1 === 'string' ) {
    self.key = arg1
    self.setOptions(arg2 || {})
    blocks.register(arg1,self)

  } else if (type1 === 'object' || type1 === 'undefined') {
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
    make(this,'events', options.events || {})

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

Block.create = function ( defaults, methods ) {
  function constructor ( arg1, arg2 ) {
    var self = this
    
    Block.prototype.setOptions.call(self, defaults)
    
    // new Block('name', {
    //   ... options ...
    // }[,{...methods...}])
    var type1 = typeOf(arg1)
    var type2 = typeOf(arg2)

    if ( type1 === 'string' ) {
      self.key = arg1
      self.setOptions(arg2 || {})
      blocks.register(arg1,self)
    } else if (type1 === 'object' || type1 === 'undefined') {
      self.setOptions(arg2 || {})
    }

    self.construct && self.construct.call(this, self.options)
    self.initialize(self.options)
  }

  constructor.prototype = extend(methods || {}, Block.prototype)

  return constructor
}

blocks.block = Block

module.exports = Block


