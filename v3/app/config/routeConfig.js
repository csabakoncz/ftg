define([ '../ngmodule' ], function(appModule) {

    appModule.config(function(entityConfig, $stateProvider, $urlRouterProvider) {
        var firstEntity = entityConfig.entities[0].name
        $urlRouterProvider.otherwise('/' + firstEntity);
        
        $stateProvider.state('user',{
            url : '/user',
            templateUrl : 'app/templates/user.html',
            controller : 'userController',
        });

        entityConfig.entities.forEach(function(entity) {

            var entityListState = entity.name;
            var entityNewState = entityListState + '.new';
            var entityEditState = entityListState + '.edit';

            var listState = createListState(entity);
            var newState = createNewState(entity);
            var editState = createEditState(entity);

            $stateProvider.state(entityListState, listState);
            $stateProvider.state(entityNewState, newState);
            $stateProvider.state(entityEditState, editState);

        });
    });

    var createListState = function(entity) {
        return {
            url : '/' + entity.name,
            templateUrl : 'app/templates/list-view.html',
            controller : entity.name + 'ListController',
        };
    }

    var createEditState = function(entity) {
        return {
            url : '/{itemId}',
            templateUrl : 'app/templates/edit.html',
            controller : entity.name + 'EditController',
        };
    }

    var createNewState = function(entity) {
        return {
            url : '/new',
//            templateUrl : 'app/templates/new.html',
            templateUrl : 'app/templates/edit.html',
            controller : entity.name + 'NewController',
        };
    }

});