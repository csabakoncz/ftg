(function(){
    var module = angular.module('app',['ngRoute']);
    
    module.controller('testCtrl',function($scope){
      $scope.testValue = 'Alma!!!';  
    });

    module.controller('testCtrlA',function($scope){
        $scope.testValue = 'AAA!!!';  
    });

    module.controller('testCtrlB',function($scope){
        $scope.testValue = 'BBB!!!';  
    });
    
    module.config(function($routeProvider){
       $routeProvider.
       when('/home',{
           templateUrl:'template.html',
           controller:'testCtrl'
       }).
       when('/a',{
           templateUrl:'template.html',
           controller:'testCtrlA'
       }).
       when('/b',{
           templateUrl:'template.html',
           controller:'testCtrlB'
       }).
       otherwise({
           redirectTo: '/home'
       });
    });
    
})()