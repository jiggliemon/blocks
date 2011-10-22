require.debug && console.log('blocks/module loaded');

define(['Base/Core/Class','Blocks/Template'],function(Class,Template){
  
  var Module = new Class({
     initialize: function(){
       
    }
    ,setModel: function(model){
      this._model = model;
    }

    ,getModel: function(){
      return this._model;
    }

    ,setTemplate: function(tmpl){
      this.template = new Template(tmpl);;
    }
    
    ,get: function(key){
      var  model = this.getModel()
          ,value
      try{ value = model && model.get('key'); } catch(e) {}

    }
  });
  
  return Module;
  
})
