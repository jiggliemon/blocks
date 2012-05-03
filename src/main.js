define(['./block/index','./layout/index'], 
function (Block, Layout){
  var constructors = {
     block: Block
    ,layout: Layout
  }
  , blocks = {} 

  return {
     create: function (name) {
      return constructors[name] && constructors[name].apply(this, [].slice.call(arguments, 1))
    }
    ,addLayout: function (layout) {
      
    }
    ,register: function (key,block) {
      if(blocks[key]) {
        throw new Error('A block with the name `'+ key +'` already exists')
      }

      blocks[key] = block
    }
    ,refrence: function (key) {
      return blocks[key]
    }
  }
})
