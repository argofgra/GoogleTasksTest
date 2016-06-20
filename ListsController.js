/**
 * Created by Rebecca on 6/7/2016.
 */
(function () {

    var ListsController = function($scope, $log, tasks) {

        var getTaskListsSuccess = function(data) {
            $log.log('got Task Lists Successfully!');
            $scope.taskLists = data;
        };

        var getTaskListsFail = function(data) {
            $log.error("Failed to get task lists :(");
        };

        tasks.getTaskLists().then(getTaskListsSuccess, getTaskListsFail);

    };
    var app = angular.module('TasksList');
    app.controller('ListsController', ListsController)
}());