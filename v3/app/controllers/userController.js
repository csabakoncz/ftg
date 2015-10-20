define([ '../ngmodule' ], function(appModule) {

    appModule.controller('userController', function($scope, userService) {

        $scope.userForm = {};
        
        $scope.login = function() {
            var username = $scope.userForm.username;
            var password = $scope.userForm.password;

            userService.login(username, password, $scope.updateUserInfoNonAngular);
        };

        $scope.logout = function() {
            userService.logout();
            $scope.updateUserInfo();
        }

    });

});