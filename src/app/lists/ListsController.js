/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var app = angular.module('TasksList');
    app.controller('ListsController', ListsController);

    ListsController.$inject = ['$log', 'tasks', '$rootScope', '$location', 'logger'];

    function ListsController($log, tasks, $rootScope, $location, logger) {

        var vm = this;
        vm.taskLists = [];

        activate();

        ///////////////

        /**
         * Controller activation
         */
        function activate() {
            //handleRoutingErrors();
            tasks.getTaskLists().then(getTaskListsSuccess, getTaskListsFail);
        }

        //TODO: never got this working, look at it again later
        /*function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                    //if (handlingRouteChangeError) {
                    //    return;
                    //}
                    //routeCounts.errors++;
                    //handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
        }*/

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