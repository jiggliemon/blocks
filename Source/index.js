
define(['./block'],function (Block){
  var blocks = {}

  return {
     create: function () {
      return Block.apply(this, arguments)
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