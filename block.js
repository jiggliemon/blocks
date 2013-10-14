var lodash = require('lodash')
var yeah = require('yeah')
var tmpl = require('kiev')
var begets = require('./util').create

var extend = lodash.extend
var result = lodash.result
var forOwn = lodash.forOwn
var forEach = lodash.forEach

function block ( methods ) {
  extend( this, methods)
  this.initialize(methods)
}

block.prototype = {

  initialize: function ( options ) {
    options = options || {}
    this._map = this._map || {}
    this.children = []
    this._data = {}

    if (options.name) {
      this.name = options.name
      delete options.name
    }

    if (options.children) {
    	forOwn(options.children, this.setBlock, this)
    }
  }

  // I'll try and see if this is really something we care about.
  // ,get: function ( key ) {
  //   return this._data[key]
  // }

  // ,set: function ( key, value ) {
  //   this._data[key] = value
  //   return this
  // }

  // Do we need this?  Should the block instance
  // be an extended model?
  ,setModel: function ( model ) {
    this.model = model
    return this
  }

  /**
   * Returns the blocks model.
   * Only one model per block.
   * @returns model
   */
  ,getModel: function () {
    return this.model
  }

  /**
   * Returns the block instance with a name property that matches
   * the argument provided
   * @param name {string} A reference to child block
   * @returns block
   */
  ,reference: function ( name ) {
    var blocks = this._map
    if (typeof name == 'string') {
      var block = blocks[name]
      if (!block) {
        throw new Error('The block reference `'+name+'` wasn\'t found')
      }
      return blocks[name]
    }
  }

  /**
   * Should this be queryable?
   */
  ,getBlock: function ( name ) {
    return this._map[name]
  }

  /**
   * Adds a block to it's children.
   *
   * @param block {block} An instance of a block
   * @param where {string} Where to position: 'top' | 'bottom' | 'before' | 'after'
   * @param reference {block | string} This will refrence another child for `before` or `after`
   * @returns this
   */
  ,setBlock: function ( block, where, ref ) {
  	if (Array.isArray(block)) {
  		return forEach(block, this.setBlock, this)
  	}
    var blocks = this.children
    // Assign a reference to the parent.  This may be
    // important to extablish x-block communication
    block.parent = this

    if ( typeof reference == 'string' ) {
      reference = this.reference(ref)
    }

    // this will speedup lookups by key
    if ( block.name ) {
      this._map[block.name] = block
    }

    // Maybe break this out to several 
    // convenience methods?
    // before, after are pretty damn similar
    switch ( where ) {
      case 'before': 
        var index = blocks.indexOf(reference)
        blocks.splice(index, 0, block)
        break

      case 'after':
        var index = blocks.indexOf(reference)
        blocks.splice(index+1, 0, block)
        break

      case 'top': 
        blocks.unshift(block)
        break

      default:
      case 'bottom':
        blocks.push(block)
    }

    return this
  }

  ,removeBlock: function () {
    return this
  }

  /**
   *   
   *  @param obj {object} gets merged into the #option property.
   *
   *  @returns {object} Options
   */
  ,configure: function ( obj ) {
    // stolen from backbone.
    if ( this.options ) {
      obj = extend({}, result(this, 'options'), obj)
      this.options = obj;
    }

    return this
  }

  ,toString: function () {
    return this.compile()
  }
}

// Because I always write addBlock.  Maybe this will have
// special magic behavior later. This way I can break 
// the API later and have something to argue about
block.prototype.addBlock = block.prototype.setBlock

block.prototype.getChildHtml = function ( name ) {
  var child = this._map[name]
  return child ? child.toHTML():''
}

// This will spawn a constructor
block.begets = begets


/**
 *
 */
extend(block.prototype, yeah.prototype, tmpl.prototype )

module.exports = block
