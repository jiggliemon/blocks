define(function () {
  var  REGEX = /:(latch(ed$)?)/i
      ,mixin
      ,call = 'call'
      ,ArrayProto = Array.prototype
      ,ObjectProto = Object.prototype
      ,slice = ArrayProto.slice
      ,toString = ObjectProto.toString
      ,isArray = Array.isArray || function(it) { return typeOf(it,'array') }
      ,_EVENTS_ = '_events'
      ,_SWITCHED_ = '_switched'
      ,_LATCHED_ = '_latched'
      ,_ARGUMENTS_ = '_arguments'
  
  function typeOf (obj,type) {
    var is = toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    return type?type === is:is
  }

  function removeLatched(type){
    var _latched = make[call](this,_LATCHED_, {})
    if(type.indexOf(':')){
      if(REGEX.test(type)){
        type = type.replace(REGEX,'')
        _latched[type] = 1
      }
    }
    return type
  }

  function make (key,value) {
    return this[key] = this[key] || value
  }

  mixin = {
     getEvents: function(key){
       var _events = make[call](this, _EVENTS_, {})
          ,events = _events[type] 

       return typeOf(key,'string') ? events ?events:[] : Object.keys(_events)
    }
    
    ,addCompoundEvent: function (events, type, callback) {
      type = removeLatched[call](this,type)
      var  self = this
          ,_switched = make[call](this,_SWITCHED_, {})
      
      
      events = events.map(function (event) {
        event = removeLatched[call](self, event)
        self.addEvent(event, fireCheck)
        return event
      })
      
      function fireCheck () {
        var length = events.length
        while(length--){
          if(!_switched[events[length]]) return
        }
        self.fireEvent(type +':latched')
      }
      
      if(callback){
        this.addEvent(type, callback )
      }
    } 

    ,addEvent: function(/* Sting */ type, /* Function */ callback){
      if(isArray(type)) { 
        return this.addCompoundEvent.apply(this, arguments)
      }
      type = removeLatched[call](this,type)
      
      var  _events = make[call](this, _EVENTS_, {})
          ,events = make[call](_events, type, [])
      
      if(!typeOf(callback,'function')) {
        throw new TypeError('`#addEvent`\'s second argument must be a function') 
      }
      if(events.indexOf(callback) === -1) {
        _args = make[call](this,_ARGUMENTS_, {})
        _latched = make[call](this,_LATCHED_, {})
        (_latched[type]) ? callback.apply(this,_args[type]) : events.push(callback)
      }
      return this
    }

    ,addEvents: function(/* Object */ events){
      for(var key in events){
        if(events.hasOwnProperty(key)){
          this.addEvent(key,events[key])
        }
      }
      return this
    }
    
    ,fireEvent: function(/* String */ type) {
      type = removeLatched[call](this,type)
      var  _latched = make[call](this,_LATCHED_, {})
          ,_switched = make[call](this,_SWITCHED_, {})
          ,_args = make[call](this,_ARGUMENTS_, {})
          ,_events = make[call](this, _EVENTS_, {})
          ,isLatched = _latched[type]
          ,events = _events[type]
          ,length = events ? events.length : 0
          ,args = slice[call](arguments,1)
          ,i = 0
      
      _switched[type] = 1
      
      if(events && length) {
        for (; i < length; i++) {
          if (i in events) {
            try{
              events[i].apply(this,args)
            } catch (e) { 
              throw new Error('Event Error - '+ type +':: '+ e)
            }
          }
        }
      }
      
      if(isLatched){
        _args[type] = args
        delete events
      }
      
      return this
    }

    ,hasFired: function (key) {
      var _switched = make[call](this,_SWITCHED_, {})
      return _switched[key]?true:false
    }
  }

  return mixin
  
})