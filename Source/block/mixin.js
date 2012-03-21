define( function () {
  var blockCount = 0;
  var  typeOf
      ,mixin
      ,forEach = Array.prototype.forEach
      ,slice = Array.prototype.slice
      ,toString = Object.prototype.toString;
  
  function typeOf (obj) {
    return toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
  
  mixin = {
     _children: {}
    ,_bound: {}
    ,_uniqueId: null
    ,initialize: function (options) {
      options = options || this.options;
      var  self = this
          ,container = options.container;
      this.setChildren(options.children);
      this.setTemplate(options.template);
      this.setContainer(options.container);
      this.setContext(options.context);
      this.setContext('$this',this);
      this.bindTemplate(); 
      this.ready = true;
    }

    ,setOptions: function (options) {
      return (function (){
        var  target = arguments[0]
            ,key;
            
        for (key, i = 1, l = arguments.length; i < l; i++) {
          for (key in arguments[i]) {
            target[key] = arguments[i][key]
          }
        }
        return target;
      }(this.options,options));
    } 
    /**
     *  #setChild
     *
     *  @param {string} key The childs name
     *  @param {block} value  
     */
    ,setChild: function (key, value) {
      if(!key) return;

      this._children[key] = value;
    }


    /**
     *
     *
     *
     */
    ,getChild: function (key) {
      return this._children[key];
    }
    
    /**
     *
     *
     *
     */ 
    ,removeChild: function (key) {
      return this.removeChildren(key);
    }

    /**
     *
     *
     *
     */ 
    ,setChildren: function (children) {
      if(!children) return;

      var key;
      for(key in children) {
        if(children.hasOwnProperty(key))
        this.setChild(key, children[key]);
      }
    }

    /**
     *  Block#getChildren
     *  
     *  getChildren(key [,...]) // { key: `Block` child }
     */
    ,getChildren: function (args) {
      var  args = (Array.isArray(args))? args : slice.call(arguments,0)
          ,children;
         
      if(arguments.length > 0) {
        children = {};
        args.forEach(function (arg) {
          children[arg] = this.getChild(arg);
        });
      }
        
      return children || this._children;
    }
    
    /**
     *  Block#getChildHtml
     *  
     *  getChildHtml(key) 
     */
    ,getChildHtml: function (key) {
      return String(this.getChild(key));
    }

    /**
     *  Block#getChildrenHtml
     *  
     *  getChildrenHtml(key) 
     */
    ,getChildrenHtml: function (args) {
      var  children = this.getChildren.apply(this,arguments)
          ,str = '',key;

      for(key in children) {
        if(children.hasOwnProperty(key)) {
          str += String(children[key]);
        }
      }

      return str;
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
      var  args = (Array.isArray(args))? args : slice.call(arguments,0)
          ,children = this.getChildren()
          ,subSet = {}
          ,rejected = {}
          ,key;

      if(args.length > 0) {
        for(key in children) {
          if(children.hasOwnProperty(key)){
            if(args.indexOf(key) === -1) {
              subSet[key] = children[key]
            } else {
              rejected[key] = children[key];       
            }
          }
        }
        this._children = subSet;
      }
        
      return rejected;
    }
    
    ,bindTemplate: function () {
      var  blank = document.createElement('div')
          ,container = this.getContainer();
      
      blank.innerHTML = this.compile(this._context);
      //this.parseBoundElements(blank);
      
      while( blank.children.length ) {
        container.appendChild( blank.children[0] );
      }
    }
    
    ,bindElements: function (el) {
      var  self = this
          ,bound;

      if(!(el instanceof Element)) {
        throw new Error(Block.errors.parseElements[0]);
      }
      this.clearBoundElements();
      bound = el.querySelectorAll('[bind]');
      forEach.call(bound, function (el) {
        self.setBoundElement(el.getAttribute('bind'),el);
      });
    }
    
    /**
     *
     *
     */
    ,bindChildren : function () {
      var children = this.getChildren();
      var placeholder, module,parent;
      var placeholders = [];
      
      for(key in children) {
        placeholder = null;
        if(children.hasOwnProperty(key)){
          module = children[key];
          placeholder = this.getBoundElement(module.getUniqueId());
          if(!!(placeholder)) {
            parent = placeholder.parentNode;
            // Have to reference parent, or make sure it exists
            // because it was throwing some weird
            // `cannot call replaceChild on undefined` error
            parent && parent.replaceChild(module.toElement(), placeholder);
          }
        }
      }
    }

    ,clearBoundElements: function (args) {
      var  args = (Array.isArray(args))? args : slice.call(arguments,0)
          ,els = this.getBoundElements(args)

      this._bound = {};
    }

    ,setBoundElement: function (key, element) {
      var bound = this._bound[key] = this._bound[key] || [];
      bound.push(element);
    }

    ,getBoundElements: function (args) {
      var  args = (Array.isArray(args))? args : slice.call(arguments,0)
          ,elements = {}
          ,self = this;
      if (args.length) {
        args.forEach(function (el) {
          elements[el] = self.getBoundElement(el);
        });
      } else {
        elements = this._bound;
      }

      return elements;
    }
    
    ,getBoundElement: function (key) {
      var element;
      if(!(element = this._bound[key])){
        return undefined;
      }
      return (element.length === 1) ? element[0]: element;
    }
   
    /**
     *
     *
     */ 
    ,getContainer: function () {
      return this.container || this.setContainer();
    }

    /**
     *
     *
     */ 
    ,setContainer: function (container) {
      return this.container = (container) ? 
                    ((typeOf(container)==='string')?document.createElement(container):container)
                    :document.createElement('div');
    }
    
    /**
     *
     *
     *
     */ 
    ,getUniqueId: function () {
      return this._uniqueId = this._uniqueId || Date.now().toString(36) + (blockCount++);
    }
   
    /**
     *
     *
     *
     */ 
    ,toString: function () {
      return '<span bind="'+ this.getUniqueId() +'" data-type="module"></span>';
    }

    ,fillContainer: function (frag) {
      var  container = this.getContainer()
          ,clone = container.cloneNode(true)
          ,frag = frag || document.createDocumentFragment();
      
      this.bindElements(clone);
      this.attachEvents && this.attachEvents();
      
      while(clone.children.length) {
        frag.appendChild(clone.children[0]);
      }
      
      this.bindChildren();

      if(this.placeholder) {
        this.placeholder.parentNode.replaceChild(frag,this.placeholder);
      }
    }

    /**
     *
     *
     *
     */ 
    ,toElement: function () {
      var frag = document.createDocumentFragment();

      if(this.ready) {
        this.fillContainer(frag);
      } else {
        this.placeholder = document.createElement('span');
        frag.appendChild(this.placeholder)
      }
      return frag;
    }
  };
  
  mixin.getBound = mixin.getBoundElement;
  mixin.getChildHTML = mixin.getChildHtml;
  mixin.getChildrenHTML = mixin.getChildrenHtml;
  
  return mixin;
});