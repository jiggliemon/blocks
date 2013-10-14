
define('yeah/mixin',['require','exports','module'],function (require, exports, module) {
var REGEX = /:(latch(ed$)?)/i
var call = 'call'
var _EVENTS_ = '_events'
var _SWITCHED_ = '_switched'
var _LATCHED_ = '_latched'
var _ARGUMENTS_ = '_arguments'


function make (context, key, value ) {
  context[key] = context[key] || value
  return context[key]
}

function typeOf(obj, is) {
  var type = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
  return is? type == is : type
}

function hasOwn (what, key) {
  return Object.prototype.hasOwnProperty.call(what,key)
}

function slice (obj, offset) {
  return Array.prototype.slice.call(obj, offset)
}

function remove (arr, from, to) {
  if (from < 0) return arr
  var rest = arr.slice(parseInt(to || from) + 1 || arr.length)
  arr.length = from < 0 ? arr.length + from : from
  return arr.push.apply(arr, rest)
}

function removeLatched(type){
  var _latched = make(this,_LATCHED_, {})
  if ( type.indexOf(':') !== -1) {
    if ( REGEX.test(type) ) {
      type = type.replace(REGEX,'')
      _latched[type] = 1
    }
  }
  return type
}


var mixin = {
   getEvents: function(key){
     var _events = make(this, _EVENTS_, {})
     var events = _events[key] 
     return key ? events ? events : [] : Object.keys(_events)
  }
  
  ,addCompoundEvent: function ( events, type, callback ) {
    type = removeLatched[call](this,type)
    var  self = this
    var _switched = make(self,_SWITCHED_, {})

    // todo: use yaul/map
    events = events.map(function ( event ) {
      event = removeLatched[call](self, event)
      self.addEvent(event, fireCheck)
      return event
    })

    function fireCheck () {
      var length = events.length
      while ( length-- ) {
        if(!_switched[events[length]]) return
      }

      self.fireEvent(type +':latched')
    }
    
    if ( callback ) {
      self.addEvent(type, callback )
    }

    return self
  } 

  ,addEvent: function( /* Sting */ type, /* Function */ callback ){

    if ( typeOf(type, 'array') ) { 
      return this.addCompoundEvent.apply(this, arguments)
    }

    type = removeLatched.call(this,type)
    
    var  self = this
    var _events = make(self, _EVENTS_, {})
    var events = make(_events, type, [])
    var _args = make(self,_ARGUMENTS_, {})
    var _latched = make(self,_LATCHED_, {})
    var isLatched = _latched[type]

    var callbackType = typeOf(callback)
    if (callbackType == 'function'){
      if (isLatched) {
        callback.apply(self,_args[type])
      } else {
        if (events.indexOf(callback) == -1) {
          events.push(callback)
        }
      }
    } else if (callbackType == 'array') {
      for (var i = 0; i < callback.length; i++) {
        if (typeof callback[i] == 'function') {
          if (isLatched) {
            callback[i].apply(self, _args[type])
          } else {
            if (events.indexOf(callback[i]) == -1) {
              events.push(callback[i])
            }
          }
        }
      }
    } else {
      throw new TypeError('`#addEvent`\'s second argument must be a function or an array') 
    }

    return self
  }

  ,removeEvent: function (type, callback) {
    var self = this
    var _events = make(self, _EVENTS_, {})
    var events = make(_events, type, [])
    var i = events.indexOf(callback)
    if (i) {
      events = remove(events,i)
    }
    return self
  }

  ,addEvents: function(/* Object */ events){
    var self = this
    for ( var key in events ) {
      if ( hasOwn(events, key) ) {
        self.addEvent(key,events[key])
      }
    }
    return self
  }
  
  ,fireEvent: function(/* String */ type) {
    type = removeLatched[call](this,type)
    var self = this
    var _latched = make(self,_LATCHED_, {})
    var _switched = make(self,_SWITCHED_, {})
    var _args = make(self,_ARGUMENTS_, {})
    var _events = make(self, _EVENTS_, {})
    var isLatched = _latched[type]
    var events = _events[type]
    var length = events ? events.length : 0
    var args = slice(arguments,1)
    var i = 0
    
    _switched[type] = 1
    
    if ( events && length ) {
      for ( ; i < length; i++ ) {
        if ( i in events) {
          try{
            events[i].apply(self,args)
          } catch (e) { }
        }
      }
    }
    
    if ( isLatched ) {
      _args[type] = args
      _events[type] = []
    }
    
    return self
  }

  ,hasFired: function (key) {
    var _switched = make(this,_SWITCHED_, {})
    return _switched[key] ? true : false
  }

  ,callMeMaybe: function () {
    var self = this
    var args = arguments
    return  function () { self.fireEvent.apply(self,args) }
  }
}

module.exports = mixin


});

define('yaul/hasOwn',['require','exports','module'],function (require, exports, module) {
module.exports = function hasOwn (what, key) {
  return Object.prototype.hasOwnProperty.call(what,key)
}

});

define('yaul/typeOf',['require','exports','module'],function (require, exports, module) {
module.exports = function typeOf ( item, type, undef ){
  var thetype = typeof item
  
  if (item === null)
    return 'null'

  function toString (it) {
    return Object.prototype.toString.call(it)
  }

  if (thetype === 'object') {
    if (item) {
      var string = toString(item)
      if (typeof item.length === 'number'){
        if (string == '[object Array]') {
          thetype = 'array'
        }

        if (string === '[object Arguments]') {
          thetype = 'arguments'
        }
      } else if((null !== item) && !isNaN(item) && ("undefined" !== typeof item.getDate)){
        thetype = 'date'
      }

      if(string === '[object RegExp]') {
        thetype = 'regexp';
      }

      if (item.nodeName){
        if (item.nodeType === 1) {
          thetype =  'element';
        } else if (item.nodeType === 3) {
          thetype = (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
        }
      }
    } else {
      thetype = 'null';
    }
  }

  return (type === undef) ? thetype: thetype === type;
}
});

define('yaul/extend',['require','exports','module','./hasOwn','./typeOf'],function (require, exports, module) {
var hasOwn = require('./hasOwn')
var typeOf = require('./typeOf')

function extend () {
  var  target = arguments[0] || {}
      ,i = 1
      ,length = arguments.length
      ,options, name, src, copy, copyIsArray, clone

  if ( length <= 1 ) {
    throw new Error('`extend` requires at least two arguments.');
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && typeof target !== 'function' ) {
    target = {}
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) !== null) {
      // Extend the base object
      for (name in options) {
        if(hasOwn(options,name)){
          src = target[name]
          copy = options[name]

          // Prevent never-ending loop
          if ( target === copy ) {
            continue
          }

          // Recurse if we're merging plain objects or arrays
          if ( copy && ( typeOf(copy,'object') || (copyIsArray = typeOf(copy, 'array')))) {
            if ( copyIsArray ) {
              copyIsArray = false
              clone = src && typeOf(src, 'array') ? src : []

            } else {
              clone = src && typeOf(src,'object') ? src : {}
            }

            // Never move original objects, clone them
            target[ name ] = extend(clone, copy)

          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy
          }
        }
      }
    }
  }

  // Return the modified object
  return target
}

module.exports = extend

});

define('yaul/slice',['require','exports','module'],function (require, exports, module) {
module.exports = function slice (obj, offset) {
  return Array.prototype.slice.call(obj, offset)
}

});

define('blocks/main',[
   'yeah/mixin'
  ,'yaul/extend'
  ,'yaul/slice'
], function ( 
   MediatorMixin
  ,extend
  ,slice
){

  var Blocks = extend({
    _: {
       blocks: {}
      ,layouts: {}
    }
    
    ,config: function () {
      
    }

    ,constructors: {
    }

    ,register: function (key,block) {
      var self = this
      if ( self._.blocks[key] ) {
        throw new Error('A block with the name `'+ key +'` already exists')
      }

      self._.blocks[key] = block
    }

    ,addLayout: function (key, layout, where) {
      var self = this
      self._.layouts[key] = new Layout(key, layout, where)
    }

    ,showLayout: function (key, where) {
      var self = this
        , layout = self._.layouts[key]
        , block
      
      if ( !layout ) {
        window.console && console.warn('Theres no layout with the key `'+key+'`.')
        return
      }

      where = (where || layout.getWhere()).split('#')
      
      if ( typeof layout.getBlock() === 'function' ) {
        layout.block = layout.block()
      }

      block = this.reference(where[0])
      if (block) {
        block.emptyChildNode(where[1])
        block.setChild(where[1], layout.block)
      }
    }
    
    ,reference: function (key) {
      // Make this walk a path
      var self = this
      return self._.blocks[key]
    }
  }, MediatorMixin)

  return Blocks
})
;
define('blocks', ['blocks/main'], function (main) { return main; });

define('yaul/make',['require','exports','module'],function (require, exports, module) {
module.exports = function make (context, key, value ) {
  context[key] = context[key] || value
  return context[key]
}

});

define('yaul/forEach',['require','exports','module'],function (require, exports, module) {
module.exports = function forEach (what, fn) {
  return Array.prototype.forEach.call(what, fn)
}

});

define('yaul/isArray',['require','exports','module'],function (require, exports, module) {
module.exports = function isArray (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

});

define('yaul/isElement',['require','exports','module'],function (require, exports, module) {
module.exports = function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  } catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have. (works on IE7)
    return (typeof obj==="object") && (obj.nodeType===1) && (typeof obj.style === "object") && (typeof obj.ownerDocument ==="object")
  }
}
});

define('yaul/trim',['require','exports','module'],function (require, exports, module) {
// http://blog.stevenlevithan.com/archives/faster-trim-javascript
// http://perfectionkills.com/whitespace-deviations/
var ws = "[\
    \x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\
    \u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\
    \u2029\uFEFF\
  ]"
  , trimBeginRegexp = new RegExp("^" + ws + ws + "*")
  , trimEndRegexp = new RegExp(ws + ws + "*$")
    
module.exports = function trim (str) {
    return String(str).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
}

});

define('blocks/block/mixin',['require','exports','module','yaul/make','yaul/forEach','yaul/isArray','yaul/isElement','yaul/hasOwn','yaul/slice','yaul/trim'],function (require, exports, module) {
var make = require('yaul/make')
var forEach = require('yaul/forEach')
var isArray = require('yaul/isArray')
var isElement = require('yaul/isElement')
var hasOwn = require('yaul/hasOwn')
var slice = require('yaul/slice')
var trim = require('yaul/trim')
//var querySelect = require('yaul/querySelect')

var blockCount = 0
var mixin = {

  /**
   *  #setChild
   *  todo: Allow you to place where in the array you place the child
   *
   *  @param {string} key The childs name
   *  @param {block} value  
   */
   setChild: function setChild ( key, value /*, where */ ) {

    if (key === undefined || value === undefined) {
      return
    }

    var self = this
    var child = make( self.getChildren(), key, [])
    var el = self.getBoundElement(key)
    var block, type = typeof(value)

    if ( isArray(value)) {
      forEach(value, function( instance ){
        type = typeof instance
        block = (type == 'function')? new instance : 
                    (type == 'array')   ? new instance[0](instance[1],instance[2],instance[3]):
                    instance

        child.push(block)
        if (el) {
          el.appendChild(block.toElement())
        }
      })
    } else {
      block = (type == 'function')? new value : 
              (type == 'array')   ? new value[0](value[1],value[2],value[3]):
              value
      child.push(value)
      if (el) {
        el.appendChild(value.toElement())
      }
    }

    return self
  }

  /**
   * #getChild
   *
   *
   */
  ,getChild: function getChild ( key ) {
    return this.getChildren()[key]
  }
  
  /**
   * #removeChild
   *
   *
   */ 
  ,removeChild: function removeChild ( key ) {
    return this.removeChildren(key)
  }

  /**
   * #setChildren
   *
   *
   */ 
  ,setChildren: function setChildren (children) {
    if ( !children ) {
      return
    }

    for ( var key in children ) {
      if ( hasOwn(children,key) ) {
        this.setChild(key, children[key])
      }
    }
  }

  /**
   *  #getChildren
   *  
   *  getChildren(key [,...]) // { key: `Block` child }
   */
  ,getChildren: function getChildren ( arr ) {
    var  args = isArray(arr)? arr: slice( arguments )
    var _children = make(this,'_children',{})
    var children
       
    if ( args.length > 0 ) {
      children = {}
      forEach(args, function ( arg ) {
        children[arg] = this.getChild(arg)
      })
    }
      
    return children || _children
  }
  
  /**
   *  #getChildHtml
   *  
   *  getChildHtml(key) 
   */
  ,getChildHtml: function getChildHtml ( key ) {
    var child = this.getChild(key)
    var html = child && child.map( function ( block ) { 
      return String(block) 
    }).join('\n')
    return html
  }

  /**
   *  #removeChildren
   *  removeChildren("key" [,...]) // { "key":  `Block` child }
   *
   *  returns Hash of removed children who's keys match the ones passed
   *
   *  @param {array || arguments} args The keys to remove from the children
   *  
   */
  ,removeChildren: function removeChildren ( arr ) {
    var self = this  
    var args = isArray(arr)? arr : slice(arguments,0)
    var children = self.getChildren()
    var subSet = {}
    var rejected = {}
    var key

    if ( args.length > 0 ) {
      for ( key in children ) {
        if ( hasOwn(children, key) ) {
          if ( args.indexOf(key) === -1 ) {
            subSet[key] = children[key]
          } else {
            rejected[key] = children[key] 
            self.emptyChildNode(key)      
          }
        }
      }
      self._children = subSet
    }
      
    return rejected
  }

  /**
   *  #emptyChildNode
   *
   *  This removes the children of a block placeholder;
   *  it doesn't remove the children from the block, it only 
   *  manipulates the node
   */
  ,emptyChildNode: function emptyChildNode ( key ) {
    var el = this.getBoundElement(key)
    if ( el && el.children.length ) {
      forEach(el.children, function ( child, index ) {
        el.removeChild(child)
        delete el.children[child]
      })
    }
  }

  /**
   * #attachEvents
   *
   *
   */
  ,attachEvents: function attachEvents () {
    var self = this
    var _events = make(this,'events',{})
    var el, identifier, events, event, e, fn, key, k

    for ( key in _events ) {
      if ( hasOwn(_events,key) ) {
        events = _events[key]
        el = self.getBoundElement(key)

        if (el) {
          for ( k in events ) {
            if ( hasOwn(events, k) ) {
              eventKeys = k.split(',')
              event = events[k]

              while (eventKeys.length) {
                e = eventKeys.pop()
                if ( e ) {
                  self.bindEvent(el, trim(e).toLowerCase(), event)
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * #detachEvents
   *
   *
   */
  ,detachEvents: function () {

  }
  
  /**
   *  #bindEvent
   *
   *
   */
  ,bindEvent: function bindEvent ( el, event, fn ) {
    var self = this
    if ( el.addEventListener ) {
      el.addEventListener(event,  function (e) {
        fn.call(this, e, self)
      }, false); 
    } else if ( el.attachEvent ) {
      el.attachEvent('on'+event, function (e) {
        fn.call(this, e, self)
      });
    }
  }

  /**
   *  #unbindEvent
   *
   *
   */
  ,unbindEvent: function unbindEvent ( el, event, fn ) {
    if ( el.removeEventListener ) {
      el.addEventListener(event, fn, false); 
    } else if ( el.detachEvent ) {
      el.detachEvent('on'+event, fn);
    }
  }

  /**
   *  #bindTemplate
   *
   */
  ,bindTemplate: function bindTemplate () {
    var self = this 
    var blank = document.createElement('div')
    var container = self.getContainer()

    blank.innerHTML = self.compile(self._context, self)
    
    while ( blank.children.length ) {
      container.appendChild(blank.children[0])
    }
  }
  
  /**
   *  #bindElements
   *
   */
  ,bindElements: function bindElements ( el ) {
    var self = this
    var bound

    if(!isElement(el)) {
      throw new Error(Block.errors.parseElements[0])
    }

    self.clearBoundElements()
    bound = el.querySelectorAll('[bind],[block],block,b[name]')

    forEach(bound, function ( el ) {
      var key = el.getAttribute('bind')
      var tagName = el.tagName.toLowerCase()

      if ( !key && ((tagName === 'block') || (tagName === 'b')) ) {
        key = el.getAttribute('name')
      }
      self.setBoundElement(key,el)
    })
  }
  
  /**
   *  #bindChildren
   *
   */
  ,bindChildren : function bindChildren () {
    var self = this
    var children = self.getChildren()
    var placeholder
    var module
    var parent
    var placeholders = []
    
    for ( key in children ) {
      placeholder = null
      if ( hasOwn(children, key) ) {
        modules = children[key]
        placeholder = self.getBoundElement(key)
        if ( !!(placeholder) && isArray(modules) && modules.length > 0 ) {
          forEach( modules, function ( module ) {
            placeholder.appendChild(module.toElement())
          })
        }
      }
    }
  }

  /**
   *  #clearBoundElements
   *
   */
  ,clearBoundElements: function clearBoundElements ( arr ) {
    var args = isArray(arr)? arr: slice(arguments)
    var els = this.getBoundElements(args)

    this._bound = {}
  }

  /**
   *  #setBoundElements
   *
   */
  ,setBoundElement: function setBoundElement ( key, element ) {
    var boundElements = make(this,'_bound',{})
    var bound = boundElements[key] = boundElements[key] || []
    bound.push(element)
  }

  /**
   *  #getBoundElements
   *
   */
  ,getBoundElements: function getBoundElements ( args ) {
    var self = this
    var args = isArray(args) ? args: slice(arguments)
    var elements = {}

    if ( args.length ) {
      forEach(args, function (el) {
        elements[el] = self.getBoundElement(el)
      })
    } else {
      elements = self._bound
    }

    return elements
  }
  
  /**
   *  #getBoundElement
   *
   */
  ,getBoundElement: function getBoundElement ( key ) {
    var element
    var _bound = make(this,'_bound',{})

    if ( !(element = _bound[key]) ) {
      return undefined
    }
    return (element.length === 1) ? element[0]: element
  }
 
  /**
   *  #getContainer
   *
   */ 
  ,getContainer: function getContainer () {
    var self = this
    return self.container || self.setContainer()
  }

  /**
   *  #setContainer
   *
   */ 
  ,setContainer: function setContainer ( container ) {
    return this.container = (container) ? 
                  ((typeof container === 'string') ? document.createElement(container):container)
                  :document.createElement('div')
  }
  
  ,cleanUp: function cleanUp () {

  }

  /**
   *  #getUniqueId
   *
   *
   */ 
  ,getUniqueId: function getUniqueId () {
    var self = this
    return self._uniqueId = make(self, '_uniqueId', Date.now().toString(36) + (blockCount++))
  }
 
  /**
   *  #toString
   *
   *
   */ 
  ,toString: function toString () {
    return '<span bind="'+ this.getUniqueId() +'" data-type="module"></span>'
  }

  /**
   *  #fillContainer
   *
   */
  ,fillContainer: function fillContainer ( frag ) {
    var self = this
    var container = self.getContainer()
    var clone = container.cloneNode(true)
    var frag = frag || document.createDocumentFragment()
    
    self.bindElements(clone)
    self.attachEvents && self.attachEvents.call(this)

    while ( clone.children.length ) {
      frag.appendChild(clone.children[0])
    }

    self.bindChildren()

    if ( self.placeholder ) {
      self.placeholder.parentNode.replaceChild(frag, self.placeholder)
      delete self.placeholder
    }
  }

  /**
   *  #toElement
   *
   *
   */ 
  ,toElement: function toElement () {
    var frag = document.createDocumentFragment()
    var placeholder
    var self = this

    if ( self.ready ) {
      self.fillContainer(frag)
    } else {
      placeholder = self.placeholder = document.createElement('div')
      placeholder.setAttribute('class','block-loading')
      frag.appendChild(placeholder)
    }
    self.fireEvent('after:toElement')
    
    return frag
  }

  ,inject: function (where) {
    if (typeof where === 'string') {
      where = document.getElementById(where)
    }
    where.appendChild(this.toElement())
    return this
  }
}

mixin.bound = mixin.getBoundElement
mixin.getChildHTML = mixin.getChildHtml
mixin.getChildrenHTML = mixin.getChildrenHtml
  
module.exports = mixin

});

define('yate/mixin',['require','exports','module','yaul/hasOwn','yaul/forEach','yaul/typeOf','yaul/make','yaul/trim'],function (require, exports, module) {
var hasOwn = require('yaul/hasOwn')
var forEach = require('yaul/forEach')
var typeOf = require('yaul/typeOf')
var make = require('yaul/make')
var trim = require('yaul/trim')
var compiledFns = {}

var isPath = function  ( str ) {
  if(!str) return !!0;
  str = trim(String(str))

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

var escape = function (string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

var pathRegexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi

var TemplateMixin = {
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
   *  #setContext
   *
   *
   */ 
  ,setContext: function (key, value) {
    var self = this
    var context = self.getContext()
    var k

    if ( typeOf(key, 'object') ) {
      for ( k in key ) {
        if ( hasOwn(key,k) ) {
          self.setContext(k, key[k])
        }
      }
      return
    }

    context[key] = value
    return self
  }

  /**
   *  #getContext
   *
   *
   */ 
  ,getContext: function (args) {
    args = typeOf(args,'array') ? args : Array.prototype.slice.call(arguments,0)
    var context = make(this, '_context', {})

    if ( arguments.length > 0 ) {
      forEach(args, function (arg) {
        context[arg] = this._context[arg]
      })
    }

    return context
  }
  
  /**
   *  #setTags
   *  
   *
   */ 
  ,setTags: function ( tags) {
    for ( var key in tags) {
      if ( hasOwn(tags,key) ) {
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
   *  #getTags
   *  @returns {Object} Key/Value hash with the value of the open and close tags
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
    // todo: use yaul/trim
    
    str = trim(str).replace(/\\?'/g,"\\'")

    if (!str) {
      return
    }

    var self = this

    if ( isPath(str) ) {
      window.require([str], function (tmpl) {
        self._template = trim(tmpl).replace(/\\?'/g,"\\'")
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
    return this._template || ''
  }

  /**
   *
   *
   *
   */ 
  ,parseOperators: function () {
    var key
    var operator
    var operators = this._templateOperators

    for ( key in operators ) {
      if ( hasOwn(operators, key) ) {
        operator = operators[key]
        if ( typeof operator[0] === 'string' ) {
          this.addOperator(key, operator[0], operator[1])
        }
      }
    }
  }

  /**
   *  #getOperators
   *  
   *  @returns {Object}
   */ 
  ,getOperators: function () {
    var self = this

    if ( !self._operatorsParsed ) {
      self.parseOperators()
    }
    
    return self._templateOperators
  }

  /**
   *  #addOperator
   *
   *  @param {String} name
   *  @param {String|Regexp} regexp
   *  @param {Function|String} fn
   */ 
  ,addOperator: function ( /* String */ name, /* || String */ regexp, /* Function || String */ fn) {
    var self = this
    // This will be part of a str.replace method
    // So the arguments should match those that you would use
    // for the .replace method on strings.
    if ( !typeOf(regexp, 'regexp') ) { // todo: Fix Duck Typing for regexp
      regexp = new RegExp(self.getTag('open') + regexp + self.getTag('close'), 'g')
    }
    
    self._templateOperators[name] = [regexp, fn]
  }

  /**
   *  #compile
   *
   *  @param {Object} context
   *  @param {Object} model
   */ 
  ,compile: function ( /* Object */ context, model ) {
    data = context || this.getContext()
    var self = this
    var template = self.getTemplate()
    var tmpl = !template ? "<b>No template</b>" : template.replace(/[\r\t\n]/g, " ")

    if (!compiledFns[tmpl]) {
      var open = self.getTag('open')
      var close = self.getTag('close')
      var operators = self.getOperators()
      var key
      var body
      var head = 'var p=[],print=function(){p.push.apply(p,arguments);};'
      var wrapper = ["with(__o){p.push('", "');}return p.join('');"]

      for ( key in operators ) {
        if ( hasOwn(operators,key) ) {
          tmpl = tmpl.replace(operators[key][0], operators[key][1])
        }
      }

      // This method will evaluate in the template.
      tmpl = tmpl.replace(new RegExp(open + '([\\s\\S]+?)' + close, 'g'), function ( match, code ) {
        return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + ";p.push('"
      })

      // Close off the template string.
      tmpl = tmpl.split("\t").join("');").split("\r").join("\\'")

      try {
        body = head + wrapper.join(tmpl)
        compiledFns[tmpl] = new Function('__o', head + wrapper.join(tmpl))
      } catch (ex) {
        window.console && console.warn(ex) && console.warn(body)
      }
    }
    return compiledFns[tmpl].call(model,data)
  }
}

module.exports = TemplateMixin

});

/**
 * @license RequireJS text 2.0.3 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

define('text',['module'], function (module) {
    

    var text, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.3',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var strip = false, index = name.indexOf("."),
                modName = name.substring(0, index),
                ext = name.substring(index + 1, name.length);

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                strip = strip === "strip";
                ext = ext.substring(0, index);
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + '.' +
                                     parsed.ext) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback) {
            var xhr = text.createXhr();
            xhr.open('GET', url, true);

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});
define('text!blocks/block/styles.css',[],function () { return 'b[name] {\n  display: block;\n  font-weight: normal;\n}';});

define('blocks/block/index',['require','exports','module','../main','./mixin','yate/mixin','yeah/mixin','yaul/hasOwn','yaul/forEach','yaul/slice','yaul/isArray','yaul/make','yaul/typeOf','text!./styles.css'],function (require, exports, module) {
var blocks = require('../main')
var BlockMixin = require('./mixin')

var TemplateMixin = require('yate/mixin')
var MediatorMixin = require('yeah/mixin')
var hasOwn = require('yaul/hasOwn')
var forEach = require('yaul/forEach')
var slice = require('yaul/slice')
var isArray = require('yaul/isArray')
var make = require('yaul/make')
var typeOf = require('yaul/typeOf')
var css = require('text!./styles.css')

;(function () {
  var style = document.createElement('style')
  style.innerHTML = css
  var s = document.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(style, s)
}())

function extend (obj) {
  forEach(slice(arguments, 1),function(source){
    for (var property in source) {
      if (hasOwn(source,property)) {
        obj[property] = source[property]
      }
    }
  })
  return obj;
}

/** @constructor */
function Block ( arg1, arg2, arg3 ) {

  if ( !(this instanceof Block) ) {
    return new Block( arg1, arg2, arg3 )
  }
  
  var self = this
  // new Block('name', {
  //   ... options ...
  // }[,{...methods...}])
  var type1 = typeOf(arg1)
  var type2 = typeOf(arg2)

  if ( type1 === 'string' ) {
    self.key = arg1
    self.setOptions(arg2 || {})
    blocks.register(arg1,self)

  } else if (type1 === 'object' || type1 === 'undefined') {
    self.setOptions(arg1 || {})
  }


  self.initialize(self.options)
}


Block.prototype = extend({
  
  defaults: {
    onReady: ['template:ready', function blockReady () {
      var self = this
      self.ready = true
      self.bindTemplate()
      self.fillContainer()
    }]
  }

  /**
   *
   *
   *
   */
  ,initialize: function (options) {
    var self = this
    self.readyReady()

    // if(options.attachEvents) {
    //   self.attachEvents = options.attachEvents
    // }
    make(this,'events', options.events || {})

    if (options.lang || options.context) {
      self.setContext(extend({},options.lang, options.context))
    }
    self.setContext('id',self.getUniqueId())
    self.setChildren( options.children )
    self.setContainer( options.container )
    self.setTemplate( options.template || this.template )
  }

  /**
   *
   *
   *
   */
  ,readyReady: function (args) {
    var self = this
    if(!args && self.options.onReady) {
      args = self.options.onReady
    } else {
      return
    }
    
    args = isArray(args) ? args : slice(arguments,0)
    // todo: wtf is going on in here
    var callback = args[args.length -1]
    self.addEvent(Array.prototype.slice.call(args,0,-1),'block:ready', callback.bind(self))
  }

  /**
   *
   *
   */
   ,setOptions: function (options) {
    var self = this
    var _options = make(self,'options',{})
    var _defaults = make(self,'defaults',{})
    return extend(_options, _defaults, options || {})
  } 


}, TemplateMixin, MediatorMixin, BlockMixin )

Block.create = function ( defaults, methods ) {
  function constructor ( arg1, arg2 ) {
    var self = this
    
    Block.prototype.setOptions.call(self, defaults)
    
    // new Block('name', {
    //   ... options ...
    // }[,{...methods...}])
    var type1 = typeOf(arg1)
    var type2 = typeOf(arg2)

    if ( type1 === 'string' ) {
      self.key = arg1
      self.setOptions(arg2 || {})
      blocks.register(arg1,self)
    } else if (type1 === 'object' || type1 === 'undefined') {
      self.setOptions(arg2 || {})
    }

    self.construct && self.construct.call(this, self.options)
    self.initialize(self.options)
  }

  constructor.prototype = extend(methods || {}, Block.prototype)

  return constructor
}

blocks.block = Block

module.exports = Block



});

define('blocks/block',['require','exports','module','./block/index'],function (require, exports, module) {
module.exports = require('./block/index')
});

define('yeah/index',['require','exports','module','./mixin'],function (require, exports, module) {
var MediatorMixin = require('./mixin')

var extend = function (foo, baz) {
  for (var key in baz) {
    if(baz.hasOwnProperty(key)) {
      foo[key] = baz[key]
    }
  }
  return foo
}

function Mediator (arg){
  if (arg) { 
    return extend(arg, MediatorMixin) 
  }

  var self = this
  self._events = {}
  self._latched = {}
  self._arguments = {}
  self._switched = {}

}

Mediator.prototype = extend({}, MediatorMixin)

extend(Mediator, MediatorMixin)

if (typeof document !== 'undefined') {
  var slice = Array.prototype.slice
  var s = document.createElement('script')
  var addNodeMethod = s.addEventListener ? 'addEventListener':'attachEvent'
  var removeNodeMethod = s.removeEventLisnener ? 'removeEventLisnener':'detachEvent'

  extend(Mediator, {
     emit : function () {
      if (arguments.length) {
        s.dispatchEvent.apply(s,arguments)
      }

      return this
    }

    ,addListener : function ( node, event, fn, capture ) {
      var hasNode = typeof node == 'string'?1:0
      var el = hasNode?s:node
      el[addNodeMethod].apply(el,slice.call(arguments, hasNode))
    }

    ,removeListener : function ( node, event, fn, capture ) {
      var hasNode = typeof node == 'string' ?1:0
      var el = hasNode?s:node
      el[removeNodeMethod].apply(el,slice.call(arguments, hasNode))
    }
  })
  
  Mediator.on = Mediator.addListener
  Mediator.off = Mediator.removeListener
}

module.exports = Mediator;

});

define('yeah', ['yeah/index'], function (main) { return main; });

define('yate/index',['require','exports','module','./mixin','yaul/extend'],function (require, exports, module) {
var TemplateMixin = require('./mixin')
var extend = require('yaul/extend')

var config = module.config()

function Template (config) {
  config = config || {}
  var self = this
  self._template = null
  self._context = {}
  if( (typeof config.template === 'string') || (typeof config == 'string') ) {
    self._template = config.template || config
  }
} 

Template.prototype = extend({}, TemplateMixin)
Template.setTags = Template.prototype.setTags

if (config.tags) {
  Template.setTags(config.tags)
}

module.exports = Template

});

define('yate', ['yate/index'], function (main) { return main; });
