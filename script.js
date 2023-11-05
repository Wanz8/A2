function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function login() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        if (this.status == 200) {
            // Set cookie when logged in
            setCookie("username", document.getElementById('username').value, 1);
            window.location.href = "/main.html";
        }
    }
    var data = {
        username: document.getElementById('username').value
    };
    xhr.send(JSON.stringify(data));
}
var username;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.onload = function() {
    username = getParameterByName('username'); // Get username from the URL
    getTweets();
}

function getTweets() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/tweet', true);
    xhr.onload = function() {
        if (this.status == 200) {
            var tweets = JSON.parse(this.responseText);
            var output = '';
            for (var i in tweets) {
                output += '<li>' +
                    tweets[i].content + ' by ' + tweets[i].username +
                    ' <button onclick="updateTweet(' + tweets[i].id + ')">Update</button>' +  // 这里添加Update按钮
                    '</li>';
            }
            document.getElementById('tweets').innerHTML = output;
        }
    }
    xhr.send();
}

function postTweet() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tweet', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        if (this.status == 201) {
            getTweets(); // 重新加载推文
        }
    }
    var data = {
        content: document.getElementById('tweet').value,
        username: getCookie('username')
    };
    xhr.send(JSON.stringify(data));
}
function updateTweet(id) {
    var updatedContent = prompt("Update your tweet:", "");
    if (updatedContent !== null) {
        var xhr = new XMLHttpRequest();
        xhr.open('UPDATE', `/api/tweet/${id}`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function() {
            if (this.status == 200) {
                getTweets(); // refresh the displayed tweets after updating
            }
        }
        var data = {
            content: updatedContent,
            username: getCookie('username')
        };
        xhr.send(JSON.stringify(data));
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}



window.onload = function() {
    if(window.location.pathname.endsWith("main.html")) {
        getTweets(); // 如果是主页面, 则加载推文
    }
}
