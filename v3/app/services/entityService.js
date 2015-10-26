define([ '../ngmodule', 'parse' ], function(appModule, Parse) {
    appModule.factory('entityService', function(entityConfig, loggerService, capitalizeFilter) {
        var entityService = {};

        entityService.fetchItems = function(entity, scope) {

            if (entity.items.length > 0) {
                // do not know how to handle changed items yet
                // return;
                // Parse seems to handle dirty entities well (they are preserved)
                entity.items.splice(0, entity.items.length);
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

        entityService.copyFieldsFromEntity = function(src, dst, fields) {
            for ( var field in fields) {
                var fieldValue = src.get(field);
                dst[field] = fieldValue;
            }
        }

        entityService.copyFieldsToEntity = function(src, dst, fields) {
            for ( var field in fields) {
                var fieldValue = src[field];
                dst.set(field, fieldValue);
            }
        }

        entityService.createNew = function(entityCollection, newObjectContent) {
            var entityKind = capitalizeFilter(entityCollection.name);

            if (undefined == entityCollection.eclass) {
                entityCollection.eclass = Parse.Object.extend(entityKind);
            }

            var parseObject = new entityCollection.eclass();

            entityService.copyFieldsToEntity(newObjectContent, parseObject, entityCollection.fields);

            return parseObject;

        }

        return entityService;
    });
});