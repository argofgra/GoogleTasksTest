/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

    var app = angular.module('TasksList', ["ngRoute"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/lists', {
                templateUrl: '../templates/lists.html',
                controller: 'ListsController'
            })
            .when('/loading', {
                templateUrl: '../templates/loading.html',
                controller: 'LoadingController'
            })
            //.when('/user/:username', {
            //    templateUrl: 'user.html',
            //    controller: 'UserController'
            //})
            //.when('/repo/:username/:reponame', {
            //    templateUrl: 'repo.html',
            //    controller: 'RepoController'
            //})
            .otherwise({redirectTo: '/lists'});
    }).run(function($rootScope, $location) {
        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            if ($rootScope.isAuthenticated !== true && next.templateUrl !== "/loading") {
                $location.path('/loading');
            }
        });
    });

}());

var gapiLoaded = false;
function googleClientLoaded() {
    gapiLoaded = true;
}