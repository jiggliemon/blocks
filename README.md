# Blocks.js

``` js
var  Layout = require('blocks/layout')
    ,Block = require('blocks/block')

// define a route for when to show the root block
new Layout('/', new Block('root', {
   template: '\
    <header children="header"></header>\
    <section children="body"></section>\
    <footer children="footer"></footer>\
  '

  // define the blocks children
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

// define where the block should be places in the document
}, document.getElementById('container'));  
```
