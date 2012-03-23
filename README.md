# Blocks.js

```  
var  Layout = require('blocks/layout')
    ,Block = require('blocks/block')
    
new Layout('/', new Block({
   template: '\
    <header><%= getChild("header") %></header>\
    <section><%= getChild("body") %></section>\
    <footer><%= getChild("footer") %></footer>\
  '
  ,children: {
     header: new Block({
     	template: 'path/to/header/template.tmpl'
     	,children:{
     	  someModule: ['module/identifier', {
     	    'setting':"value"
     	  }]
     	  ,otherModule: new OtherModule({
     	    'setting':"value"
     	  })
     	}
     })
    ,body: new Block({
    	template: 'path/to/body/template.tmpl'
    	,children: {
    	  main: new MainBody()
    	}
    })
    ,footer: new Block({
    	template: 'path/to/footer/template.tmpl'
    })
  }
}, document.getElementById('container'));  
```
