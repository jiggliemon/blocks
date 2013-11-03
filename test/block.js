var block = require('../block')
var assert = require('assert')

describe ('block', function () {
  
  var Construct, constructInstance 
  beforeEach(function () {
    Construct = block.create('Constructor', {
      "template": "<h1>Hello</h1>"
    })
    constructInstance = new Construct
  })

  describe('block.create', function () {
    it('should return a function', function () {
      assert.equal('function', typeof Construct)
    })
  })

  describe('block#chidren', function () {

  })

  describe('block#reference', function () {
    it('should reference a child block by name when present.', function () {
      var SomeBlock = block.create('SomeBlock')

      var parent = new Construct
      var child = new SomeBlock({ name: 'kid' })

      parent.setBlock(child)

      assert.equal(child, parent.reference('kid'))
    })
  })

  describe('block#render', function () {
    it('should render `<b>No Template</b> if no template provided.', function () {
      var instance = new block
      assert.equal(instance.toString(), '<b>No template</b>')
    })
  })

})