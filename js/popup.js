window.fbAsyncInit = function init() {
    FB.init({
        appId:      app.id,
        xfbml:      true,
        version:    'v2.5'
    });

    var now = Date.now();
    if (localStorage.accessToken && localStorage.expiresTime > now) {
        //  test
        showPosts();
        showMe();
        $('#writePost-btn').on('click', writePost);
    } else {
        loginFacebook();
    }    
}

function showMe() {
    FB.api('/me', 'GET', {
        fields: 'name,picture',
        access_token: localStorage.accessToken
    }, function (response) {
        var me = showFrom(response).addClass('post-poster');
        $('#writePost').prepend(me);
    });
}

function writePost() {
    var message = $('#writePost-text').val();
     // clear input value
    $('#writePost-text').val('');
    if (message) {
        console.log(message)
        FB.api('/me/feed', 'POST', {
            message: message,
            access_token: localStorage.accessToken        
        }, function(response) {
            console.log(response)
        })
        // for temp
        $('.apost').remove()
        showPosts()
    }
}

function showPosts() {
    FB.api('/me/feed', 'GET', {
        fields: 'from{name,picture},created_time,message,full_picture \
                ,likes,comments{message,from{name,picture}}',
        access_token: localStorage.accessToken
    }, function(response) {
        var posts = response.data;
        for (var i = 0; i < posts.length; i++) {
            var post = $('<div></div>').addClass('post apost');
            
            if (posts[i].from) {
                var from = showFrom(posts[i].from);
                from.addClass('post-poster');
                post.append(from);
            }
            if (posts[i].created_time) {
                var d = new Date(posts[i].created_time);
                d = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay();
                post.append($('<span></span>')
                    .html(d)
                    .addClass('post-time'));
            }
            if (posts[i].message) {
                post.append($('<div></div>')
                    .html(posts[i].message)
                    .addClass('post-message'));
            }
            if (posts[i].full_picture) {
                post.append($('<img>')
                    .attr('src', posts[i].full_picture)
                    .addClass('post-picture'));
            }
            if (posts[i].likes) {
                post.append($('<span></span>')
                    .html('like: '+ posts[i].likes.data.length)
                    .addClass('post-likes'));
            }
            if (posts[i].comments) {
                post.append(showComments(posts[i].comments.data));
            }
            // append A post
            $('#posts').append(post);
        }
    })
}

// show poster
function showFrom(from) {
    var nameTag = $('<span></span>').html(from.name);
    var pictureTag = $('<img>', {src: from.picture.data.url});
    var fromTag =  $('<div></div>');
    fromTag.append(pictureTag, nameTag);

    return fromTag;
}

function showComments(comments) {
    var commentsTag = $('<div></div>').addClass('comments');
    for (var i = 0; i < comments.length; i++) {
        var fromTag = showFrom(comments[i].from);
        var messageTag = comments[i].message;
        var commentTag = $('<p></p>').addClass('comment');
        commentTag.append(fromTag, ' ' + messageTag);
        commentsTag.append(commentTag);
    }
    return commentsTag
}

function loginFacebook() {
    chrome.windows.create({
        'url': loginURL('www.facebook.com', '/dialog/oauth', {
            client_id:      app.id,
            scope:          app.scope,
            redirect_uri:   'http://' + app.redirect_uri,
            response_type:  'token'
        }),
        'width': 1100,
        'height' : 700
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
