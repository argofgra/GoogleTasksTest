(function () {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        //'ngAnimate', 'ngRoute', 'ngSanitize',

        /*
         * Our reusable cross app code modules
         */
        'utils.exception', 'utils.logger'
        //, 'utils.router'
        //,
        /*
         * 3rd Party modules
         */
        //'ui.bootstrap',     // ui-bootstrap (ex: carousel, pagination, dialog)
        //'breeze.angular',   // tells breeze to use $q instead of Q.js
        //'breeze.directives',// breeze validation directive (zValidate)
        //'ngplus',           // ngplus utilities
        //'ngzWip'            // zStorage and zStorageWip
    ]);
})();