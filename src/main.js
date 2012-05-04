define(['./layout/index','./block/index'],
function ( Layout, Block ){

  var constructors = {
     block: Block
    ,layout: Layout
  }
  , blocks = {}
  , layouts = {}

  return {
     create: function (name) {
      return constructors[name] && constructors[name].apply(this, [].slice.call(arguments, 1))
    }

    ,register: function (key,block) {
      if(blocks[key]) {
        throw new Error('A block with the name `'+ key +'` already exists')
      }

      blocks[key] = block
    }

    ,addLayout: function (key, layout, where) {
      layouts[key] = new Layout(key, layout, where)
    }

    ,showLayout: function (key, where) {
      var layout = layouts[key]
      where = (where || layout.getWhere()).split('#')
      if (typeof layout.getBlock() === 'function') {
        layout.block = layout.block()
      }

      var block = this.reference(where[0])
      block.emptyChildNode(where[1])
      block.setChild(where[1], layout.block)

    }
    
    ,reference: function (key) {
      return blocks[key]
    }
  }
})