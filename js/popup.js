window.fbAsyncInit = function init() {
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
            FB.api('/me/picture', 'GET', {
                access_token: localStorage.accessToken
            }, function (response) {
                var img = $('<img>', {src: response.data.url})
                $('body').append(img)
            })
        } else {
            loginFacebook()
        }    
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

function showPosts() {
    FB.api('/me/feed', 'GET', {
        fields: 'id,comments,picture,message',
        accessToken: localStorage.accessToken
    }, function (response) {
        console.log(response)
    })
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
