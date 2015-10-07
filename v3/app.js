var routerApp = angular.module('routerApp', ['ui.router','ui.bootstrap']);

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
            templateUrl: 'exercise-edit.html',
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
            templateUrl: 'style-edit.html',
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
            templateUrl: 'template-edit.html',
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
    $scope.items=[];
    for(var i=0; i<30; i++){
        $scope.items.push({id:'E-'+i,title:'Exercise-'+i});
    }
});

var basicEditController = function($scope, $stateParams){
    $scope.itemId = $stateParams.itemId;
    $scope.editing.obj=$scope.items.find(function(item){return item.id==$scope.itemId});
};

routerApp.controller('editExerciseCtrl',basicEditController);

routerApp.controller('newExerciseCtrl',function($rootScope,$scope){
});

routerApp.controller('styleCtrl',function($scope){
    $scope.items=[];
    for(var i=0; i<40; i++){
        $scope.items.push({id:'S-'+i,title:'Style-'+i});
    }
});

routerApp.controller('editStyleCtrl',basicEditController);

routerApp.controller('newStyleCtrl',function($scope){
});

routerApp.controller('templateCtrl',function($scope){
    $scope.items=[];
    for(var i=0; i<10; i++){
        $scope.items.push({id:'T-'+i,title:'Template-'+i});
    }
});

routerApp.controller('editTemplateCtrl',basicEditController);

routerApp.controller('newTemplateCtrl',function($scope){
});
routerApp.controller('userCtrl',function($scope){
    $scope.userName='Rongy Elek'
});
routerApp.controller('appCtrl',function($scope){
    $scope.editing={};
    
    $scope.currentPage=1;
    $scope.itemsPerPage=10;
    $scope.pageChanged=function(){
        console.log('paging occurred, currentPage=%s',$scope.currentPage);
    };
});