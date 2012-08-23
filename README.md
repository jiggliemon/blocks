[![build status](https://secure.travis-ci.org/jiggliemon/blocks.png)](http://travis-ci.org/jiggliemon/blocks)
# Blocks.js

``` js
var  Layout = require('blocks/layout')
    ,Block = require('blocks/block')

// define a route for when to show the root block
new Layout('/', new Block('root', {
   template: '\
    <b name="header"></b>\
    <b name="body"></b>\
    <b name="footer"></b>\
  '

  // define the blocks children
  ,children: {
     header: new Block('root.header',{
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
    ,body: new Block('root.body', {
    	template: 'path/to/body/template.tmpl'
    	,children: {
    	  main: new MainBody()
    	}
    })
    ,footer: new Block('root.footer', {
    	template: 'path/to/footer/template.tmpl'
    })
  }

// define where the block should be places in the document
}, document.getElementById('container'));  
```
