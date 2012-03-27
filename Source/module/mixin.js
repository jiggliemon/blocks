define(['../utilities'], function (utilities) {
  
  var mixin = {

    /**
     *
     *
     */
     parent: function (){
      var  name = this.$caller.$name
          ,parent = this.$caller.$parent
      if (!parent) {
        throw new Error('The method "' + name + '" has no parent.')
      }
      return parent.apply(this, arguments)
    }
    
    /**
     *
     *
     */
     ,setOptions: function (options) {
      return (function (){
        var  args = arguments
            ,target = args[0]
            ,key
            ,i = 1
            ,l = args.length
            
        for (; i < l; i++) {
          for (key in args[i]) {
            if(utilities.hasOwn.call(args[i], key)) {
              target[key] = args[i][key]
            }
          }
        }

        return target
      }(this.options,options))
    }

    /**
     *
     *
     *
     */
    ,readyReady: function (args) {
      args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
      // todo: wtf is going on in here
      var callback = args[args.length -1]
      this.addEvent(args.slice(0,-1),'module:ready',callback.bind(this))
    }

  };

  return mixin

})
