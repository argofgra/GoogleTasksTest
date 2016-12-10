/**
 * Created by Rebecca on 6/7/2016.
 */
(function() {
    "use strict";

     angular.module('TasksList', ["ngRoute", "app.core"])
        .config(configRoutes)
        .run(appRun);

    /////////////////////////

    configRoutes.$inject = ['$routeProvider'];
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

    appRun.$inject = ['$rootScope', '$location', 'logger'];
    //TODO: consider making this a resolver function that returns a promise and waits until the user is authenticated... does that make sense?
    function appRun($rootScope, $location, logger) {

        //var handlingRouteChangeError = false;
        //handleRoutingErrors(); //TODO: get this working
        authRouting();

        //////////////////

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

        function authRouting() {
            $rootScope.$on("$locationChangeStart", function (event, next, current) {
                if ($rootScope.isAuthenticated !== true && next.templateUrl !== "/loading") {
                    $location.path('/loading');
                }
            });
        }
    }
}());

var gapiLoaded = false;
function googleClientLoaded() {
    console.log('googleClientLoaded callback');
    gapiLoaded = true;
}