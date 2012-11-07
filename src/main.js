define([
   'yeah/mixin'
  ,'yaul/extend'
  ,'yaul/slice'
], function ( 
   MediatorMixin
  ,extend
  ,slice
){

  var Blocks = extend({
    _: {
       blocks: {}
      ,layouts: {}
    }
    
    ,config: function () {
      
    }

    ,constructors: {
    }

    ,register: function (key,block) {
      var self = this
      if ( self._.blocks[key] ) {
        throw new Error('A block with the name `'+ key +'` already exists')
      }

      self._.blocks[key] = block
    }

    ,addLayout: function (key, layout, where) {
      var self = this
      self._.layouts[key] = new Layout(key, layout, where)
    }

    ,showLayout: function (key, where) {
      var self = this
        , layout = self._.layouts[key]
        , block
      
      if ( !layout ) {
        window.console && console.warn('Theres no layout with the key `'+key+'`.')
        return
      }

      where = (where || layout.getWhere()).split('#')
      
      if ( typeof layout.getBlock() === 'function' ) {
        layout.block = layout.block()
      }

      block = this.reference(where[0])
      if (block) {
        block.emptyChildNode(where[1])
        block.setChild(where[1], layout.block)
      }
    }
    
    ,reference: function (key) {
      // Make this walk a path
      var self = this
      return self._.blocks[key]
    }
  }, MediatorMixin)

  return Blocks
})
