define([ '../ngmodule' ], function(appModule) {
    
    var createListController = function(entity) {
        return function($scope, objectService, $state, capitalizeFilter) {
            
            $scope.entityCollection = entity;
            
            $scope.items = entity.items;
            
            $scope.createNew = function(){
                var newState = $scope.entityCollection.name+'.new';
                $state.go(newState);
            }
        }
    }
    
    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            $controllerProvider.register(entity.name + 'ListController', createListController(entity));
        });
    });
})