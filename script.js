var ns = {
    clientId: '225282791128-61mhmpnafeogl1eel69sl19ahn194q8l.apps.googleusercontent.com',
    scopes: 'https://www.googleapis.com/auth/plus.me',
    checkAuth: function() {
        console.log('checkAuth start...');
        gapi.auth.authorize({client_id: ns.clientId, scope: ns.scopes, immediate: true}, this.handleAuthResult);
    },
    handleAuthResult: function(authResult) {
        console.log('handleAuthResult start...');
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
            authorizeButton.style.visibility = 'hidden';
           ns.makeApiCall();
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
    makeApiCall: function() {
        console.log('makeApiCall start...');
        gapi.client.load('plus', 'v1', function() {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function(resp) {
                var heading = document.createElement('h4');
                var image = document.createElement('img');
                image.src = resp.image.url;
                heading.appendChild(image);
                heading.appendChild(document.createTextNode(resp.displayName));
                document.getElementById('content').appendChild(heading);
            });
        });
    }
};

function handleClientLoad() {
    console.log('running handleClientLoad');
    window.setTimeout(ns.checkAuth,1);
}