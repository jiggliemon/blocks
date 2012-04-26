/* global define:false,require:false,expect:false,it:false,describe:false */

define(['blocks/template/mixin'],
  function ( Mixin ) {

  describe('blocks/template/mixin', function () {
    var instance;
    beforeEach(function() {
        instance = {}
        for(var key in Mixin) {
          if(Mixin.hasOwnProperty(key)) {
            instance[key] = Mixin[key]
          }
        }
    })

    describe('#getTags', function () {
      it('should return a hash of open and close tags', function () {
        var keys = Object.keys(instance.getTags())
        expect(keys.indexOf('open')).toBeTruthy()
        expect(keys.indexOf('close')).toBeTruthy()
        expect(keys.indexOf('other')).toBeFalsy()
      })
    })

    describe('#getTag', function () {
      it('should return a single tag value.  can only be open/close', function(){
        // expect to recieve the default template opener
        expect(instance.getTag('close')).toEqual('%>')
      })
    })

    describe('#setTags', function () {
      it('should define new open and close tags using an object.', function(){
        instance.setTags({open:'{%',close:'%}'})
        expect(instance.getTag('open')).toEqual('{%')
        expect(instance.getTag('close')).toEqual('%}')
      })
    })

    describe('#setTag', function () {
      it('should define one tag with the first argument as the tag-name, and the second as the tag-string value', function() {
        instance.setTag('open','{%')
        instance.setTag('close','%}')
        expect(instance.getTag('open')).toEqual('{%')
        expect(instance.getTag('close')).toEqual('%}')
      })
    })

    describe('#getTemplate', function () {

    })

    describe('#setTemplate', function () {
      it('should do nothing if called with no arguments or empty/strings of only whitespace', function () {
        instance.setTemplate()
        expect(instance.getTemplate()).toBeFalsy()
      })

      it('should trim the whitespace off of a template when set', function () {
        instance.setTemplate('    some fine template    ')
        expect(instance.getTemplate()).toEqual('some fine template')
      })

      it('should escape quotes', function () {
        instance.setTemplate("Hello I'm Your friend.")
        expect(instance.getTemplate()).toEqual("Hello I\'m your friend")
      })
    })
    
    describe('#getContext', function () {

    })

    describe('#setContext', function () {

    })

    describe('#parseOperators', function () {

    })

    describe('#getOperators', function () {

    })

    describe('#addOperator', function () {

    })

    describe('#compile', function () {

    })
  })

})