//@ sourceURL = ./blocks/index.js

var Block = require('./block')
var blocks = {}

module.exports =  {
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

//@ sourceURL = ./blocks/index.js
