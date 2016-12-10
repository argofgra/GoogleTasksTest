/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var app = angular.module('TasksList');
    app.factory('tasksSvc', tasksSvc);

    tasksSvc.$inject = ['$q', 'logger', '$routeParams'];

    function tasksSvc($q, logger, $routeParams) {

        var clientId = '782065656987-vo55s1ki18vfk5vnm6cr6qtos3vn0uen.apps.googleusercontent.com';
        var scopes = 'https://www.googleapis.com/auth/tasks.readonly';

        var service = {
            checkAuth: checkAuth,
            getTaskLists: getTaskLists,
            getTasksFromList: getTasksFromList
        };

        return service;

        ///////////////////
        /**
         * Checks if user is authenticated to Google
         * @param immediate
         * @returns {*}
         */
        function checkAuth(immediate) {
            logger.info('checkAuth start...');
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
            logger.info('Get task lists using gapi');

            var deferred = $q.defer();

            gapi.client.load('tasks', 'v1', function() {
                logger.info('tasks api loaded');
                logger.info('Getting task lists');

                gapi.client.tasks.tasklists.list({
                    'maxResults': 10
                }).then(
                    function(response) {
                        logger.info('Task lists returned');
                        deferred.resolve(response.result.items);
                    }, function(error) {
                        logger.error('Failed getting task lists');
                    });
            });

            return deferred.promise;
        }

        function getTasksFromList() {
            var listId = $routeParams.listId;
            logger.info('Getting tasks from list ' + listId);
            logger.info('listId type: ' + typeof(listId));

            var deferred = $q.defer();

            gapi.client.tasks.tasks.list({
                'tasklist': listId
            }).then(
                function(response) {
                    logger.info('Tasks retrieved, count ' + response.result.items.length);
                    deferred.resolve(response.result.items);
                }, function(error) {
                    logger.error(error);
                });

            return deferred.promise;
        }
    }
}());