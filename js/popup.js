window.fbAsyncInit = function init() {
    FB.init({
        appId:      app.id,
        xfbml:      true,
        version:    'v2.5'
    })
    var now = Date.now()
    if (localStorage.accessToken && localStorage.expiresTime > now) {
    // test
    showPosts()
    // test
    showPicture()
    } else {
        loginFacebook()
    }    
}

function showPicture() {
    FB.api('/me', 'GET', {
        fields: 'name,picture',
        access_token: localStorage.accessToken
    }, function (response) {
        var img = $('<img>', {src: response.picture.data.url})
        $('#me').append(img)
        $('#me').append(response.name, $('<input type="text" />'))
    })
}

function showPosts() {
    FB.api('/me/feed', 'GET', {
        fields: 'from,created_time,message,picture,likes,comments',
        access_token: localStorage.accessToken
    }, function(response) {
        console.log(response)
        var posts = response.data;
        for (var i = 0; i < posts.length; i++) {
            var post = $('<div></div>').addClass('post')

            if (posts[i].from) {
                var poster = $('<span></span>').html(posts[i].from.name)
                poster.addClass('post-poster')
                post.append(poster)
            }
            if (posts[i].created_time) {
                var d = new Date(posts[i].created_time)
                d = ' ' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay()
                var createdTime = $('<span></span>').html(d)
                post.addClass('post-time')
                post.append(createdTime)
            }
            if (posts[i].message) {
                var message = $('<p></p>').html(posts[i].message)
                message.addClass('post-message')
                post.append(message)
            }
            if (posts[i].picture) {
                var picture = $('<img>', {src: posts[i].picture})
                picture.addClass('post-picture')
                post.append(picture)
            }
            if (posts[i].likes) {
                var likes = $('<span></span>')
                likes.html('like: ' + posts[i].likes.data.length)
                post.append(likes)
            }
            if (posts[i].comments) {
                var comments = posts[i].comments.data;
                var commentsTag = $('<div></div>').addClass('comments')
                
                for (var c = 0; c < comments.length; c++) {
                    var name = $('<span></span>').html(comments[c].from.name);
                    var commentMessage = comments[c].message;
                    var comment = $('<p></p>').addClass('comment')
                    comment.append(name, ' ' + commentMessage)
                    commentsTag.append(comment)
                }
                post.append(commentsTag)
            }
            $('#posts').append(post)
        }
    })
}

function loginFacebook() {
    chrome.windows.create({
        'url': loginURL('www.facebook.com', '/dialog/oauth', {
            client_id:      app.id,
            scope:          app.scope,
            redirect_uri:   'http://' + app.redirect_uri,
            response_type:  'token'
        })
    })
}

// load JS SDK
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
