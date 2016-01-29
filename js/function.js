app = {
    id:             1674115332869324,
    scope:          'publish_actions,publish_actions',
    client_secret:  '3c4181b5d7db9c166d38dbd6773d52f6',
    redirect_uri:   'www.facebook.com/connect/login_success.html',
}

function loginURL(site, path, params) {
    var urlpar = '';
    if (params) {
        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            urlpar += keys[i] + '=' + params[keys[i]] + '&'
        }
        urlpar = '?' + urlpar 
    }
    return 'https://'.concat(site, path, urlpar)
}

// get facebook accessToken
function getToken() {
    chrome.tabs.query({
        active: true
    }, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.indexOf(app.redirect_uri) !== -1) {
                var tabUrl = tabs[i].url;
                var params = tabUrl.split('#')[1];
                var accessToken = params.split('&')[0];
                var expiresTime = params.split('&')[1];
                expiresTime = expiresTime.split('=')[1];

                // store accessToken & expiresTime
                localStorage.accessToken = accessToken.split('=')[1];
                localStorage.expiresTime = Date.now() + Number(expiresTime)*1000;
                
                // get 60 day accessToken
                getLongLiveToken(localStorage.accessToken)    
            }
        }
    })
}

// get 60 day expiresTime accessToken 
function getLongLiveToken(accessToken) {
    $.ajax({
        type: 'GET',
        url: loginURL('graph.facebook.com', '/oauth/access_token', {
            client_id:          app.id,
            client_secret:      app.client_secret,
            grant_type:         'fb_exchange_token',
            fb_exchange_token:  localStorage.accessToken
        })
    }).done(function(response) {
        var accessToken = response.split('&')[0];
        var expiresTime = response.split('&')[1];
        expiresTime = expiresTime.split('=')[1];

        // store accessToken & expiresTime
        localStorage.accessToken = accessToken.split('=')[1];
        localStorage.expiresTime = Date.now() + Number(expiresTime)*1000;
    })
}