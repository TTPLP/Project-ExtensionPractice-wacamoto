function init() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        FB.init({
            appId:      '1674115332869324',
            xfbml:      true,
            version:    'v2.5'
        })
        var now = Date.now()
        if (localStorage.accessToken && localStorage.expiresTime > now) {
            // show picture
            FB.api('/me/picture', 'GET',{access_token: localStorage.accessToken}, function (response){
                var img = $('<img>', {src: response.data.url})
                $('body').append(img)
                console.log(response.data.url)
            })
        } else {
            loginFacebook()
        }    
    })
}

// Publish a Post
// function  PublishPost() {
//     FB.api('/me/feed', 'POST', {
//         access_token: localStorage.accessToken,
//         message: $('#message').val()
//     }, function (response) {
//         console.log(response)
//     })
// }

function loginFacebook() {

    function windowScript(windows) {
        chrome.tabs.query({
            active: true
        }, function(tabs) {
            tabid = tabs[0].id;
            chrome.tabs.onUpdated.addListener(function(tabid, tab) {
                var tabUrl = tab.url;
                var params = tabUrl.split('#')[1];
                var accessToken = params.split('&')[0];
                var expiresTime = params.split('&')[1];
                expiresTime = expiresTime.split('=')[1];
                localStorage.accessToken = accessToken.split('=')[1];
                localStorage.expiresTime = Date.now() + Number(expiresTime)*1000;
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

    chrome.windows.create({
        'url' : loginURL('www.facebook.com', '/dialog/oauth', {
            client_id:      1674115332869324,
            response_type:  'token',
            redirect_uri:   'http://www.facebook.com/connect/login_success.html',
            scope:          'publish_actions,publish_actions'
        })
    }, windowScript)
}

init()