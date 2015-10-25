define([ '../ngmodule', 'parse' ], function(appModule, Parse) {
    appModule.factory('entityService', function(entityConfig, loggerService, capitalizeFilter) {
        var entityService = {};

        entityService.fetchItems = function(entity, scope) {
            
            if(entity.items.length>0){
                //do not know how to handle changed items yet
//                return;
                //Parse seems to handle dirty entities well (they are preserved)
                entity.items.splice(0,entity.items.length);
            }
            
            var entityClassName = capitalizeFilter(entity.name);

            var query = new Parse.Query(entityClassName);
            query.select(entity.nameProperty);

            query.find({
                success : function(result) {
                    scope.$apply(function() {
                        scope.statusInfo('Fetched ' + entityClassName + ' (' + result.length + ')');
                        result.forEach(function(r) {
                            entity.items.push(r);
                        });
                    });
                },
                error : function(error) {
                    scope.statusError('Could not fetch ' + entityClassName + '.\nReason ' + error);
                    console.log(error);
                }
            });
        };

        entityService.fetchObject = function(entityName, objectId, success, error) {
            var entityClassName = capitalizeFilter(entityName);
            var query = new Parse.Query(entityClassName);
            query.get(objectId, {
                success : success,
                error : error
            });
        };

        return entityService;
    });
});