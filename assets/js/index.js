
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

        $.post('/v0/account/login', {user_name: username, password: password},
            function (res) {
                localStorage.clear();
                if (res.error_code == 0){
                    updateLocalStorage(res);
                    window.location.href = "recharge.html";
                }else{
                    switch (res.error_code){
                        case 1:
                            showLoginErr("未知的错误");
                            break;
                        case 2:
                            showLoginErr("手机格式非法");
                            break;
                        case 3:
                            showLoginErr("参数为空");
                            break;
                        case 4:
                            showLoginErr("没有授权");
                            break;
                        case 10001:
                            showLoginErr("错误码验证失败");
                            break;
                        case 10002:
                            showLoginErr("昵称已经存在");
                            break;
                        case 10003:
                            showLoginErr("设置密码太短");
                            break;
                        case 10004:
                            showLoginErr("手机号码已经存在");
                            break;
                        case 10021:
                            showLoginErr("用户名或密码错误");
                            break;
                        case 10041:
                            showLoginErr("token非法");
                            break;
                        case 10042:
                            showLoginErr("验证码已发送");
                            break;
                        case 10043:
                            showLoginErr("验证码超时");
                            break;
                        case 10044:
                            showLoginErr("验证码发送失败");
                            break;
                        case 10045:
                            showLoginErr("柑子不够");
                            break;
                        default:
                            showLoginErr("登陆失败!" + "  状态码："+res.error_code);

                    }
                }
            }).fail(function (response) {
                showLoginErr("登陆失败!" + "  状态码："+response.status);
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


