
define([],function (){
  var blocks = {}

  return {
    register: function (key,block) {
      if(blocks[key]) throw new Error('A block w/ this name already exists')
      blocks[key] = block
    }
    ,refrence: function (key) {
      return blocks[key]
    }
  }
})