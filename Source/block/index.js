define(['./mixin','../template/mixin', '../mediator/mixin','../utilities'], 
  function ( BlockMixin, TemplateMixin, EventsMixin, utilities, undef ) {


  /** @constructor */
  function Block (options) {
    this.options = {
      ready: ['template:ready', function () {
        this.setContext(this.options.context)
        this.setContext('$this',this)
        this.bindTemplate()
        this.fillContainer()
        this.ready = true
      }]
    };

    this.setOptions(options)
    this.initialize(this.options)
  }
  Block.prototype = utilities.extend({
    
    initialize: function (options) {
      this.readyReady(options.ready)
      this.setChildren(options.children)
      this.setContainer(options.container)
      this.setTemplate(options.template)
    }

    /**
     *
     *
     *
     */
    ,readyReady: function (args) {
      args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
      var callback = args[args.length -1]
      this.addEvent(args.slice(0,-1),'module:ready',callback.bind(this))
    }

    /**
     *
     *
     */
     ,setOptions: function (options) {
      _options = utilities.make.call(this,'options',{})
      return (function (){
        var  args = arguments
            ,target = args[0]
            ,key
            ,i = 1
            ,l = args.length
            
        for (; i < l; i++) {
          for (key in args[i]) {
            if(utilities.hasOwn.call(args[i], key)) {
              target[key] = args[i][key]
            }
          }
        }
        return target
      }(_options, options))
    } 


  }, TemplateMixin, EventsMixin, BlockMixin )

  return Block;
    
});
