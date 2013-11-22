define(['./block'], function (b) {

  var Block = b.begets({
    inits: [
      function () {

      }
    ]
    /**
     *
     *
     */
    ,toDOM: function () {
      var frag = document.createDocumentFragment()
      var tmp = document.createElement('div')
      var tmpl = this.compile()
      tmp.innerHTML = tmpl
      return tmp.childNodes
    }
    
    /**
        @overrides
     *  #toStrung
     *  This is to do type checking
     *  todo: see if we even actually need this?
     */
    ,toString: function () {
      return '<div id="'+this.getUniqueId()+'"></div>'
    }

    /**
     *
     *
     */
    ,render: function () {
      var html = b.prototype.render.call(this)

    }

  })

  console.dir()

  return Block
})