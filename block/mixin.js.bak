var lodash = require('lodash')
var forEach = lodash.forEach
var isArray = lodash.isArray
var forOwn = lodash.forOwn
var trim = lodash.trim
//var querySelect = require('yaul/querySelect')

//Returns true if it is a DOM element    
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string");
}

function make (object, key, def) {
  if (!(key in object)) {
    object[key] = def
  }
  return object[key]
}


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
    var self = this
    if ( !children ) {
      return
    }
    forOwn(children, function ( child, key) {
        self.setChild(key, child)
    })
    return this
  }

  /**
   *  #getChildren
   *  
   *  getChildren(key [,...]) // { key: `Block` child }
   */
  ,getChildren: function getChildren ( arr ) {
    var  args = isArray(arr)? arr: Array.prototype.slice.call( arguments, 0 )
    var _children = this._children = this._children || {}
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
    var args = isArray(arr)? arr : Array.prototype.slice.call(arguments,0)
    var children = self.getChildren()
    var subSet = {}
    var rejected = {}
    var key

    if ( args.length > 0 ) {
      forOwn(children, function(child, key){
        if ( args.indexOf(key) === -1 ) {
          subSet[key] = child
        } else {
          rejected[key] = child 
          self.emptyChildNode(key)      
        }
      })

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
    return this
  }

  // /**
  //  * #attachEvents
  //  *
  //  *
  //  */
  // ,attachEvents: function attachEvents () {
  //   var self = this
  //   self.events = (this.events || {})
  //   var el, identifier, events, event, e, fn, key, k

  //   forOwn(self.events, function (_event,key) {
  //     events = _event
  //     el = self.getBoundElement(key)

  //     if (el) {
  //       forOwn(events, function (event) {

  //       })
  //       for ( k in events ) {
  //         if ( hasOwn(events, k) ) {
  //           eventKeys = k.split(',')
  //           event = events[k]

  //           while (eventKeys.length) {
  //             e = eventKeys.pop()
  //             if ( e ) {
  //               self.bindEvent(el, trim(e).toLowerCase(), event)
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })

  //   return self
  // }

  // /**
  //  * #detachEvents
  //  *
  //  */
   
  // ,detachEvents: function () {

  // }
  
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
    return self
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
    return self
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
    container.innerHTML = ""

    while ( blank.childNodes.length ) {
      container.appendChild(blank.childNodes[0])
    }
    return self
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
    return self
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
    return self
  }

  /**
   *  #clearBoundElements
   *
   */
  ,clearBoundElements: function clearBoundElements ( arr ) {
    var args = isArray(arr)? arr: Array.prototype.slice.call(arguments)
    var els = this.getBoundElements(args)

    this._bound = {}
    return this
  }

  /**
   *  #setBoundElements
   *
   */
  ,setBoundElement: function setBoundElement ( key, element ) {
    var boundElements = this._bound = this._bound || {} 
    var bound = boundElements[key] = boundElements[key] || []
    bound.push(element)
    return this
  }

  /**
   *  #getBoundElements
   *
   */
  ,getBoundElements: function getBoundElements ( args ) {
    var self = this
    var args = isArray(args) ? args: Array.prototype.slice.call(arguments)
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

    while ( clone.childNodes.length ) {
      frag.appendChild(clone.childNodes[0])
    }

    self.bindChildren()

    if ( self.placeholder ) {
      self.placeholder.parentNode.replaceChild(frag, self.placeholder)
      delete self.placeholder
    }
    return self
  }

  /**
   *  #toElement
   *
   *
   */ 
  ,toElement: function toElement (forceRedraw) {
    var frag = document.createDocumentFragment()
    var placeholder
    var self = this

    if (forceRedraw) {
      this.redraw()
    }

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

  ,inject: function (where, forceRedraw) {
    if (typeof where === 'string') {
      where = document.getElementById(where)
    }
    where.appendChild(this.toElement(forceRedraw))
    return this
  }

  ,redraw: function () {
    var self = this
    self.bindTemplate()
    self.fillContainer()
    return self
  }
}

mixin.bound = mixin.getBoundElement
mixin.getChildHTML = mixin.getChildHtml
mixin.getChildrenHTML = mixin.getChildrenHtml
  
module.exports = mixin
