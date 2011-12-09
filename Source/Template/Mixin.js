define(['Base/Class', 'Request/Request'], function (Class,Request) {
  var options = {
  };
  
  var TemplateMixin = new Class({    
     _template: null
    ,_templateTags: {open:'<%',close:'%>'}
    ,_templateOperators: []
    ,setTags: function( open, close ) {
        var key;
        
        if (typeof open === 'string') {
            this.templateTags[open] = close;
            return this;
        }
        
        for (key in open) {
            if (open.hasOwnProperty(key)) {
                this.templateTags[key] = open[key];
            }
        }
        return this;
    }
    ,getTags: function() {
        return this._templateTags;
    }
    ,getTag: function( tag ) {
        return this._templateTags[tag];
    }
    ,setupOperators: function() {
        // evaluate
        this.addOperator('([\\s\\S]+?)', function(match,code) {
            return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + ";__p.push('"; 
         });
        
        // interpolate
        this.addOperator('=([\s\S]+?)', function(match,code) {
            return "'," + code.replace(/\\'/g, "'") + ",'";
        });

        // escape
        this.addOperator('-([\s\S]+?)', function(match, code) {
            return "',escape(" + code.replace(/\\'/g, "'") + "),'"; 
        });
    }
    ,addOperator: function( /* Regexp || String */regexp, /* Function || String */fn ) {
        
        // This will be part of a str.replace method
        // So the arguments should match those that you would use 
        // for the .replace method on strings.
        if(typeOf(reg) === 'string'){
            regexp = new Regexp(this.tags[0] + regexp + this.tags[1]);
        }
        this.operators.push([regexp,fn]);
    }
    ,setTemplate: function( /* String */ str ){
      this._template = str;
    }
    ,getTemplate: function (){
      return this._template || '<b>No template loaded</b>';
    }
    ,loadTemplate: function( /* String */ url ){
      var self = this;
      new Request({
         method: 'get'
        ,url:url || self.options.template
        ,onSuccess: function(response){
          self.setTemplate(response);
          self.fireEvent('template.loaded',self.getTemplate());
        }
      }).send()
    }
    ,compile: function( /* Object */ data, /* Object */ opts ){
      data = data || this;
      
      if ( !this.opperators.length ){
          this.setupOperators();
      } 
      
      
      var  head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
          ,wrapper = ["with(__o){p.push(\'", "');}return p.join('');"]
          ,compiled = null
          ,key,opperator
          ,template = this.getTemplate()
          ,inner = (!template) ? "<b>No template</b>" : template
            .replace(/[\r\t\n]/g, " ")
            .split(this.getTag('open')).join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r");
            
            // A rather ugly way to append a child's module node to a parent template.
            // todo: break out into plugins
            //.replace(/\t=\$this.getChild\('(.*?)'\)%>/g,"','<span id=\"'+ $this.getChild(\"$1\").get(\"id\") +'\"></span>','")
        
        // This will loop through all the opperators
        // and use the return values to build a function body
        // syntax will look like this: 
        //        <h1><%= something %></h1>
        //        <h1><%- something %></h1>
        this.operators(function(operator){
            inner.replace(operator[key][0],opperator[1]);
        });
        
        // Close off the template string.
        inner.split("\t").join("');").split(this.getTag('close')).join("p.push('").split("\r").join("\\'");

        
      try {
        var body =  head + wrapper.join(inner);
        compiled = new Function('__o', head + wrapper.join(inner));
      } catch(ex) {
        console.error(ex);
        throw new Error('Syntax error in template: function body :: '+ body );
      }
      return compiled(data);
    }
  });
  
  return TemplateMixin;
});
