//@ sourceURL = blocks/block/index.js
define([
   'blocks'
  ,'./mixin'
  ,'yate/mixin'
  ,'../mediator/mixin'
  ,'yaul/hasOwn'
  ,'yaul/forEach'
  ,'yaul/slice'
  ,'yaul/isArray'
  ,'yaul/make'
  ,'yaul/typeOf'
], function (
   Blocks
  ,BlockMixin
  ,TemplateMixin
  ,MediatorMixin
  ,hasOwn
  ,forEach
  ,slice
  ,isArray
  ,make
  ,typeOf
) {


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
function Block ( name, options, methods ) {
  if ( !(this instanceof Block) ) {
    return new Block(name, options)
  }
  
  var self = this

  if ( typeof name === 'string' && arguments.length == 1 ) {
    options = name
  } else {
    self.key = name
    try {
      Blocks.register(name,self)
    } catch (e) {}
  }

  if ( typeOf(methods, 'object') && (arguments.length === 3) ) {
    extend(this, methods)
  }

  self.setOptions(options)
  self.initialize(self.options)
}


Block.prototype = extend({
  
  defaults: {
    onReady: ['template:ready', function blockReady () {
      var self = this
      self.ready = true
      self.setContext(self.options.context)
      self.setContext('block',self)
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

    if(options.attachEvents) {
      self.attachEvents = options.attachEvents
    }
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
    self.addEvent(slice(0,-1),'block:ready', callback.bind(self))
  }

  /**
   *
   *
   */
   ,setOptions: function (options) {
    var self = this
    _options = make(self,'options',{})
    _defaults = make(self,'defaults',{})
    return extend(_options, _defaults, options || {})
  } 


}, TemplateMixin, MediatorMixin, BlockMixin )

return Block

})
//@ sourceURL = blocks/block/index.js
