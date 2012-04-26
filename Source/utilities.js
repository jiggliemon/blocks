(function () {
  var  ObjectProto = Object.prototype
      ,ArrayProto = Array.prototype
      ,slice = ArrayProto.slice
      ,toString = ObjectProto.toString
      ,hasOwn = ObjectProto.hasOwnProperty
      ,isArray = Array.isArray || function(it) { return typeOf(it,'array') }
      ,forEach = ArrayProto.forEach

  function typeOf (obj,type,is) {
    is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    return type ? type === is : is
  }

  function make (context, key, value ) {
    return context[key] = context[key] || value
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
          if(hasOwn.call(options,name)){
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

define({
   isArray: isArray
  ,hasOwn: hasOwn
  ,toString: toString
  ,slice: slice
  ,make: make
  ,typeOf: typeOf
  ,extend: extend
  ,forEach: forEach
});

}())