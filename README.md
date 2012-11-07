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
- [#setChild](#setchild)
- [#getChild](#getchild)
- [#removeChild](#removechild)
- [#setChildren](#setchildren)
- [#getChildren](#getchildren)
- [#removeChildren](#removechildren)
- *[#getChildHtml](#getchildhtml)
- *[#emptyChildNode](#emptychildnode)
- [#attachEvents](#attachevents)
- [#bindTemplate](#bindtemplate)
- *[#bindElements](#bindelements)
- *[#bindChildren](#bindchildren)
- *[#clearBoundElements](#clearboundelements)
- [#setBoundElement](#setboundelement) 
- [#getBoundElement | #bound](#getboundelement)
- *[#getBoundElements](#getboundelements) 
- [#setContainer](#setcontainer)
- [#getContainer](#getcontainer)
- [#getUniqueId](#getuniqueId)
- *[#toString](#tostring)
- *[#fillContainer](#fillcontainer)
- [#toElement](#toelement)
- [#inject](#inject)

_* indicates it may or maynot be removed._

## Block

Options:

- template {string|path} 
- inject {string|element}

#### Basic construction

```js
var instance = new Block(/* object */ {})
```

#### Construction with optional identifier

```js
var Block = require('blocks/block')
var Blocks = require('blocks')

var instance = new Block (/* string */ 'some.identifier', /* object */ {})
Blocks.reference('some.identifier') == instance
```

## setChild

## getChild

## removeChild

## setChildren

## getChildren

## removeChildren

## getChildHtml

## emptyChildNode

## attachEvents

## bindTemplate

## bindElements

## bindChildren

## clearBoundElements

## setBoundElement

## getBoundElement | #bound

## setContainer

## getContainer

## getUniqueId

## fillContainer

## toElement

## inject







