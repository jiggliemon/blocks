define(['./block/index','./layout/index'], 
function (block){
  var constructors = {
     block: require('./block/index')
    ,layout: require('./layout/index')
  }
  , blocks = {} 

  return =  {
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
