define(['../utilities'], function (utilities) {
  var  mixin
      ,blockCount = 0

  mixin = {

    /**
     *  #setChild
     *
     *  @param {string} key The childs name
     *  @param {block} value  
     */
     setChild: function (key, value) {
      if(!key) return
      this.getChildren()[key] = value
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
        if(utilities.hasOwn.call(children,key)) {
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
      var  args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
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
      var  children = this.getChildren.apply(this,arguments)
          ,str = ''
          ,key

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
      args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
      var self = this  
          ,children = self.getChildren()
          ,subSet = {}
          ,rejected = {}
          ,key

      if(args.length > 0) {
        for(key in children) {
          if(utilities.hasOwn.call( children, key )){
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
      utilities.forEach.call(bound, function (el) {
        self.setBoundElement(el.getAttribute('bind'),el)
      })
    }
    
    /**
     *
     *
     */
    ,bindChildren : function () {
      var children = this.getChildren()
      var placeholder, module, parent
      var placeholders = []
      
      for(key in children) {
        placeholder = null
        if(utilities.hasOwn.call( children, key )){
          module = children[key]
          placeholder = this.getBoundElement(key)
          if(!!(placeholder)) {
            placeholder.appendChild(module.toElement())
            // parent = placeholder.parentNode
            // // Have to reference parent, or make sure it exists
            // // because it was throwing some weird
            // // `cannot call replaceChild on undefined` error
            // parent && parent.replaceChild(module.toElement(), placeholder)
          }
        }
      }
    }

    /**
     *
     *
     */
    ,clearBoundElements: function (args) {
      var  args = utilities.isArray(args)? args : utilities.slice.call(arguments,0)
          ,els = this.getBoundElements(args)

      this._bound = {}
    }

    /**
     *
     *
     */
    ,setBoundElement: function (key, element) {

      var  boundElements = utilities.make(this,'_bound',{})
          ,bound = boundElements[key] = boundElements[key] || []
      bound.push(element)
    }

    /**
     *
     *
     */
    ,getBoundElements: function (args) {
      var  args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
          ,elements = {}
          ,self = this
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
      var  element
          ,_bound = utilities.make(this,'_bound',{})

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
      return this.container || this.setContainer()
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
      return this._uniqueId = this._uniqueId || Date.now().toString(36) + (blockCount++)
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
      var  container = this.getContainer()
          ,clone = container.cloneNode(true)
          ,frag = frag || document.createDocumentFragment()
      
      this.bindElements(clone)
      this.attachEvents && this.attachEvents()
      
      while(clone.children.length) {
        frag.appendChild(clone.children[0])
      }

      this.bindChildren()

      if(this.placeholder) {
        this.placeholder.parentNode.replaceChild(frag, this.placeholder)
        delete this.placeholder
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