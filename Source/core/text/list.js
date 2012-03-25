;( function (dependencies) {

dependencies.push('block');
define(dependencies, 
  function(Block) {
    var slice = Array.prototype.slice;

    var Poll = new Block({
       options: {
        template: '<%=$this.getChildrenHTML()%>'
      }
      ,initialize: function (options) {
        this.setOptions(options);
        this.parent();
      }
       
    });

    return Poll;
  });

}([]));
