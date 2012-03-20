# Blocks.js

```js
new Blocks.Layout('/', new Block('path/to/module',{
  children: {
    header: new Block('path/to/header')
    footer: new Block('path/to/footer')
  }
}, document.getElementById('container'));
```
