require.debug && console.log('Blocks/Block Loaded.');

define(['Base/Core/Class','Base/Class/Options','Base/Class/Events'], 
function(Class,Options,Events) {
  /* 
    *  This is the basic building blocks of our nested templating.
    *  
    *
    */
  var Block = new Class({
     Extends: Options
    ,_children:{}
    ,_modules:{}
    ,_module:null
    ,options:{
      module:{}
    }
    
    
    /* 
    * 
    */
    ,initialize: function(module,options){
      
      if(module) 
        this.setModule(module);
      
      if(options.children){
        this.addChildren(options.children);
        delete options.children;
      }
      
      if(options.template){
        this.options.module.template = options.template;
      }
      
      this.setOptions(options);
    }
    
    /* 
    * 
    */
    ,setModule: function(module){
      var self = this;
      
      if(typeof module === 'string' && module.indexOf('::')){
        this.loadModule(this.parseModuleName(module));
      }
      this.module = module;
    }
    
    ,loadModule: function(module){
      var self = this
          ,mod;
      require([module],function(Module){
        mod = self._modules[module] = new Module((self.options.module || {}));
        self.setModule(module);
      });
    }
    
    ,parseModuleName: function(name){
      if(typeof name !== 'string') 
        throw new Error('`parseModuleName` requires a string for the first argument');
        
      var module = name.split('::');
      return ['Modules',module[0],'blocks',module[1],'index'].join('/');
    }
    
    ,_setupModule: function(){
    
    }
    
    /* 
    * 
    */
    ,getModule: function(module){
      return this._module;
    }
    
    /* 
    * 
    */
    ,addChild:function(/* String */ key,/* Block */ block){
      if(!(block instanceof Block)) 
        throw new Error('`addChild` requires the second argument to be an instance of a block');

      this._children[key] = block;
    }
    
    /* 
    * 
    */
    ,addChildren:function(/* Object */ children ){
      for(var key in children){
        if(children.hasOwnProperty(key))
        this.addChild(key,children[key]);
      }
    }

    /* 
    * 
    */
    ,removeChild:function(children){
      var children = Array.isArray(children) ? 
            children : 
            Array.prototype.slice.call(arguments,0)
          ,count = children.length
          ,key;

      while(count--){
        key = children[count];
        if(this._children[key])
        delete this._children[key];
      }
    }
    ,toHtml: function(){
      return this.template.toHtml();
    }
  });
  
  /* Alias's */
  Block.prototype.removeChildren = Block.prototype.removeChild;
  
	return Block;
});