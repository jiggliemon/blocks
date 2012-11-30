# Blocks

## A Block at a glance

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

var someBlock = block('some', {
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

- **template** {string|path} 
- **children** {object}
- **events** {object}
- **inject** {string|element}

#### Basic construction

```js
var instance = block(/* object */ {})
```

#### Construction with optional identifier

```js
var block = require('blocks/block')
var blocks = require('blocks')

var instance = block ('some.identifier',{})
blocks.reference('some.identifier') == instance
```

## setChild

Adds a child block.

#### Arguments:

1. **key** {*String*} child container reference
2. **block** {*Block* || *Array of Blocks*}

#### Example

```js
var instance = block({
    template: '<div class="wrapper"><b name="drop"></b></div>'
})
instance.setChild('drop', block({
        template: '<h1>Hello</h1>'
    })
)

instance.setChild('drop', [
     block({template: '<h1>Hello Again</h1>'})
    ,block({template: '<p>Do you like my hat?</p>'})
])
```







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

Returns the unique identifing `string` for the block instance.  This method is intended mostly for internal use.

#### Example

```js
instance.getUniqueId() // h9s5ep2c1
```







## fillContainer







## toElement







## inject

Sugar syntax for `document.getElementById('some-id').appendChild(instance.toElement())`.

#### Arguments

1. **where** {*Element* || *String*} Either the node reference, or the id of a DOM node of the element of which to inject the block into

#### Example

```js
// with a node reference passed in
instance.inject(document.body)

// with a node ID string passed
instance.inject('some-id')
```






