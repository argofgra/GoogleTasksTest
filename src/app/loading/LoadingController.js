(function() {
    "use strict";

    var app = angular.module('TasksList');
    app.controller('LoadingController', LoadingController);

    LoadingController.$inject = ['$rootScope', '$log', 'tasks', '$http', '$location'];

    function LoadingController($rootScope, $log, tasks, $http, $location) {
        $log.log('loading...');

        var vm = this;
        vm.showAuthButton = false;
        vm.authButtonClick = authButtonClick;

        activate();

        /////////////////////

        /**
         * Controller activation
         */
        function activate() {
            $rootScope.isAuthenticated = false;
            checkAuthorization();
        }

        /**
         * Handles successful authorization, redirecting to /lists
         * @param value
         */
        function authSuccess(value) {
            $log.log('Authorization successful!');
            $rootScope.isAuthenticated = true;
            vm.showAuthButton = false;

            $location.path('/lists');
        }

        /**
         * Handles failed authorization, showing the authenticate button
         * @param error
         */
        function authFail(error) {
            $log.error('Authorization failed :(');
            $rootScope.isAuthenticated = false;
            vm.showAuthButton = true;
        }

        /**
         * Waits for gapi to load and then checks if user is authenticated
         */
        function checkAuthorization() {
            $log.log('checkAuthorization: gapiLoaded = ' + gapiLoaded.toString());
            if (googleClientLoaded) {
                $log.log('googleClientLoaded is a thing');
            } else {
                $log.log('no such thing as googleClientLoaded');
            }

            if (gapiLoaded) {
                tasks.checkAuth(true).then(authSuccess, authFail);
            } else {
                $log.log('setting timeout');
                window.setTimeout(checkAuthorization, 1);
            }
        }

        /**
         * Authorization button click handler
         */
        function authButtonClick() {
            $log.log('Auth button clicked...');
            tasks.checkAuth(false).then(authSuccess).fail(authFail);
        }
    }
}());