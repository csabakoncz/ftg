(function(){
    var module = angular.module('app',['ui.router']);
    
    module.controller('testCtrl',function($scope){
      $scope.testValue = 'Alma!!!';  
    });

    module.controller('testCtrlA',function($scope){
        $scope.testValue = 'AAA!!!';  
    });

    module.controller('testCtrlB',function($scope){
        $scope.testValue = 'BBB!!!';  
    });
    
    module.config(function($stateProvider,  $urlRouterProvider){
       $stateProvider.
       state('home',{
           url:'/home',
           templateUrl:'template.html',
           controller:'testCtrl'
       }).
       state('a',{
           url:'/a',
           templateUrl:'template.html',
           controller:'testCtrlA'
       }).
       state('b',{
           url:'/b',
           templateUrl:'template.html',
           controller:'testCtrlB'
       })
       
       $urlRouterProvider.otherwise('/home');
    });
    
})()