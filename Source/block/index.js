define(['./mixin','../template/mixin', '../mediator/mixin'], 
  function ( BlockMixin, TemplateMixin, EventsMixin, undef ) {

  var  ObjectProto = Object.prototype
      ,ArrayProto = Array.prototype
      ,slice = ArrayProto.slice
      ,toString = ObjectProto.toString
      ,hasOwn = ObjectProto.hasOwnProperty

  function typeOf (obj,type, is) {
    is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    return type ? type === is : is
  }

  function make ( key, value ) {
    return this[key] = this[key] || value
  }

  function extend (){
    var  args = arguments
        ,target = args[0]
    if(target === undef) return;

    for (var key, i = 1, l = args.length; i < l; i++) {
      for (key in args[i]) {
        if(hasOwn.call(args[i],key)) {
          target[key] = args[i][key]
        }
      }
    }

    return target
  }

  function implement (key, value, retain){
    var k
    if (key === undef) return

    if (typeOf(key,'object')) {
      for ( k in key ) {
        if (hasOwn.call(key,k)) {    
          implement.call(this,k, key[k])
        }
      }  
      return;
    }

    this[key] = typeOf( value, 'function') ? (retain) ? value : wrap(this, key, value) : value
     
    return this;
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
  function Block (options) {
    this.options = {}
    this.setOptions(options)
    this.initialize()
  }
  Block.prototype = extend({
    initialize: function (options) {
      options = options || this.options
      var  self = this
          ,container = options.container
      this.setChildren(options.children)
      this.setTemplate(options.template)
      this.setContainer(options.container)
      this.setContext(options.context)
      this.setContext('$this',this)
      this.bindTemplate() 
      this.ready = true
    }

    /**
     *
     *
     */
     ,setOptions: function (options) {
      _options = make.call(this,'options',{})
      return (function (){
        var  args = arguments
            ,target = args[0]
            ,key
            ,i = 1
            ,l = args.length
            
        for (; i < l; i++) {
          for (key in args[i]) {
            if(hasOwn.call(args[i], key)) {
              target[key] = args[i][key]
            }
          }
        }
        return target
      }(_options,options))
    } 

    // parent: function (){
    //   var  name = this.$caller.$name
    //       ,parent = this.$caller.$parent;
        
    //   if (!parent) {
    //     throw new Error('The method "' + name + '" has no parent.');
    //   }
        
    //   return parent.apply(this, arguments);
    // }
  }, TemplateMixin, EventsMixin, BlockMixin )

  return Block;
    
});
