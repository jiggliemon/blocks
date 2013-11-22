"use strict";
// `ctor` and `inherits` are from Backbone (with some modifications):
// http://documentcloud.github.com/backbone/
function extend ( parent ) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.forEach(function ( thing ) {
    for ( var k in thing ) {
      if ( thing.hasOwnProperty(k) ) {
        parent[k] = thing[k]
      }
    }
  })
  return parent
}

// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function () {}

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
function inherits (parent, protoProps, staticProps) {
    function child () { 
      return parent.apply(this, arguments) 
    }

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor
    }
    
    extend(child, parent)
    ctor.prototype = parent.prototype
    child.prototype = new ctor()

    if (protoProps) {
      extend(child.prototype, protoProps)
    }
    if (staticProps) {
      extend(child, staticProps)
    }
    
    child.prototype.constructor = child
    child.__super__ = parent.prototype
    
    return child
}



module.exports = {

  // Self-propagating extend function.
  // Create a new class that inherits from the class found in the `this` context object.
  // This function is meant to be called in the context of a constructor function.
  create: function create (protoProps, staticProps) {
    var child = inherits(this, protoProps, staticProps);
    child.create = create
    return child;
  }


  ,protoify: function protofy () {
    var args = Array.prototype.slice.call(arguments)
    
    return (function objectify (obj) {
      obj = args.shift()
      return args.length ? extend( Object.create( objectify() ), obj ) : obj
    }())
  }
}