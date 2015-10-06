var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/exercise');
    
    $stateProvider
        
        .state('exercise', {
            url: '/exercise',
            templateUrl: 'list-view.html',
            controller:'exerciseCtrl',
        })
        .state('exercise.new', {
            url: '/new',
            template: 'Create new exercise',
            controller:'newExerciseCtrl'
        })
        .state('exercise.edit', {
            url: '/{itemId}',
            template: 'Edit edit with itemId={{itemId}}',
            controller:'editExerciseCtrl'
        })
        .state('style', {
            url: '/style',
            templateUrl: 'list-view.html',
            controller:'styleCtrl',
        })
        .state('style.new', {
            url: '/new',
            template: 'Create new style',
            controller:'newStyleCtrl'
        })
        .state('style.edit', {
            url: '/{itemId}',
            template: 'Edit edit with itemId={{itemId}}</div>',
            controller: 'editStyleCtrl'
        })
        .state('template', {
            url: '/template',
            templateUrl: 'list-view.html',
            controller:'templateCtrl',
        })
        .state('template.new', {
            url: '/new',
            template: 'Create new template',
            controller:'newTemplateCtrl'
        })
        .state('template.edit', {
            url: '/{itemId}',
            template: 'Edit with itemId={{itemId}}</div>',
            controller: 'editTemplateCtrl'
        })
        .state('user', {
            url: '/user',
            templateUrl: 'user.html',
            controller:'userCtrl',
        })
        
});

routerApp.controller('statusCtrl',function($scope){
    var error=function(msg){
        $scope.error=true;
        $scope.status=msg;
    }
    var success=function(msg){
        $scope.error=false;
        $scope.status=msg;
    }
   
    $scope.$on('$stateNotFound', function(event, toState){
        error('State Not Found :'+toState.to);
    })
    $scope.$on('$stateChangeStart', function(event,toState){
        success('State change start :'+toState.name);
    })
    $scope.$on('$stateChangeSuccess', function(event, toState){
        success('State change success :'+toState.name);
    })
});

routerApp.controller('exerciseCtrl',function($scope){
    $scope.items=[{id:'E1'},{id:'E2'}, {id:'E3'}];
});
routerApp.controller('editExerciseCtrl',function($scope, $stateParams){
    $scope.itemId = $stateParams.itemId;
});

routerApp.controller('newExerciseCtrl',function($rootScope,$scope){
});

routerApp.controller('styleCtrl',function($scope){
    $scope.items=[{id:'S1'},{id:'S2'}, {id:'S3'},{id:'S4'}];
});

routerApp.controller('editStyleCtrl',function($scope, $stateParams){
    $scope.itemId = $stateParams.itemId;
});

routerApp.controller('newStyleCtrl',function($scope){
});

routerApp.controller('templateCtrl',function($scope){
    $scope.items=[{id:'T1'},{id:'T2'},];
});

routerApp.controller('editTemplateCtrl',function($scope, $stateParams){
    $scope.itemId = $stateParams.itemId;
});

routerApp.controller('newTemplateCtrl',function($scope){
});
routerApp.controller('userCtrl',function($scope){
    $scope.userName='Rongy Elek'
});