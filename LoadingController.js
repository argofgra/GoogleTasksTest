(function () {

    var LoadingController = function($scope, $rootScope, $log, tasks, $http, $location) {
        $log.log('loading...');

        var authSuccess = function(value) {
            $log.log('Authorization successful!');
            $rootScope.isAuthenticated = true;
            $scope.showAuthButton = false;

            $location.path('/lists');
        };

        var authFail = function(error) {
            $log.error('Authorization failed :(');
            $rootScope.isAuthenticated = false;
            $scope.showAuthButton = true;
        };

        // initialize variables

        $scope.showAuthButton = false;
        $rootScope.isAuthenticated = false;

        // run initialization code
        var init = function() {
            $log.log('init');
            if (gapiLoaded) {
                tasks.checkAuth(true).then(authSuccess, authFail);
            } else {
                $log.log('setting timeout');
                window.setTimeout(init, 1);
            }
        };

        $scope.authButtonClick = function() {
            $log.log('Auth button clicked...');
            tasks.checkAuth(false).then(authSuccess).fail(authFail);
        };

        init();

        //if (!$scope.clientLoaded) {
        //    $http.jsonp('https://apis.google.com/js/client.js?onload=JSON_CALLBACK')
        //        .success(function(data, status, headers, config) {
        //            $scope.clientLoaded = true;
        //            tasks.checkAuth(true).then(authSuccess).fail(authFail);
        //        })
        //        .error(function(data, status, headers, config) {
        //            debugger;
        //            $log.error('Failed to load Google client');
        //    });
        //}


    };
    var app = angular.module('TasksList');
    app.controller('LoadingController', LoadingController)

}());