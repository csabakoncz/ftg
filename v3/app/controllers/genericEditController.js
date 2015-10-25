define([ '../ngmodule' ], function(appModule) {

    var basicEditController = function($scope, $stateParams, objectService, $state, entityService, entityConfig, loggerService) {
        $scope.itemId = $stateParams.itemId;
        var entityKind = $scope.entityCollection.name;

        var original = {};
        $scope.editing.obj = {};

        var entityInfo = entityKind + '/' + $scope.itemId;

        var successCallback = function(result) {
            $scope.$apply(function() {
                $scope.editing.original = result;

                $scope.entityCollection.fields.forEach(function(field) {
                    $scope.editing.obj[field] = result.get(field);
                });

                $scope.statusInfo('Editing entity ' + entityInfo)
            });
        };

        var errorCallback = function() {
            $scope.$apply(function() {
                $scope.editing.obj = null;
                $scope.statusError('Entity not found: ' + entityInfo);
            });
        };

        entityService.fetchObject(entityKind, $scope.itemId, successCallback, errorCallback);

        if (entityKind == 'exercise') {
            // we also need to fetch the styles and the templates:
            entityService.fetchItems(entityConfig.style, $scope);
            entityService.fetchItems(entityConfig.template, $scope);
        }
        // $scope.editing.obj= objCopy(original);

        $scope.editingChange = function() {
            console.log('editing change %o', $scope.editing.obj);

            $scope.entityCollection.fields.forEach(function(field) {
                $scope.editing.original.set(field, $scope.editing.obj[field]);
            });

        }

        $scope.save = function() {
            var entityInfo = entityKind + "[" + $scope.editing.obj.name + "]";
            $scope.statusInfo('Saving ' + entityInfo);

            $scope.editing.original.save({
                success : function() {
                    loggerService.infoNonNg("Saving succeeded for " + entityInfo);
                },
                error : function(reason) {
                    loggerService.errorNonNg("Saving failed for " + entityInfo + "\nReason: " + reason);
                }
            });
        };

        $scope.deleteItem = function() {
            var item = $scope.editing.obj;
            $scope.statusInfo('Deleting ' + item.title);
            $scope.entityCollection.deleteItem(item);
            $scope.statusInfo('Deleted ' + item.title);

            $state.go(entityKind);
        }

        $scope.duplicateItem = function() {

            var item = $scope.editing.obj;

            $scope.statusInfo('Duplicating ' + item.title);

            duplicate = objectService.copy(item);
            duplicate.title += ' - COPY';

            $scope.entityCollection.addItem(duplicate);

            var editState = entityKind + '.edit'
            $state.go(editState, {
                itemId : duplicate.id
            });
        }

        $scope.getViewLink = function() {
            return '../app/view.html?' + $scope.editing.obj.id
        }

    };

    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            var controllerName = entity.name + 'EditController';
            $controllerProvider.register(controllerName, basicEditController);
        });
    });
})