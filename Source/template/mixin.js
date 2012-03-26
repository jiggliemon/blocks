define( function () {
  var  mixin
      ,pathRegexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
      ,op = Object.prototype
      ,ap = Array.prototype
      ,slice = ap.slice
      ,isArray = Array.isArray || function(it) { return typeOf(it,'array') }
      ,toString = op.toString
      ,hasOwn = op.hasOwnProperty
  
  function isPath ( str ) {
    if(!str) return !!0;
    str = String(str).trim()

    // crude check for a dom node
    if(str.charAt(0) === '<') {
      return false
    }
    
    // Crude AMD check
    if(/^te(xt|mplate)!/.test(str)) {
      return true
    }

    // If still not decided, check for path elements
    return pathRegexp.test(str)
  }

  function typeOf (obj, type, is) {
    is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    return type ? type === is : is
  }

  function make ( key, value ) {
    return this[key] = this[key] || value
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
      var context = this.getContext()

      if (typeOf( key ) === 'object') {
        for (var k in key) {
          if (hasOwn.call(key,k)) {
            this.setContext(k, key[k])
          }
        }
        return;
      }

      context[key] = value
      return this
    }

    /**
     *
     *
     *
     */ 
    ,getContext: function (args) {
      var  args = isArray('array') ? args : slice.call(arguments,0)
          ,context = make.call(this, '_context', {})

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
      var key
      for ( key in tags) {
        if (hasOwn.call(tags,key)) {
          this._templateTags[key] = tags[key]
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
      this._templateTags[tag] = str
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
      var self = this;

      if(isPath(str)) {
        require([str],function (tmpl) {
          self._template = tmpl
          self.fireEvent && self.fireEvent('template:ready:latched',tmpl)
        })
      } else {
        this._template = str
        this.fireEvent && this.fireEvent('template:ready:latched',str)
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
      var key, operator

      for (key in this._templateOperators) {
        if (this._templateOperators.hasOwnProperty(key)) {
          operator = this._templateOperators[key]
          if (typeof operator[0] === 'string') {
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
      if (!this._operatorsParsed) {
        this.parseOperators()
      }
      return this._templateOperators
    }

    /**
     *
     *
     *
     */ 
    ,addOperator: function ( /* String */ name, /* || String */ regexp, /* Function || String */ fn) {

      // This will be part of a str.replace method
      // So the arguments should match those that you would use
      // for the .replace method on strings.
      if (!typeOf(regexp, 'regexp')) { // todo: Fix Duck Typing for regexp
        regexp = new RegExp(this.getTag('open') + regexp + this.getTag('close'), 'g')
      }
      
      this._templateOperators[name] = [regexp, fn]
    }

    /**
     *
     *
     *
     */ 
    ,compile: function ( /* Object */ data) {
      data = data || this._context;
      var  open = this.getTag('open')
          ,close = this.getTag('close')
          ,operators = this.getOperators()
          ,key, body, head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
          ,wrapper = ["with(__o){p.push('", "');}return p.join('');"]
          ,compiled = null
          ,template = this.getTemplate()
          ,inner = (!template) ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ")

      for (key in operators) {
        if (operators.hasOwnProperty(key)) {
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