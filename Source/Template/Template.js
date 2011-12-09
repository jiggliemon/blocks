
define(['Blocks/Template/Mixin','Base/Class','Base/Class/Events','Request/Request'],
function(TemplateMixin, Class, Events, Request){
  var Template = new Class({
     Extends: Mixin
    ,_rawTemplate: null
    ,parsed: ''
    ,path: ''
    ,initialize: function(path){
      this.loadTemplate(path);
    }
    
    ,getTemplate: function(){
      return this._rawTemplate;
    }
    
    ,_loadTemplate: function(tmpl){
      var self = this;
      
      new Request({
         url: tmpl
        ,method:'get'
        ,onSuccess: function(response){
          self._rawTemplate = response;
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
    ,compile: function(data){
        data = data || this;
        var  head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
            ,wrapper = ["with(__o){p.push(\'", "');}return p.join('');"]
            ,compiled = null
            ,inner = this._rawTemplate
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
  
              //operators. like <%, <%=, <%-, <%?
              .replace(/\t=(.*?)%>/g, "',escape($1),'")
              .replace(/\t-(.*?)%>/g, "',$1,'")
              .replace(/\t\?(.*?)%>/g, "',(typeof $1 != 'undefined')?escape($1):'','")
  
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'");

        try {
          compiled = new Function('__o', head + wrapper.join(inner));
        } catch(ex) {
          console.error(ex);
          throw new Error('Syntax error in template');
        }
        
        return compiled(data);
    }
  });

  return Template;
  
});



var Template = new Class({
    _template: null
    ,setTemplate:function(str){
        this._template = str;
    }
    ,getTemplate:function(){
        return this._template || '<b>No template loaded</b>';
    }
    
});
