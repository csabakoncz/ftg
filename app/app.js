// Code goes here

function ftg_parseInit() {
	// Initialize Parse with your Parse application javascript keys
	Parse.initialize("3WQ9tsQ19Gb0QC2Ppx6I0NrYpkNaZCYP7eMH3ORJ",
			"1gcsuWx7ltLE2jPgxaxRK125TSNoAxa5emF1MSpZ");
}

function ftg_scaffold(entityName, entityFields, entityTemplate, entityListEl,
		newEntityEl) {

	var appState = {
		currentEditView : null
	}

	var Entity = Parse.Object.extend(entityName, {
		defaults : function() {
			return entityFields
		},
		initialize : function() {
			console.log('inited entity ' + entityName)
		}
	})

	var EntityList = Parse.Collection.extend({
		model : Entity,
	})

	var EntityView = Parse.View.extend({
		tagName : "li",
		template : _.template($(entityTemplate).html()),

		// The DOM events specific to an item.
		events : {
			"click .delete-entity" : "deleteEntity",
			"click .edit-entity" : "editEntity"
		},

		initialize : function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		// Re-render the contents of the todo item.
		render : function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},

		deleteEntity : function() {
			var doDelete = confirm('Do you really want to delete the '
					+ entityName + '?')
			if (doDelete) {
				this.model.destroy();
			}
		},

		editEntity : function() {
			var ev = new EntityEditView({
				model : this.model
			})

			if (appState.currentEditView) {
				appState.currentEditView.clearForm()
			}
			appState.currentEditView = ev

			ev.render()
		}

	});

	var EntityEditView = Parse.View.extend({

		el : ".edited-entity",

		events : {
			"click .save" : "saveEntity",
			"click .cancel" : "clearForm"
		},

		saveEntity : function() {

			console.log('saving ' + this.model);

			var data = {}
			for ( var field in entityFields) {
				var inputFieldCls = '.' + field
				var value = this.$(inputFieldCls).val()
				data[field] = value
			}

			this.model.set(data)
			this.model.save()

			this.clearForm();
		},

		render : function() {
			for ( var field in entityFields) {
				var inputFieldCls = '.' + field
				this.$(inputFieldCls).val(this.model.get(field))
			}
			return this;
		},

		clearForm : function() {
			for ( var field in entityFields) {
				var inputFieldCls = '.' + field
				this.$(inputFieldCls).val('')
			}
			
			this.off()
			
			appState.currentEditView = null
		}

	});

	var EntityListView = Parse.View.extend({

		el : newEntityEl,

		events : {
			"click .create-new" : "createNew"
		},

		initialize : function() {
			_.bindAll(this, 'createNew', 'addAll', 'addOne')

			this.exList = new EntityList()
			this.exList.bind('add', this.addOne)
			this.exList.bind('reset', this.addAll)
			this.exList.fetch()
		},

		addOne : function(entity) {
			var v = new EntityView({
				model : entity
			})
			$(entityListEl).append(v.render().el)
		},

		addAll : function() {
			$(entityListEl).html('')
			this.exList.each(this.addOne)
		},

		createNew : function() {

			console.log('about to create entity ' + entityName)

			var data = {}
			for ( var field in entityFields) {
				var inputFieldCls = '.' + field
				var value = this.$(inputFieldCls).val()
				data[field] = value
			}

			this.exList.create(data);
		}
	})

	var e1 = new EntityListView()
	
	//for debugging only: expose the state
	this.appState = appState
}