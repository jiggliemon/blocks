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
