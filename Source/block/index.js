define(['blocks','./mixin','../template/mixin', '../mediator/mixin','../utilities'], 
  function ( Blocks, BlockMixin, TemplateMixin, EventsMixin, utilities, undef ) {

  function extend (obj) {
    utilities.slice.call(arguments, 1).forEach(function(source){
      for (var property in source) {
        if (utilities.hasOwn.call(source,property)) {
          // Commented out the deep extend portions
          // if (source[property] && source[property].constructor && source[property].constructor === Object) {
          //   obj[property] = obj[property] || {};
          //   extend(obj[property], source[property]);
          // } else {
            obj[property] = source[property];
          // }
        }
      }
    })
    return obj;
  }

  /** @constructor */
  function Block (name,options) {
    if (!(this instanceof Block)) {
      return new Block(name, options)
    }
    
    var self = this
    if(!utilities.typeOf( name, 'string' ) && arguments.length == 1) {
      options = name
    } else {
      self.key = name
      Blocks.register(name,self)
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
      
      args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
      // todo: wtf is going on in here
      var callback = args[args.length -1]
      self.addEvent(args.slice(0,-1),'block:ready', callback.bind(self))
    }

    /**
     *
     *
     */
     ,setOptions: function (options) {
      var self = this
      _options = utilities.make(self,'options',{})
      _defaults = utilities.make(self,'defaults',{})
      return extend(_options, _defaults, options || {})
    } 


  }, TemplateMixin, EventsMixin, BlockMixin )

  return Block;
    
});
