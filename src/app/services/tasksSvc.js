/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var app = angular.module('TasksList');
    app.factory('tasksSvc', tasksSvc);

    tasksSvc.$inject = ['$q', '$log'];

    function tasksSvc($q, $log) {

        var clientId = '782065656987-vo55s1ki18vfk5vnm6cr6qtos3vn0uen.apps.googleusercontent.com';
        var scopes = 'https://www.googleapis.com/auth/tasks.readonly';

        var service = {
            checkAuth: checkAuth,
            getTaskLists: getTaskLists
        };

        return service;

        ///////////////////
        /**
         * Checks if user is authenticated to Google
         * @param immediate
         * @returns {*}
         */
        function checkAuth(immediate) {
            console.log('checkAuth start...');
            var deferred = $q.defer();

            gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: immediate}, function(authResult) {
                console.log('handleAuthResult start...');
                if (authResult && !authResult.error) {
                    deferred.resolve();
                } else {
                    deferred.reject(authResult.error);
                }
            });

            return deferred.promise;
        };

        /**
         * Retrieves task lists, loading tasks API if needed
         * @returns {*}
         */
        function getTaskLists() {
            console.log('Get task lists using gapi');

            var deferred = $q.defer();

            gapi.client.load('tasks', 'v1', function() {
                $log.log('tasks api loaded');
                $log.log('Getting task lists');
                gapi.client.tasks.tasklists.list({
                    'maxResults': 10
                }).then(
                    function(response) {
                        $log.log('Task lists returned');
                        deferred.resolve(response.result.items);
                    }, function(error) {
                        $log.error('Failed getting task lists');
                    });
            });

            return deferred.promise;
        }
    }
}());