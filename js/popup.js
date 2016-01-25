function init() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        FB.init({
            appId: '1674115332869324',
            xfbml: true,
            version: 'v2.5'
        })
        if (localStorage.accessToken) {
            FB.api('/me/picture', 'GET',{access_token: localStorage.accessToken}, function(response){
                var img = $('<img>', {src: response.data.url})
                $('body').append(img)
                console.log(response.data.url)
            })
        } else {
            loginFacebook()
        }    
    })
}

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
                localStorage.accessToken = accessToken.split('=')[1];
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
            redirect_uri:   'http://localhost:8000/',
            scope:          'publish_actions,user_birthday'
        })
    }, windowScript)
}

init()

