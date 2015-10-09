define([ '../ngmodule' ], function(appModule) {

    var genericNewController = function($scope, $state, capitalizeFilter) {

        var entityKind = $scope.entityCollection.name;
        // entityCollection is inherited from the list controller

        var title = 'New '+capitalizeFilter(entityKind);
        var newObject={title:title, content:''};

        $scope.editing.obj = newObject;
        
        $scope.save = function(){
            $scope.entityCollection.addItem(newObject);
            var entityId = newObject.id;
            var editState = entityKind+'.edit';
            $state.go(editState,{itemId:entityId});
        }

    };

    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            var controllerName = entity.name + 'NewController';
            $controllerProvider.register(controllerName, genericNewController);
        });
    });
})