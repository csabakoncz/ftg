define([ '../ngmodule' ], function(appModule) {
    appModule.controller('appController', function($scope, entityConfig) {

        $scope.entityConfig = entityConfig;
        $scope.entities = entityConfig.entities;
        
        $scope.editing = {};

        $scope.previewWidth=400;
        $scope.previewHeight=400;
        
        $scope.statusInfo = function(msg) {
            $scope.error = false;
            $scope.status = msg;
        }
        $scope.statusError = function(msg) {
            $scope.error = true;
            $scope.status = msg;
        }
        
        $scope.statusInfo('OK');
        
        $scope.$on('exceptionOccurred', function(event, exception, cause){
           $scope.statusError('BIG PROBLEM: '+exception+': '+cause); 
        });
    });
});