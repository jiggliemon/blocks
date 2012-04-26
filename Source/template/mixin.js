define(['../utilities'], function (utilities) {
  var  mixin
      ,pathRegexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
  
  function isPath ( str ) {
    if(!str) return !!0;
    str = String(str).trim()

    // crude check for a dom node && multiple lines
    // URL paths shoudln't have either
    if(str.charAt(0) === '<' || /\n/.test(str)) {
      return false
    }
    
    // Crude AMD check
    if(/^te(xt|mplate)!/.test(str)) {
      return true
    }

    // If still not decided, check for path elements
    return pathRegexp.test(str)
  }

  function escape (string) {
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  mixin = {
     _templateTags: {
       open: '<%'
      ,close: '%>'
    }

    ,_templateOperators: {
       interpolate: ['=([\\s\\S]+?)', function (match, code) {
        return "'," + code.replace(/\\'/g, "'") + ",'"
      }]
      ,escape: ['-([\\s\\S]+?)', function (match, code) {
        return "',escape(" + code.replace(/\\'/g, "'") + "),'"
      }]
    }
    
    /**
     *
     *
     *
     */ 
    ,setContext: function (key, value) {
      var  self = this
          ,context = self.getContext()
          ,k

      if (utilities.typeOf( key, 'object')) {
        for (k in key) {
          if (utilities.hasOwn.call(key,k)) {
            self.setContext(k, key[k])
          }
        }
        return
      }

      context[key] = value
      return self
    }

    /**
     *
     *
     *
     */ 
    ,getContext: function (args) {
      var  args = utilities.isArray('array') ? args : utilities.slice.call(arguments,0)
          ,context = utilities.make(this, '_context', {})

      if(arguments.length > 0) {
        args.forEach(function (arg) {
          context[arg] = this._context[arg]
        })
      }

      return context
    }
    
    /**
     *
     *
     *
     */ 
    ,setTags: function ( tags) {
      for ( var key in tags) {
        if (utilities.hasOwn.call(tags,key)) {
          this.setTag(key,tags[key])
        }
      }

      return this
    }

    /**
     *
     *
     *
     */ 
    ,setTag: function( tag, str) {
      this._templateTags[tag] = String(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

      return this
    }

    /**
     *
     *
     *
     */ 
    ,getTags: function () {
      return this._templateTags
    }

    /**
     *
     *
     *
     */ 
    ,getTag: function (tag) {
      return this._templateTags[tag]
    }

    /**
     *
     *
     *
     */ 
    ,setTemplate: function ( /* String */ str) {
      str = String(str).trim().replace(/\\?'/g,"\\'")
      if(!str) return

      var self = this;

      if(isPath(str)) {
        require([str],function (tmpl) {
          self._template = String(tmpl).trim().replace(/\\?'/g,"\\'")
          self.fireEvent && self.fireEvent('template:ready:latched', self._template)
        })
      } else {
        self._template = str
        self.fireEvent && self.fireEvent('template:ready:latched', str)
      }

    }

    /**
     *
     *
     *
     */ 
    ,getTemplate: function () {
      return this._template || '<b>No template loaded</b>'
    }

    /**
     *
     *
     *
     */ 
    ,parseOperators: function () {
      var key, operator, operators = this._templateOperators

      for (key in operators) {
        if (utilities.hasOwn.call(operators, key)) {
          operator = operators[key]
          if (utilities.typeOf(operator[0], 'string')) {
            this.addOperator(key, operator[0], operator[1])
          }
        }
      }
    }

    /**
     *
     *
     *
     */ 
    ,getOperators: function () {
      var self = this
      if (!self._operatorsParsed) {
        self.parseOperators()
      }
      return self._templateOperators
    }

    /**
     *
     *
     *
     */ 
    ,addOperator: function ( /* String */ name, /* || String */ regexp, /* Function || String */ fn) {
      var self = this
      // This will be part of a str.replace method
      // So the arguments should match those that you would use
      // for the .replace method on strings.
      if (!utilities.typeOf(regexp, 'regexp')) { // todo: Fix Duck Typing for regexp
        regexp = new RegExp(self.getTag('open') + regexp + self.getTag('close'), 'g')
      }
      
      self._templateOperators[name] = [regexp, fn]
    }

    /**
     *
     *
     *
     */ 
    ,compile: function ( /* Object */ data) {
      data = data || this._context;
      var  self = this
          ,open = this.getTag('open')
          ,close = this.getTag('close')
          ,operators = this.getOperators()
          ,key, body, head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
          ,wrapper = ["with(__o){p.push('", "');}return p.join('');"]
          ,compiled = null
          ,template = this.getTemplate()
          ,inner = !template ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ")

      for (key in operators) {
        if (utilities.hasOwn.call(operators,key)) {
          inner = inner.replace(operators[key][0], operators[key][1])
        }
      }

      // This method will evaluate in the template.
      inner = inner.replace(new RegExp(open + '([\\s\\S]+?)' + close, 'g'), function (match, code) {
        return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + ";p.push('"
      })

      // Close off the template string.
      inner = inner.split("\t").join("');").split("\r").join("\\'")

      try {
        body = head + wrapper.join(inner)
        compiled = new Function('__o', head + wrapper.join(inner))
      } catch (ex) {
        console && console.warn && console.warn(ex)
        throw new Error('Syntax error in template: function body :: ' + body)
      }
      return compiled(data)
    }
  }

  return mixin
});