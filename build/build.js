({
   baseUrl: "../../"
  ,packages:[
     {name:'blocks',location:'blocks'}
    ,{name:'yeah',location:'yeah',main:'index'}
    ,{name:'yate',location:'yate',main:'index'}
  ]
  ,include: ['blocks/block','yeah','yate']
  ,optimize: 'none'
  //,stubModules:['text']
  //,findNestedDependencies: true
  ,out: "blocks.js"
  ,cjsTranslate: true
})
