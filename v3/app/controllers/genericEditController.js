define([ '../ngmodule' ], function(appModule) {

    var basicEditController = function($scope, $stateParams, objectService, $state) {
        $scope.itemId = $stateParams.itemId;
        var entityKind = $scope.entityCollection.name;

        var original = $scope.items.find(function(item) {
            return item.id == $scope.itemId
        });

        var entityInfo = entityKind + '/' + $scope.itemId;
        if (original) {
            $scope.statusInfo('Editing entity ' + entityInfo)
        } else {
            $scope.statusError('Entity not found: ' + entityInfo);
            $state.go(entityKind)
        }

        $scope.editing.obj = original;
        // $scope.editing.obj= objCopy(original);

        $scope.save = function() {
            console.log('Saving edited object %o', $scope.editing.obj);
            $scope.statusInfo('Saving ' + $scope.editing.obj.title);
        }

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

    };

    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            var controllerName = entity.name + 'EditController';
            $controllerProvider.register(controllerName, basicEditController);
        });
    });
})