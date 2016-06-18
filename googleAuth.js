/**
 * Created by Rebecca on 6/7/2016.
 */
(function () {

    var googleAuth = function($q) {

        var clientId = '782065656987-vo55s1ki18vfk5vnm6cr6qtos3vn0uen.apps.googleusercontent.com';
        var scopes = 'https://www.googleapis.com/auth/tasks.readonly';

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

        var getTaskLists = function() {
            console.log('makeApiCall start...');

            gapi.client.load('tasks', 'v1', function() {
                var request = gapi.client.tasks.tasklists.list({
                    'maxResults': 10
                });
                request.execute(function(resp) {
                    console.log("Task lists returned...");
                    var taskLists = resp.items;
                    if (taskLists && taskLists.length > 0) {
                        for (var i = 0; i < taskLists.length; i++) {
                            var taskList = taskLists[i];
                            console.log(taskList.title + ' (' + taskList.id + ')');
                            //appendPre(taskList.title + ' (' + taskList.id + ')');
                        }
                    } else {
                        console.log('No task lists found.');
                    }
                });
            });
        };

        return {
            checkAuth: checkAuth,
            getTaskLists: getTaskLists
        }

    };

    var app = angular.module('TasksList');
    app.factory('googleAuth', googleAuth)
}());