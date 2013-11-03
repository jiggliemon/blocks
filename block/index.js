var lodash = require('lodash')
var yeah = require('yeah')
var tmpl = require('kiev')
var util = require('../util')

var extend = lodash.extend
var result = lodash.result

var blockCount = 0

function block ( methods ) {
  extend( this, methods)
  this.inits.forEach(function ( init ) {
    init.call(this)
  }, this)

  options = options || {}
  this._map = this._map || {}
  this.children = []
  this._data = {}


  this.initialize()
}

block.prototype = {

  initialize: function ( options ) {
    
    if ( options.name ) {
      this.name = options.name
      delete options.name
    }
  }

  ,get: function ( key ) {
    return this._data[key]
  }

  ,set: function ( key, value ) {
    key && this._data[key] = value
    return this
  }

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
    var blocks = this.children
    
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
  }

  ,removeBlock: function () {
    
  }

  /**
   *  #getUniqueId
   *
   *
   */ 
  ,getUniqueId: function () {
    var self = this
    return self._uniqueId || (self._uniqueId = Date.now().toString(36) + (blockCount++))
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
      options = extend({}, result(this, 'options'), options)
      this.options = options;
    }

    return this.options
  }

  ,toString: function () {
    return '[object Block]'
  }


  ,toHTML: function () {
    this.compile()
  }
}

// Because I always write addBlock.  Maybe this will have
// special magic behavior later. This way I can break 
// the API later and have something to argue about
block.prototype.addBlock = block.prototype.setBlock

block.prototype.getChildHtml = function ( name ) {
  var child = this._map[name]
  return child?child.toHTML():''
}

// This will spawn a constructor.  Maybe not.
block.begets = util.create


/**
 *
 */
extend(block.prototype, yeah.prototype, tmpl.prototype )

module.exports = block
