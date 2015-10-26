define([ '../ngmodule', 'parse' ], function(appModule) {

    var genericNewController = function($scope, $state, capitalizeFilter, entityService, loggerService, objectService) {

        var entityCollection = $scope.entityCollection;
        var entityKind = entityCollection.name;
        // entityCollection is inherited from the list controller

        var newObject = objectService.copy(entityCollection.fields);

        var title = 'New ' + capitalizeFilter(entityKind);
        newObject[entityCollection.nameProperty] = title;

        var parseObject = entityService.createNew(entityCollection, newObject);

        $scope.editing.obj = newObject;
        $scope.editing.original = undefined;

        $scope.editingChange = function() {
            console.log('editing change %o', $scope.editing.obj);
            entityService.copyFieldsToEntity($scope.editing.obj, parseObject, entityCollection.fields);
        }

        $scope.save = function() {
            var entityInfo = entityKind + "[" + $scope.editing.obj.name + "]";
            $scope.statusInfo('Saving ' + entityInfo);

            parseObject.save({
                success : function(savedObject) {
                    $scope.$apply(function() {
                        $scope.statusInfo("Creating/Saving succeeded for " + entityInfo);

                        var entityId = savedObject.id;
                        var editState = entityKind + '.edit';
                        $state.go(editState, {
                            itemId : entityId
                        },{reload:true});

                    });
                },
                error : function(reason) {
                    loggerService.errorNonNg("Creating/Saving failed for " + entityInfo + "\nReason: " + reason);
                }
            });
        };

    };

    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            var controllerName = entity.name + 'NewController';
            $controllerProvider.register(controllerName, genericNewController);
        });
    });
})