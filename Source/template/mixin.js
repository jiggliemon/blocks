define( function () {
  var  toString = Object.prototype.toString
      ,hasOwn = Object.prototype.hasOwnProperty
  
  function typeOf (obj) {
    return toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function escape (string) {
    return ('' + string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  var TemplateMethods = {
     _context: {}
    ,_template: null
    ,_templateTags: {
       open: '<%'
      ,close: '%>'
    }

    ,_templateOperators: {
       interpolate: ['=([\\s\\S]+?)', function (match, code) {
        return "'," + code.replace(/\\'/g, "'") + ",'";
      }]
      ,escape: ['-([\\s\\S]+?)', function (match, code) {
        return "',escape(" + code.replace(/\\'/g, "'") + "),'";
      }]
    }
    
    ,setContext: function (key, value) {
      var context = this._context = this._context || {}
      if (typeOf( key ) === 'object') {
        for (var k in key) {
          if (hasOwn.call(key,k)) {
            this.setContext(k, key[k]);
          }
        }
        return;
      }

      context[key] = value;
      return this;
    }

    ,getContext: function (args) {
      var  args = (typeOf(args) === 'array')? args : slice.call(arguments,0)
          ,context = {};;

      if(arguments.length > 0) {
        args.forEach(function (arg) {
          context[arg] = this._context[arg];
        });
      }
      return context;
    }
    
    ,setTags: function ( tags) {
      var key;
      for ( key in tags) {
        if (hasOwn.call(tags,key)) {
          this._templateTags[key] = tags[key];
        }
      }

      return this;
    }

    ,setTag: function( tag, str) {
      this._templateTags[tag] = str;
    }

    ,getTags: function () {
      return this._templateTags;
    }

    ,getTag: function (tag) {
      return this._templateTags[tag];
    }

    ,setTemplate: function ( /* String */ str) {
      if(typeof str === 'string'){
        this._template = str;
        this.fireEvent && this.fireEvent('template:ready:latched',str);
      }
    }

    ,getTemplate: function () {
      return this._template || '<b>No template loaded</b>';
    }

    ,parseOperators: function () {
      var key, operator;

      for (key in this._templateOperators) {
        if (this._templateOperators.hasOwnProperty(key)) {
          operator = this._templateOperators[key];
          if (typeof operator[0] === 'string') {
            this.addOperator(key, operator[0], operator[1]);
          }
        }
      }
    }

    ,getOperators: function () {
      if (!this._operatorsParsed) {
        this.parseOperators();
      }
      return this._templateOperators;
    }

    ,addOperator: function ( /* String */ name, /* || String */ regexp, /* Function || String */ fn) {

      // This will be part of a str.replace method
      // So the arguments should match those that you would use
      // for the .replace method on strings.
      if (typeof regexp.exec !== 'function') { // todo: Fix Duck Typing for regexp
        regexp = new RegExp(this.getTag('open') + regexp + this.getTag('close'), 'g');
      }
      
      this._templateOperators[name] = [regexp, fn];
    }

    ,compile: function ( /* Object */ data) {
      data = data || this._context;
      var  open = this.getTag('open')
          ,close = this.getTag('close')
          ,operators = this.getOperators()
          ,key, body, head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
          ,wrapper = ["with(__o){p.push('", "');}return p.join('');"]
          ,compiled = null
          ,template = this.getTemplate()
          ,inner = (!template) ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ");

      for (key in operators) {
        if (operators.hasOwnProperty(key)) {
          inner = inner.replace(operators[key][0], operators[key][1]);
        }
      }

      // This method will evaluate in the template.
      inner = inner.replace(new RegExp(open + '([\\s\\S]+?)' + close, 'g'), function (match, code) {
        return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + ";p.push('";
      });

      // Close off the template string.
      inner = inner.split("\t").join("');").split("\r").join("\\'");

      try {
        body = head + wrapper.join(inner);
        compiled = new Function('__o', head + wrapper.join(inner));
      } catch (ex) {
        console.error(ex);
        throw new Error('Syntax error in template: function body :: ' + body);
      }
      return compiled(data);
    }
  };

  return TemplateMethods;
});