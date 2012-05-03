define(['../utilities'], function(
  utilities
) {
  
var blockCount = 0
  , mixin = {

  /**
   *  Block#setChild
   *  todo: Allow you to place where in the array you place the child
   *
   *  @param {string} key The childs name
   *  @param {block} value  
   */
   setChild: function (key, value /*, where */) {
    if(key == undefined || value == undefined) return

    var child = utilities.make( this.getChildren(), key, [])
    if(utilities.isArray(value)){
      value.forEach(function(ardvark){
        child.push(ardvark)
      })
    } else {
      child.push(value)
    }
    
  }


  /**
   *
   *
   *
   */
  ,getChild: function (key) {
    return this.getChildren()[key]
  }
  
  /**
   *
   *
   *
   */ 
  ,removeChild: function (key) {
    return this.removeChildren(key)
  }

  /**
   *
   *
   *
   */ 
  ,setChildren: function (children) {
    if(!children) return

    for(var key in children) {
      if(utilities.hasOwn(children,key)) {
        this.setChild(key, children[key])
      }
    }
  }

  /**
   *  Block#getChildren
   *  
   *  getChildren(key [,...]) // { key: `Block` child }
   */
  ,getChildren: function (args) {
    var  args = utilities.isArray(args) ? args : utilities.slice(arguments,0)
        ,children
        ,_children = utilities.make(this,'_children',{})
       
    if(arguments.length > 0) {
      children = {}
      args.forEach(function (arg) {
        children[arg] = this.getChild(arg)
      })
    }
      
    return children || _children
  }
  
  /**
   *  Block#getChildHtml
   *  
   *  getChildHtml(key) 
   */
  ,getChildHtml: function (key) {
    var child = this.getChild(key)
    return String(child || '')
  }

  /**
   *  Block#getChildrenHtml
   *  
   *  getChildrenHtml(key) 
   */
  ,getChildrenHtml: function (args) {
    var children = this.getChildren( arguments )
      , str = ''
      , key

    for(key in children) {
      if(utilities.hasOwn.call(children, key)) {
        str += String(children[key])
      }
    }

    return str
  }

  /**
   *  Block#removeChildren
   *  removeChildren("key" [,...]) // { "key":  `Block` child }
   *
   *  returns Hash of removed children who's keys match the ones passed
   *
   *  @param {array || arguments} args The keys to remove from the children
   *  
   */
  ,removeChildren: function (args) {
    args = utilities.isArray(args) ? args : utilities.slice(arguments,0)
    var self = this  
      , children = self.getChildren()
      , subSet = {}
      , rejected = {}
      , key

    if(args.length > 0) {
      for(key in children) {
        if(utilities.hasOwn( children, key )){
          if(args.indexOf(key) === -1) {
            subSet[key] = children[key]
          } else {
            rejected[key] = children[key]       
          }
        }
      }
      self._children = subSet
    }
      
    return rejected
  }
  
  ,bindTemplate: function () {
    var  blank = document.createElement('div')
        ,container = this.getContainer()
    
    blank.innerHTML = this.compile(this._context)
    //this.parseBoundElements(blank)
    
    while( blank.children.length ) {
      container.appendChild( blank.children[0] )
    }
  }
  
  ,bindElements: function (el) {
    var  self = this
        ,bound

    if(!(el instanceof Element)) {
      throw new Error(Block.errors.parseElements[0])
    }
    this.clearBoundElements()
    bound = el.querySelectorAll('[bind]')

    utilities.forEach(bound, function (el) {
      self.setBoundElement(el.getAttribute('bind'),el)
    })
  }
  
  /**
   *
   *
   */
  ,bindChildren : function () {
    var self = this
      , children = self.getChildren()
      , placeholder
      , module
      , parent
      , placeholders = []
    
    for(key in children) {
      placeholder = null
      if(utilities.hasOwn( children, key )){
        modules = children[key]
        placeholder = self.getBoundElement(key)
        if(!!(placeholder) && utilities.isArray(modules) && modules.length > 0) {
          modules.forEach(function( module ){
            placeholder.appendChild(module.toElement())
          })
        }
      }
    }
  }

  /**
   *
   *
   */
  ,clearBoundElements: function (args) {
    var args = utilities.isArray(args)? args : utilities.slice(arguments,0)
      , els = this.getBoundElements(args)

    this._bound = {}
  }

  /**
   *
   *
   */
  ,setBoundElement: function (key, element) {

    var boundElements = utilities.make(this,'_bound',{})
      , bound = boundElements[key] = boundElements[key] || []
    bound.push(element)
  }

  /**
   *
   *
   */
  ,getBoundElements: function (args) {
    var args = utilities.isArray(args) ? args : utilities.slice(arguments,0)
      , elements = {}
      , self = this
    if (args.length) {
      args.forEach(function (el) {
        elements[el] = self.getBoundElement(el)
      })
    } else {
      elements = this._bound
    }

    return elements
  }
  
  /**
   *
   *
   */
  ,getBoundElement: function (key) {
    var element
      , _bound = utilities.make(this,'_bound',{})

    if(!(element = _bound[key])){
      return undefined
    }
    return (element.length === 1) ? element[0]: element
  }
 
  /**
   *
   *
   */ 
  ,getContainer: function () {
    var self = this
    return self.container || self.setContainer()
  }

  /**
   *
   *
   */ 
  ,setContainer: function (container) {
    return this.container = (container) ? 
                  ((typeof container === 'string')?document.createElement(container):container)
                  :document.createElement('div')
  }
  
  /**
   *
   *
   *
   */ 
  ,getUniqueId: function () {
    var self = this
    return self._uniqueId = utilities.make(self, '_uniqueId', Date.now().toString(36) + (blockCount++))
  }
 
  /**
   *
   *
   *
   */ 
  ,toString: function () {
    return '<span bind="'+ this.getUniqueId() +'" data-type="module"></span>'
  }

  ,fillContainer: function (frag) {
    var  self = this
        ,container = self.getContainer()
        ,clone = container.cloneNode(true)
        ,frag = frag || document.createDocumentFragment()
    self.bindElements(clone)
    self.attachEvents && self.attachEvents()

    while(clone.children.length) {
      frag.appendChild(clone.children[0])
    }

    self.bindChildren()


    if(self.placeholder) {
      self.placeholder.parentNode.replaceChild(frag, self.placeholder)
      delete self.placeholder
    }
  }

  /**
   *
   *
   *
   */ 
  ,toElement: function () {
    var frag = document.createDocumentFragment()

    if(this.ready) {
      this.fillContainer(frag)
    } else {
      var placeholder = this.placeholder = document.createElement('div')
      placeholder.setAttribute('class','block-loading')
      frag.appendChild(placeholder)
    }
    return frag
  }
}

mixin.getBound = mixin.getBoundElement
mixin.getChildHTML = mixin.getChildHtml
mixin.getChildrenHTML = mixin.getChildrenHtml
  
return mixin

})
