define(['./mixin','../block/mixin','../template/mixin','../mediator/mixin','../utilities'], 
  function (ModuleMixin, BlockMixin, TemplateMixin, MediatorMixin, utilities, undef) {

  var  Module
      ,ModuleProto

  function implement (key, value, retain){
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

  // function ModuleProto (methods) {

  // }
  // ModuleProto.prototype = 

  /** @constructor */
  function Module (methods) {

    function Module () {
      implement.call(this,methods)
      return (this.initialize) ? this.initialize.apply(this, arguments) : this;
    }
    Module.prototype = utilities.extend({}, ModuleMixin, BlockMixin, TemplateMixin, MediatorMixin )

    return Module
  }

  return Module;
})