//@ sourceURL = blocks/utilities.js
define(function (){

var  ObjectProto = Object.prototype
    ,ArrayProto = Array.prototype
    ,toString = ObjectProto.toString
    ,isArray = Array.isArray || function(it) { return typeOf(it,'array') }
    ,doc = document

function querySelect (query, what) {
  if("querySelectorAll" in doc) {
    return slice((what || doc).querySelectorAll(query))
  } else 
  if ("Mootools" in window ){
    return (what || doc).getElements(query)
  } else 
  if ("jQuery" in window) {
    return jQuery(query).get()
  }
  return null
}

function typeOf (obj,type,is) {
  is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  return type ? type === is : is
}

function slice (what, offset) {
  return ArrayProto.slice.call(what,offset)
}

function forEach (what, fn) {
  return ArrayProto.forEach.call(what, fn)
}

function make (context, key, value ) {
  return context[key] = context[key] || value
}

function hasOwn (what, key) {
  return ObjectProto.hasOwnProperty.call(what,key)
}

function argue (args,offset) {
  return isArray(args)? args: slice(arguments,offset || 0)
}

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
          if ( copy && ( typeOf(copy,'object') || (copyIsArray = isArray(copy)))) {
            if ( copyIsArray ) {
              copyIsArray = false
              clone = src && isArray(src) ? src : []

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

function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have. (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}


return {
   isArray: isArray
  ,isElement: isElement
  ,hasOwn: hasOwn
  ,toString: toString
  ,slice: slice
  ,make: make
  ,typeOf: typeOf
  ,extend: extend
  ,forEach: forEach
  ,argue: argue
  ,querySelect: querySelect
}

})
//@ sourceURL = blocks/utilities.js