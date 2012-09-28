# Blocks

``` js
/*
<div bind="header" class="header">
    <h1>This is the content for the header</h1>
</div>
<div bind="body" class="body">
    <p> This is some content for the body</p>
</div>
*/

var Block = require('blocks/block')

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


#### Dependencies
- AMD Loader
- [Yaul](https://github.com/GCheung55/yaul)
- [Yeah mixin](https://github.com/jiggliemon/yeah)
- [Yate mixin](https://github.com/jiggliemon/yate)

#### Installation
`npm install blocks`

#### Constructor API
- [Block](#block)

#### Mixin API
- #setChild
- #getChild
- #removeChild
- #setChildren
- #getChildren
- #removeChildren
- #getChildHtml
- #emptyChildNode
- #attachEvents
- #bindTemplate
- #bindElements
- #bindChildren
- #clearBoundElements
- #setBoundElement | #bound
- #getBoundElements
- #getBoundElement
- #getContainer
- #setContainer
- #getUniqueId
- #toString
- #fillContainer
- #toElement


## Block




