# Blocks.js

```js
new Blocks.Layout('/', new Block('path/to/module',{
   template: '\
    <header><%= getChild('header') %></header>\
    <footer><%= getChild('footer') %></footer>\
  '
  ,children: {
     header: new Block('path/to/header')
    ,footer: new Block('path/to/footer')
  }
}, document.getElementById('container'));
```
