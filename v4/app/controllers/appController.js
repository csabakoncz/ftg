define([ '../ngmodule' ], function(appModule) {
    appModule.controller('appController', function($scope, entityConfig, userService, loggerService, $window) {

        loggerService.scope = $scope;

        $scope.entityConfig = entityConfig;
        $scope.entities = entityConfig.entities;

        $scope.appUserInfo = {};

        $scope.updateUserInfo = function() {
            userService.updateUserInfo($scope.appUserInfo);
        }

        // this function is used as a Parse callback, too
        $scope.updateUserInfoNonAngular = function() {
            $scope.$apply($scope.updateUserInfo);
        }
        $scope.updateUserInfo();

        $scope.editing = {};

        $scope.statusInfo = function(msg) {
            $scope.error = false;
            $scope.status = msg;
        }
        $scope.statusError = function(msg) {
            $scope.error = true;
            $scope.status = msg;
        }

        $scope.statusInfo('OK');

        $scope.$on('exceptionOccurred', function(event, exception, cause) {
            $scope.statusError('BIG PROBLEM: ' + exception + ': ' + cause);
        });

        var checkUnsavedObjects = function() {
            var dirtyEntityCollection = entityConfig.entities.find(function(entity) {
                var dirtyItem = entity.items.find(function(entityItem) {
                    return entityItem.dirty();
                });
                return dirtyItem != undefined;
            });

            if (dirtyEntityCollection) {
                return "There are unsaved entries. Are you sure you want to leave without saving them?";
            }
        }

        $window.onbeforeunload = checkUnsavedObjects;
    });
});