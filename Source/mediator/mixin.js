define(function () {
  var REGEX = /:(latch(ed$)?)/i;
  
  function removeLatched(type){
    if(type.indexOf(':')){
      if(REGEX.test(type)){
        type = type.replace(REGEX,'');
        this._latched[type] = 1
      }
    }
    return type;
  }

  var mixin = {
     _latched: {}
    ,_switched: {}
    ,_events: {}
    ,_arguments: {}
    
    ,getEvents: function(key){
       var events = this._events[key];
       return (typeof key === 'string') ? events?events:[] : Object.keys(this._events);
    }
    
    ,addCompoundEvent: function (events, type, callback) {
      type = removeLatched.call(this,type);
      var self = this;
      
      
      events = events.map(function (event) {
        event = removeLatched.call(self, event);
        self.addEvent(event, fireCheck);
        return event;
      });
      
      function fireCheck () {
        var length = events.length;
        while(length--){
          if(!self._switched[events[length]]) return;
        }
        self.fireEvent(type+':latched');
      }
      
      if(callback){
        this.addEvent(type, callback );
      }
    } 

    ,addEvent: function(/* Sting */ type, /* Function */ callback){
      if(Array.isArray(type)) { 
        return this.addCompoundEvent.apply(this, arguments);
      }
        
      var  type = removeLatched.call(this,type)
          ,events = this._events[type] = this._events[type] || [];
      
      if(typeof callback !== 'function') {
        throw new TypeError('`#addEvent`\'s second argument must be a function'); 
      }
      if(events.indexOf(callback) === -1) {
        (this._latched[type]) ? callback.apply(this,this._arguments[type]) : events.push(callback);
      }
      return this;
    }

    ,addEvents: function(/* Object */ events){
      for(var key in events){
        if(events.hasOwnProperty(key)){
          this.addEvent(key,events[key]);
        }
      }
      return this;
    }
    
    ,fireEvent: function(/* String */ type) {
      
      var  type = removeLatched.call(this,type)
          ,isLatched = this._latched[type]
          ,events = this._events[type]
          ,length = events ? events.length : 0
          ,args = Array.prototype.slice.call(arguments,1)
          ,i = 0;
      
      this._switched[type] = 1;
      
      if(events && length) {
        for (; i < length; i++) {
          if (i in events) {
            try{
              events[i].apply(this,args);
            } catch (e) { 
              throw new Error('Event Error - '+type+':: '+ e);
            }
          }
        }
      }
      
      if(isLatched){
        this._arguments[type] = args;
        delete events;
      }
      
      return this;
    }
    ,hasFired: function (key) {
      return this._switched[key]?true:false;
    }
  };

  return mixin;
  
});