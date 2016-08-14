/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

     angular.module('TasksList', ["ngRoute"])
        .config(configRoutes)
        .run(appRun);

    configRoutes.$inject = ['$routeProvider'];
    function configRoutes($routeProvider) {
        $routeProvider
            .when('/lists', {
                templateUrl: 'templates/lists.html',
                controller: 'ListsController'
            })
            .when('/loading', {
                templateUrl: 'templates/loading.html',
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
    }

    appRun.$inject = ['$rootScope', '$location'];
    function appRun($rootScope, $location) {
        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            if ($rootScope.isAuthenticated !== true && next.templateUrl !== "/loading") {
                $location.path('/loading');
            }
        });
    }
}());

var gapiLoaded = false;
function googleClientLoaded() {
    console.log('googleClientLoaded callback');
    gapiLoaded = true;
}