(function () {

    var LoadingController = function($scope, $log, googleAuth, $http) {
        $log.log('loading...');

        var authSuccess = function(value) {
            $log.log('Authorization successful!');
            $scope.showAuthButton = false;
        };

        var authFail = function(error) {
            $log.error('Authorization failed :(');
            $scope.showAuthButton = true;
        };

        // initialize variables

        $scope.showAuthButton = false;

        // run initialization code
        var init = function() {
            $log.log('init');
            if (gapiLoaded) {
                googleAuth.checkAuth(true).then(authSuccess, authFail);
            } else {
                $log.log('setting timeout');
                window.setTimeout(init, 1);
            }
        };

        init();

        //if (!$scope.clientLoaded) {
        //    $http.jsonp('https://apis.google.com/js/client.js?onload=JSON_CALLBACK')
        //        .success(function(data, status, headers, config) {
        //            $scope.clientLoaded = true;
        //            googleAuth.checkAuth(true).then(authSuccess).fail(authFail);
        //        })
        //        .error(function(data, status, headers, config) {
        //            debugger;
        //            $log.error('Failed to load Google client');
        //    });
        //}

        $scope.authButtonClick = function() {
            $log.log('Auth button clicked...');
            googleAuth.checkAuth(false).then(authSuccess).fail(authFail);
        }

    };
    var app = angular.module('TasksList');
    app.controller('LoadingController', LoadingController)

}());