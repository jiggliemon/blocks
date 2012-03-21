define(['block/mixin','template/mixin', 'mediator/mixin'], 
  function ( BlockMixin, TemplateMixin, EventsMixin, undef ) {

  var  slice = Array.prototype.slice
      ,toString = Object.prototype.toString;

  function typeOf (obj) {
      return toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function extend (){
    var  args = arguments
        ,target = args[0]
    if(target === undef) return;

    for (var key, i = 1, l = args.length; i < l; i++) {
      for (key in args[i]) {
        target[key] = args[i][key]
      }
    }

    return target
  }

  function implement (key, value, retain){
    var k;
    if (key === undef) return;

    if (typeOf(key) === 'object') {
      for ( k in key ) {
        if (key.hasOwnProperty(k)) {    
          implement.call(this,k, key[k]);
        }
      }  
      return;
    }

    this[key] = (typeof value === 'function') ? (retain) ? value : wrap(this, key, value) : value;
     
    return this;
  }

  function wrap (self, key, method){
    function wrapper () {
      var  caller = this.caller 
          ,current = this.$caller
          ,result;

      this.caller = current; 
      this.$caller = wrapper;
      result = method.apply(this, arguments);
      this.$caller = current; 
      this.caller = caller;
      
      return result;
    }

    wrapper.$parent = self[key];
    wrapper.$name = key;
      
    return wrapper;
  }

      
  function BlockProto (methods) {
    implement.call(this,methods);
  }
  BlockProto.prototype = extend({
    parent: function (){
      var  name = this.$caller.$name
          ,parent = this.$caller.$parent;
        
      if (!parent) {
        throw new Error('The method "' + name + '" has no parent.');
      }
        
      return parent.apply(this, arguments);
    }
  }, BlockMixin, TemplateMixin, EventsMixin );

  /** @constructor */
  function Block (methods) {

    function Block () {
      return (this.initialize) ? this.initialize.apply(this, arguments) : this;
    }
    Block.prototype = new BlockProto(methods);

    return  Block;
  }

  return Block;
    
});
