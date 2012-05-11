//@ sourceURL = blocks/layout/index.js
define(function () {

  var Layout = function (key, block, where) {
    this.where = where
    this.block = block
    this.key = key
  }
  Layout.prototype = {
     getKey: function () {
      return this.key
    }
    ,getBlock: function () {
      return this.block
    }
    ,getWhere: function () {
      return this.where
    }
  }
  return Layout
})
//@ sourceURL = blocks/layout/index.js