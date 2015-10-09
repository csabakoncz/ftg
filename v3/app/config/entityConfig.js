define([ '../ngmodule' ], function(appModule) {

    var populateEntity = function(entity) {
        entity.items = [];
        for (var i = 0; i < 10; i++) {
            // var entityId = entity.name + '-' + i;
            var entityTitle = 'Title-' + entity.name + '-' + i;
            var e = {
                // id : entityId,
                title : entityTitle,
                content : ''
            }
            entity.addItem(e);
        }
    };

    var createEntities = function() {
        var EntityCollection = function(name) {
            this.name = name;
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

        var entities = [];
        entityKinds.forEach(function(name) {
            entities.push(new EntityCollection(name));
        })

        return entities;
    };

    var entities = createEntities();

    entities.forEach(populateEntity);

    var entityConfig = {
        entities : entities
    }
    entities.forEach(function(entity) {
        entityConfig[entity.name] = entity;
    });

    appModule.constant('entityConfig', entityConfig);

});