require.debug && console.log('blocks/template Loaded.');

define(['Base/Core/Class','Base/Class/Events','Request/Request'],
function(Class,Events, Request){
  var Template = new Class({
     Extends: Events
    ,raw:''
    ,parsed: ''
    ,path: ''
    ,initialize: function(path){
      this.requestTemplate(path);
    }
    
    ,getTemplate: function(key){
      return this._templates[key];
    }
    
    ,requestTemplate: function(tmpl){
      var self = this;
      
      new Request({
         url: tmpl
        ,method:'get'
        ,onComplete: function(response){
          self.raw = response;
          self.fireEvent('template.loaded',self);
        }
      }).send();

    }
    
    ,toHtml: function(){
      return this.parsed || this.raw;
    }
    /*
    * Masking events
    * lest this was used on it's own.
    */
    ,fireEvent: function(){}
    ,addEvent: function(){}
  });

  return Template;
  
});