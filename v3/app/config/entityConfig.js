define([ '../ngmodule' ], function(appModule) {

    var createEntities = function() {
        var EntityCollection = function(name, nameProperty, fields) {
            this.name = name;
            this.nameProperty = nameProperty;
            this.fields = fields;
            this.items = [];
            this.idCounter = 0;

            this.addItem = function(item) {
                item.id = this.idCounter;
                this.items.push(item);
                this.idCounter++;
            }

            this.deleteItem = function(item) {
                var index = this.items.indexOf(item);
                if (index < 0) {
                    throw new Error('Item not foud ' + item.id);
                }
                this.items.splice(index, 1);
            }

        }

        var entityKinds = [ 'exercise', 'style', 'template' ];

        var nameProperty = {
            exercise : 'title',
            style : 'name',
            template : 'name'
        };

        var fields = {
            exercise : {
                title : '',
                content : ''
            },
            style : {
                name : '',
                content : ''
            },
            template : {
                name : '',
                content : ''
            }
        };

        var entities = [];
        entityKinds.forEach(function(name) {
            entities.push(new EntityCollection(name, nameProperty[name], fields[name]));
        })

        return entities;
    };

    var entities = createEntities();

    var entityConfig = {
        entities : entities
    }

    entities.forEach(function(entity) {
        entityConfig[entity.name] = entity;
    });

    appModule.constant('entityConfig', entityConfig);

});