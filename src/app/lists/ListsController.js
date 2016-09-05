/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var app = angular.module('TasksList');
    app.controller('ListsController', ListsController);

    ListsController.$inject = ['$log', 'tasks'];

    function ListsController($log, tasks) {

        var vm = this;
        vm.taskLists = [];

        activate();

        ///////////////

        /**
         * Controller activation
         */
        function activate() {
            tasks.getTaskLists().then(getTaskListsSuccess, getTaskListsFail);
        }

        /**
         * Handles successful retrieval of task lists
         * @param data
         */
        function getTaskListsSuccess(data) {
            $log.log('got Task Lists Successfully!');
            vm.taskLists = data;
        }

        /**
         * Handles failed retrieval of task lists
         * @param data
         */
        function getTaskListsFail(data) {
            $log.error("Failed to get task lists :(");
        }
    }
}());