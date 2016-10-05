
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

        function logResults(json){
            console.log(json);
        }


        // $.ajax({
        //     url: "http://114.55.148.214:8000/login",
        //
        //     jsonp: "callback",
        //
        //     dataType: "jsonp",
        //
        //     data: {
        //         user_name:username,
        //         password: password
        //     },
        //
        //     success: function( response ) {
        //         console.log( response ); // server response
        //     }
        // });
        //
        // return;

        $.post('/v0/account/login', {user_name: username, password: password},
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
                    "role_name":"admin",
                    "win_rounds":3,
                    "total_score":0
                };

                if (res.error_code != 0){
                    showLoginErr("登陆失败!" + "  状态码："+res.error_code);
                    return;
                }


                updateLocalStorage(res);
                window.location.href = "recharge.html";
            }).fail(function (response) {
                showLoginErr("登陆失败!" + "  状态码："+response.status);


            //测试代码
            updateLocalStorage({
                "error_code":0,
                "token":"abdgfsjfds",
                "msg":"success",
                "user_id":123456,
                "user_name":"张三",
                "headimgurl":"http://xxxx",
                "sex":1,
                "doudou":10,
                "total_rounds":10,
                "role_name":"agent",
                "win_rounds":3,
                "total_score":0
            });
        });
    });
    function showLoginErr(msg) {
        $('#login-error').html(msg).css('visibility', 'visible');
    }

    function hideLoginErr() {
        $('#login-error').css('visibility', 'hidden');
    }

    //更新localStorage
    function updateLocalStorage(res){
        localStorage.user_id = res.user_id;
        localStorage.token = res.token;
        localStorage.headimgurl = res.headimgurl;
        localStorage.user_name = res.user_name;
        localStorage.doudou = res.doudou;
        localStorage.role_name = res.role_name;
    }
});


