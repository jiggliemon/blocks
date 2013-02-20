({
   baseUrl: "../../"
  ,packages:[
     {name:'blocks',location:'blocks/src'}
    ,{name:'yaul',location:'yaul/src'}
    ,{name:'yeah',location:'yeah/src',main:'index'}
    ,{name:'yate',location:'yate/src',main:'index'}
  ]
  ,include: ['blocks/block','yeah','yate']
  ,optimize: 'none'
  //,stubModules:['text']
  //,findNestedDependencies: true
  ,out: "blocks.js"
  ,cjsTranslate: true
})
