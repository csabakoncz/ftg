define([ '../ngmodule' ], function(appModule) {

    appModule.controller('userController', function($scope, $window, userService) {

        $scope.userForm = {};

        $scope.loginWithGithub = function() {
            let url = 'https://github.com/login/oauth/authorize?client_id=2424e4e1c3bbe5132a2c&redirect_uri=https://csabak.herokuapp.com/ftg-github-auth/v4/&scope=repo'
            $window.location = url
        };

        $scope.logout = function() {
            userService.logout();
            $scope.updateUserInfo();
        }

    });

});