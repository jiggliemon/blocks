define(['Base/Core/Class'], function(Class) {
  console.log('Layout loaded.');
  
  var Layout = new Class({
     routes:[]
    ,initialize: function(routes,block,target){
      if(arguments.length < 2)
        throw new Error('A Layout needs at least two arguments passed.  A route/array of routes, and a base block.');
       
       if(typeof route === 'string'){
         this.routes[0] = route;
       } 
        
      
    }
    ,getRoutes: function(){
      return this.routes;
    }
  })
  
  
	return Layout;
});