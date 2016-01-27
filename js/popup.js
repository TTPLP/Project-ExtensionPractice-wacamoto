app = {
    id:             1674115332869324,
    scope:          'publish_actions,publish_actions',
    client_secret:  '3c4181b5d7db9c166d38dbd6773d52f6',
    redirect_uri:   'http://www.facebook.com/connect/login_success.html',
}

function init() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        FB.init({
            appId:      app.id,
            xfbml:      true,
            version:    'v2.5'
        })
        var now = Date.now()
        if (localStorage.accessToken && localStorage.expiresTime > now) {
            // show picture
            FB.api('/me/picture', 'GET',{access_token: localStorage.accessToken}, function (response){
                var img = $('<img>', {src: response.data.url})
                $('body').append(img)
            })
            // test 
            getLongLiveToken(localStorage.accessToken)
        } else {
            loginFacebook()
        }    
    })
}

// get 60 day expiresTime accessToken 
function getLongLiveToken(accessToken) {
    // FB.api('/oauth/access_token', 'GET', {
    //     client_id:          '1674115332869324',
    //     client_secret:      '3c4181b5d7db9c166d38dbd6773d52f6',
    //     grant_type:         'fb_exchange_token',
    //     fb_exchange_token:  localStorage.accessToken
    // }, function (response) {
    //     console.log(response)
    //     console.log(
    //         'access_token:' + response.access_token + 
    //         'expires_in:' + response.expires_in
    //     )
    // })
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
        console.log(expiresTime)
        localStorage.accessToken = accessToken.split('=')[1];
        localStorage.expiresTime = Date.now() + Number(expiresTime)*1000;
    })
}

function loginFacebook() {
    chrome.windows.create({
        'url' : loginURL('www.facebook.com', '/dialog/oauth', {
            client_id:      app.id,
            redirect_uri:   app.redirect_uri,
            response_type:  'token',
            scope:          'user_posts'
        })
    })
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

init()