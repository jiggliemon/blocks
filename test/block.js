var block = require('../block')
var assert = require('assert')

describe ('Server side block', function () {
  
  var Construct, constructInstance 
  beforeEach(function () {
    Construct = block.begets({
      "template": "<h1>Hello</h1>"
    })
    constructInstance = new Construct
  })

  describe('block.begets', function () {
    it('should return a function', function () {
      assert.equal('function', typeof Construct)
    })
  })

  describe('block#chidren', function () {

  })

  describe('block#render', function () {
    it('should render `No Template` if no template provided.', function () {
      var instance = new block
      assert.equal(instance.render(), 'No Template')
    })

    it('should render a template provided to the constructor', function () {
      var instance = new block({
        template: "Hello there"
      })
      assert.equal(instance.render(), 'Hello there')
    })

    it('should render a template with the print opperator', function () {
      var instance = new block({
        template: "<%='Hello there' %>"
      })
      assert.equal(instance.render(), 'Hello there')
    })
  })

})