// this is a test to see how the Git inttegration works
//jQuery.ajax({
//    url: '//apis.google.com/js/client.js',
//    jsonp: 'onload',
//    //jsonpCallback: 'handleClientLoad',
//    dataType: 'jsonp',
//    success: function() {
//        console.log('running handleClientLoad');
//        window.setTimeout(ns.checkAuth,1);
//    },
//    error: function(errorObj, status, errorThrown) {
//        console.error('error getting Google client - ' + status + ' - ' + errorThrown);
//    }
//});

var ns = {
    //google plus example: clientId: '225282791128-61mhmpnafeogl1eel69sl19ahn194q8l.apps.googleusercontent.com',
    //google plus example: scopes: 'https://www.googleapis.com/auth/plus.me',
    clientId: '782065656987-vo55s1ki18vfk5vnm6cr6qtos3vn0uen.apps.googleusercontent.com',
    scopes: 'https://www.googleapis.com/auth/tasks.readonly',
    /*checkAuth: function() {
        console.log('checkAuth start...');
        gapi.auth.authorize({client_id: ns.clientId, scope: ns.scopes, immediate: true}, ns.handleAuthResult);
    },*/
    handleAuthResult: function(authResult) {
        console.log('handleAuthResult start...');
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
            authorizeButton.style.visibility = 'hidden';
           //ns.makeApiCall();

        } else {
            authorizeButton.style.visibility = '';
            authorizeButton.onclick = ns.handleAuthClick;
        }
    },
    handleAuthClick: function(event) {
        console.log('handleAuthClick start...');
        gapi.auth.authorize({client_id: ns.clientId, scope: ns.scopes, immediate: false}, ns.handleAuthResult);
        return false;
    },
    /*makeApiCall: function() {
        console.log('makeApiCall start...');

        gapi.client.load('tasks', 'v1', function() {
            var request = gapi.client.tasks.tasklists.list({
                'maxResults': 10
            });
            request.execute(function(resp) {
                console.log("Task lists returned...");
                var taskLists = resp.items;
                if (taskLists && taskLists.length > 0) {
                    for (var i = 0; i < taskLists.length; i++) {
                        var taskList = taskLists[i];
                        console.log(taskList.title + ' (' + taskList.id + ')')
                        //appendPre(taskList.title + ' (' + taskList.id + ')');
                    }
                } else {
                    console.log('No task lists found.');
                }
            });
        });

        // plus example
        //gapi.client.load('plus', 'v1', function() {
        //    var request = gapi.client.plus.people.get({
        //        'userId': 'me'
        //    });
        //    request.execute(function(resp) {
        //        var heading = document.createElement('h4');
        //        var image = document.createElement('img');
        //        image.src = resp.image.url;
        //        heading.appendChild(image);
        //        heading.appendChild(document.createTextNode(resp.displayName));
        //        document.getElementById('content').appendChild(heading);
        //    });
        //});
    },*/
    handleClientLoad: function() {
        console.log('running ns.handleClientLoad');
        window.setTimeout(ns.checkAuth,1);
    }
};

function handleClientLoad() {
    console.log('running handleClientLoad');
    //window.setTimeout(ns.checkAuth,1);
    ns.checkAuth();
}