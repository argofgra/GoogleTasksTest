/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

     angular.module('TasksList', ["ngRoute"])
        .config(configRoutes)
        .run(appRun);

    configRoutes.$inject = ['$routeProvider'];
    appRun.$inject = ['$rootScope', '$location'];

    function configRoutes($routeProvider) {
        $routeProvider
            .when('/lists', {
                templateUrl: 'templates/lists.html'
            })
            .when('/loading', {
                templateUrl: 'templates/loading.html'
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