define( function (TemplateMixin) {
  var  mixin
      ,blockCount = 0
      ,ObjectProto = Object.prototype
      ,ArrayProto = Array.prototype
      ,isArray = Array.isArray || function(it) { return typeOf(it,'array') }
      ,forEach = ArrayProto.forEach
      ,slice = ArrayProto.slice
      ,toString = ObjectProto.toString
      ,hasOwn = ObjectProto.hasOwnProperty
      

  function typeOf ( obj, type, is ) {
    is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    return type?type === is:is
  }

  function make ( key, value ) {
    return this[key] = this[key] || value
  }

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

      var key
      for(key in children) {
        if(hasOwn.call(children,key)) {
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
      var  args = isArray('array') ? args : slice.call(arguments,0)
          ,children
          ,_children = make.call(this,'_children',{})
         
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
        if(hasOwn.call(children, key)) {
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
      var  args = isArray(args) ? args : slice.call(arguments,0)
          ,children = this.getChildren()
          ,subSet = {}
          ,rejected = {}
          ,key

      if(args.length > 0) {
        for(key in children) {
          if(hasOwn.call( children, key )){
            if(args.indexOf(key) === -1) {
              subSet[key] = children[key]
            } else {
              rejected[key] = children[key]       
            }
          }
        }
        this._children = subSet
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
      forEach.call(bound, function (el) {
        self.setBoundElement(el.getAttribute('bind'),el)
      })
    }
    
    /**
     *
     *
     */
    ,bindChildren : function () {
      var children = this.getChildren()
      var placeholder, module,parent
      var placeholders = []
      
      for(key in children) {
        placeholder = null
        if(hasOwn.call( children, key )){
          module = children[key]
          placeholder = this.getBoundElement(module.getUniqueId())
          if(!!(placeholder)) {
            parent = placeholder.parentNode
            // Have to reference parent, or make sure it exists
            // because it was throwing some weird
            // `cannot call replaceChild on undefined` error
            parent && parent.replaceChild(module.toElement(), placeholder)
          }
        }
      }
    }

    /**
     *
     *
     */
    ,clearBoundElements: function (args) {
      var  args = (typeOf(args) === 'array')? args : slice.call(arguments,0)
          ,els = this.getBoundElements(args)

      this._bound = {}
    }

    /**
     *
     *
     */
    ,setBoundElement: function (key, element) {

      var  boundElements = make.call(this,'_bound',{})
          ,bound = boundElements[key] = boundElements[key] || []
      bound.push(element)
    }

    /**
     *
     *
     */
    ,getBoundElements: function (args) {
      var  args = (typeOf(args) === 'array')? args : slice.call(arguments,0)
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
          ,_bound = make.call(this,'_bound',{})

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
        this.placeholder = document.createElement('span')
        frag.appendChild(this.placeholder)
      }
      return frag
    }
  }
  
  mixin.getBound = mixin.getBoundElement
  mixin.getChildHTML = mixin.getChildHtml
  mixin.getChildrenHTML = mixin.getChildrenHtml
  
  return mixin
})