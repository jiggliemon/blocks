//@ sourceURL = blocks/mediator/mixin.js
define([
  'yaul/make'
  ,'yaul/typeOf'
  ,'yaul/isArray'
  ,'yaul/hasOwn'
  ,'yaul/slice'

], function (
   make
  ,typeOf
  ,isArray
  ,hasOwn
  ,slice
) {

function removeLatched(type){
  var _latched = make(this,_LATCHED_, {})
  if ( type.indexOf(':') ) {
    if ( REGEX.test(type) ) {
      type = type.replace(REGEX,'')
      _latched[type] = 1
    }
  }
  return type
}

var REGEX = /:(latch(ed$)?)/i
  , call = 'call'
  , _EVENTS_ = '_events'
  , _SWITCHED_ = '_switched'
  , _LATCHED_ = '_latched'
  , _ARGUMENTS_ = '_arguments'
  , mixin = {
    
     getEvents: function(key){
       var _events = make(this, _EVENTS_, {})
          ,events = _events[type] 

       return typeOf(key,'string') ? events ? events : [] : Object.keys(_events)
    }
    
    ,addCompoundEvent: function ( events, type, callback ) {
      type = removeLatched[call](this,type)
      var  self = this
        , _switched = make(self,_SWITCHED_, {})
      
      // todo: use yaul/map
      events = events.map(function ( event ) {
        if ( self.grr ) {
          console.log(event)
        }

        event = removeLatched[call](self, event)
        self.addEvent(event, fireCheck)
        return event
      })
      
      function fireCheck () {
        var length = events.length
        while ( length-- ) {
          if(!_switched[events[length]]) return
        }
        self.fireEvent(type +':latched')
      }
      
      if( callback ){
        self.addEvent(type, callback )
      }
    } 

    ,addEvent: function( /* Sting */ type, /* Function */ callback ){

      if ( isArray(type) ) { 
        return this.addCompoundEvent.apply(this, arguments)
      }

      type = removeLatched[call](this,type)
      
      var  self = this
        , _events = make(self, _EVENTS_, {})
        , events = make(_events, type, [])
        , _args,_latched
      
      if (!utilities.typeOf(callback,'function')) {
        throw new TypeError('`#addEvent`\'s second argument must be a function') 
      }

      // todo: use yaul/indexOf
      if ( events.indexOf(callback) === -1 ) {
        _args = make(self,_ARGUMENTS_, {})
        _latched = make(self,_LATCHED_, {})
        _latched[type] ? callback.apply(self,_args[type]) : events.push(callback)
      }
      return self
    }

    ,addEvents: function(/* Object */ events){
      var self = this
      for ( var key in events ) {
        if ( hasOwn(events, key) ) {
          self.addEvent(key,events[key])
        }
      }
      return self
    }
    
    ,fireEvent: function(/* String */ type) {
      type = removeLatched[call](this,type)
      var self = this
        , _latched = make(self,_LATCHED_, {})
        , _switched = make(self,_SWITCHED_, {})
        , _args = make(self,_ARGUMENTS_, {})
        , _events = make(self, _EVENTS_, {})
        , isLatched = _latched[type]
        , events = _events[type]
        , length = events ? events.length : 0
        , args = slice(arguments,1)
        , i = 0
      
      _switched[type] = 1
      
      if ( events && length ) {
        for ( ; i < length; i++ ) {
          if ( i in events) {
            //try{
              events[i].apply(self,args)
            //} catch (e) { 
              //window.console && console.log(events[i])
              //throw new Error('Problem with the `'+ type +'` event \n'+ e)
            //}
          }
        }
      }
      
      if ( isLatched ) {
        _args[type] = args
        delete events
      }
      
      return self
    }

    ,hasFired: function (key) {
      var _switched = make(this,_SWITCHED_, {})
      return _switched[key] ? true : false
    }
  }

return mixin
})
//@ sourceURL = blocks/mediator/mixin.js