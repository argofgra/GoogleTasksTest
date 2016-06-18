/**
 * Created by Rebecca on 6/7/2016.
 */
(function(){

    var app = angular.module('TasksList', ["ngRoute"]);

    app.config(function($routeProvider){
        $routeProvider
            .when('/lists', {
                templateUrl: 'lists.html',
                controller: 'ListsController'
            }).when('/loading', {
                templateUrl: 'loading.html',
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
            .otherwise({redirectTo: '/loading'});
    });

}());

var gapiLoaded = false;
function googleClientLoaded() {
    gapiLoaded = true;
}