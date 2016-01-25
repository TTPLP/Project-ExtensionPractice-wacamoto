function init() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (localStorage.accessToken) {
            console.log(localStorage.accessToken)
            $('#showAccessToken').html(localStorage.accessToken)
        } else {
            loginFacebook(init)
        }    
    })
}

function loginFacebook() {
    function windowScript() {
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
            chrome.windows.remove(tabs.id);
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
            scope:          'publish_actions'
        }),
        'width': 580,
        'height': 400
    }, windowScript)
}

init()

$('#showAccessToken').html(localStorage.accessToken)