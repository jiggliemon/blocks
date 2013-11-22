var assert = require('assert')
var block = require('../../main')

describe('Client side block', function () {
  
  describe('#toDOM', function () {
    
    it('should return dom nodes', function () {
      var domStuff = new block('<div></div>').toDOM()
      assert.ok(domStuff instanceof NodeList)
    })

    it('should return a NodeList instance that has the correct length property', function () {
      var domStuff = new block('<div></div>').toDOM()
      assert.equal(domStuff.length, 1)

      var moreStuff = new block('<b></b><a></a><div></div>').toDOM()
      assert.equal(moreStuff.length, 3)
    })

    it('should handle whitespace', function () {
      var funnyStuff = new block('<b>Hello</b>\t\t\n<a href="#">\t<span>Hello</span>\u0009\u0009</a>').toDOM()
      assert.equal(funnyStuff.length, 3)

      var whitespace = new block('\t\t\t\n\t').toDOM()
      assert.equal(whitespace.length, 1)
    })

  })


  describe('#toString', function () {

    it('should return a div with the id equal to the blocks ID', function () {
      var b = new block()
      console.log(b)
      var id = b.getUniqueId()
      assert.equal(b.toString(), '<div id="'+id+'"></div>')
      assert.equal(String(b), '<div id="'+id+'"></div>')
    })

  })
  
})