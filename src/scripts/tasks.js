/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var tasks = function($q, $log) {

        var clientId = '782065656987-vo55s1ki18vfk5vnm6cr6qtos3vn0uen.apps.googleusercontent.com';
        var scopes = 'https://www.googleapis.com/auth/tasks.readonly';

        /**
         * Checks if user is authenticated to Google
         * @param immediate
         * @returns {*}
         */
        var checkAuth = function(immediate) {
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
        var getTaskLists = function() {
            console.log('makeApiCall start...');

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
                //request.execute(function(resp) {
                //    console.log("Task lists returned...");
                //    var taskLists = resp.items;
                //    deferred.resolve(taskLists);
                //    //if (taskLists && taskLists.length > 0) {
                //    //    for (var i = 0; i < taskLists.length; i++) {
                //    //        var taskList = taskLists[i];
                //    //        console.log(taskList.title + ' (' + taskList.id + ')');
                //    //        //appendPre(taskList.title + ' (' + taskList.id + ')');
                //    //    }
                //    //} else {
                //    //    console.log('No task lists found.');
                //    //}
                //});
            });

            return deferred.promise;
        };

        return {
            checkAuth: checkAuth,
            getTaskLists: getTaskLists
        };

    };

    tasks.$inject = ['$q', '$log'];
    var app = angular.module('TasksList');
    app.factory('tasks', tasks);
}());