/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

     angular.module('TasksList', ["ngRoute", "app.core"])
        .config(configRoutes)
        .run(appRun);

    configRoutes.$inject = ['$routeProvider'];
    appRun.$inject = ['$rootScope', '$location'];

    function configRoutes($routeProvider) {
        $routeProvider
            .when('/lists', {
                templateUrl: 'app/lists/lists.html',
                controller: 'ListsController',
                controllerAs: 'vm'
            })
            .when('/loading', {
                templateUrl: 'app/loading/loading.html',
                controller: 'LoadingController',
                controllerAs: 'vm'
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

    //TODO: consider making this a resolver function that returns a promise and waits until the user is authenticated... does that make sense?
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