
jQuery(document).ready(function() {
    $('.page-container form').submit(function (e) {
        event.preventDefault();
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        if (username == '') {
            showLoginErr("用户名不能为空");
            return false;
        }
        if (password == '') {
            showLoginErr("密码不能为空");
            return false;
        }

        $.post('/v0/account/login', {user_name: username, field2: password},
            function (res) {
                var res = {
                    "error_code":0,
                    "token":"abdgfsjfds",
                    "msg":"success",
                    "user_id":123456,
                    "user_name":"张三",
                    "headimgurl":"http://xxxx",
                    "sex":1,
                    "doudou":10,
                    "total_rounds":10,
                    "win_rounds":3,
                    "total_score":0
                };

                localStorage.user_id = res.user_id;
                localStorage.token = res.token;
                localStorage.headimgurl = res.headimgurl;
                localStorage.user_name = res.user_name;
                
                window.location.href = "recharge.html";
            }).fail(function (response) {
                showLoginErr("登陆失败!" + "  状态码："+response.status);
                window.location.href = "recharge.html";
        });
    });
    function showLoginErr(msg) {
        $('#login-error').html(msg).css('visibility', 'visible');
    }

    function hideLoginErr() {
        $('#login-error').css('visibility', 'hidden');
    }
});


