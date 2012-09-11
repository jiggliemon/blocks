# Blocks.js

``` js
/*
<div bind="header" class="header">
    <h1>This is the content for the header</h1>
</div>
<div bind="body" class="body">
    <p> This is some content for the body</p>
</div>
*/
var someBlock = new Block('some', {
    template: '\
        <div bind="header" class="header">\
        </div>\
        <div bind="body" class="body">\
        </div>\
    '
    ,children: {
        header: new Block('some.header', {
            template: '<h1>This is the content for the header</h1>'
        })
        ,content: new Block({
            template: '<%=this.getStringFromMethod()%>'
        }, {
            getStringFromMethod: function () {
                return "<p> This is some content for the body</p>"
            }
        })
    }
}) 

document.body.appendChild(someBlock.toElement())
```
