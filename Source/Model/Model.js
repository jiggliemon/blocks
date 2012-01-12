define(['Base/Core/Class'], function(Class){
  var  data = {}
      ,walk = function(){
        var args = Array.prototype.slice.call(arguments,0).reverse(),
            find = this;

        while(find){
            tmp = find
            find = find[args.pop()];
        };
        return tmp;
      };
  
  var Model = new Class({
    get: function(key,from){
      var value;
      if(key.indexOf('.')){
         value = walk.apply((from || data),key.split('.'));
      }
      return data[key] || value;
    }
  });

  return Model;
});