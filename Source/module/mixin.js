define(['../utilities'], function (utilities) {
  
  var mixin = {

    
    
    /**
     *
     *
     */
      setOptions: function (options) {
      var self = this
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

        return self.options = target
      }({}, self.defaults || {}, options))
    }

    ,get: function (key) {
      var  model = this.getModel()
          ,value

      value = model && this.model.get(key) 
      
      if(!value) {

      }
      return value
    }

    /**
     *
     *
     *
     */
    ,readyReady: function (args) {
      if(!args && this.options.onReady) {
        args = this.options.onReady
      } else 
        return
        
      args = utilities.isArray(args) ? args : utilities.slice.call(arguments,0)
      // todo: wtf is going on in here
      var callback = args[args.length -1]
      this.addEvent(args.slice(0,-1),'module:ready',callback.bind(this))
    }

    ,getModel: function () {
      return this.model
    }

  };

  return mixin

})
