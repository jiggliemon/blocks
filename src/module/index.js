define([
   './mixin'
  ,'../template/mixin'
  ,'../block/mixin'
  ,'../mediator/mixin'
  ,'yaul/typeOf'
  ,'yaul/hasOwn'
  ,'yaul/extend'
], function (
   ModuleMixin
  ,TemplateMixin
  ,BlockMixin
  ,MediatorMixin
  ,typeOf
  ,hasOwn
  ,extend
) {

function implement (key, value, retain, undef){
  var k
  if (key === undef) return

  if (typeOf(key,'object')) {
    for ( k in key ) {
      if (hasOwn(key,k)) {    
        implement.call(this,k, key[k])
      }
    }  
    return;
  }

  this[key] = typeOf( value, 'function') ? (retain) ? value : wrap(this, key, value) : value
  
  return this
}

function wrap (self, key, method){
  function wrapper () {
    var caller = this.caller 
      , current = this.$caller
      , result

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
function Mod (methods) {
  methods = methods || {}
  function Module () {
    // implement.call(this,methods)
    // console.log(methods)
    this.initialize && this.initialize.apply(this, arguments)
  }

  Module.prototype = extend({
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
  }, methods, ModuleMixin, BlockMixin, TemplateMixin, MediatorMixin )

  return Module
}

return Mod

})
