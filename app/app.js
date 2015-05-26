// Code goes here

function ftg_parseInit(){
        // Initialize Parse with your Parse application javascript keys
  Parse.initialize("3WQ9tsQ19Gb0QC2Ppx6I0NrYpkNaZCYP7eMH3ORJ",
                   "1gcsuWx7ltLE2jPgxaxRK125TSNoAxa5emF1MSpZ");
}

function ftg_scaffold(
  entityName, 
  entityFields, 
  entityTemplate, 
  entityListEl, 
  newEntityEl){
    
  var Entity=Parse.Object.extend(entityName,{
	  defaults: function(){
	     return entityFields
	  },
	  initialize:function(){
	    console.log('inited entity '+entityName)
	  }
  })
  
  var EntityList=Parse.Collection.extend({
    model:Entity,
  })
  
  var EntityView = Parse.View.extend({
    tagName:  "li",
    template: _.template($(entityTemplate).html()),
    
    // The DOM events specific to an item.
    events: {
      "click .delete-entity"   : "deleteEntity"
    },
    
    initialize: function() {
      this.model.bind('change', this.render,this);
      this.model.bind('destroy', this.remove,this);
    },

   // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    
    deleteEntity: function() {
      var doDelete=confirm('Do you really want to delete the '+entityName+'?')
      if(doDelete){
        this.model.destroy();
      }
    }    
  });

  var EntityListView=Parse.View.extend({
    
    el:newEntityEl,
    
    events: {
      "click .create-new":  "createNew"
    },
    
    initialize:function(){
      _.bindAll(this, 'createNew','addAll','addOne')
      
      this.exList=new EntityList()
      this.exList.bind('add',this.addOne)
      this.exList.bind('reset',this.addAll)
      this.exList.fetch()
    },
    
    addOne:function(entity){
		  var v=new EntityView({model:entity})
		  $(entityListEl).append(v.render().el)
    },
    
    addAll:function(){
		  $(entityListEl).html('')
		  this.exList.each(this.addOne)
    },
    
    createNew:function(){
      
		    console.log('about to create entity '+entityName)
		    
		    var data={}
		    for(var field in entityFields){
		      var inputFieldCls='.'+field
		      var value=this.$(inputFieldCls).val()
		      data[field]=value
		    }
		    
        this.exList.create(data);
    }    
  })

  var e1=new EntityListView()
}