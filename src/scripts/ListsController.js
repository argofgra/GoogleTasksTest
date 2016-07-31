/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var ListsController = function($scope, $log, tasks) {

        /**
         * Handles successful retrieval of task lists
         * @param data
         */
        var getTaskListsSuccess = function(data) {
            $log.log('got Task Lists Successfully!');
            $scope.taskLists = data;
        };

        /**
         * Handles failed retrieval of task lists
         * @param data
         */
        var getTaskListsFail = function(data) {
            $log.error("Failed to get task lists :(");
        };

        tasks.getTaskLists().then(getTaskListsSuccess, getTaskListsFail);

    };

    ListsController.$inject = ['$scope', '$log', 'tasks'];
    var app = angular.module('TasksList');
    app.controller('ListsController', ListsController);
}());