function onFacebookLogin() {
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
            console.log(expiresTime)
            localStorage.expiresTime = Date.now() + Number(expiresTime)*1000;
            getLongLiveToken(localStorage.accessToken)
        })
    })
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);