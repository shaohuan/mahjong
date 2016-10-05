
jQuery(document).ready(function() {
    $('.page-container form').submit(function(){
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        if(username == '') {
            showError("用户名不能为空");
            return;
        }
        if(password == '') {
            showError("密码不能为空");
        }

        $.post('/v0/account/login', { user_name: username, field2 : password},
            function(returnedData){
                alert('success');
                localStorage.user = {'user_id':username,token:"xxx"};
                console.log(returnedData);
            }).fail(function(){
                console.log("error");
                localStorage.user = {'user_id':username,token:"xxx"};
        });
    });






    function showError(text){
        $(this).find('.error').fadeIn('fast', function(){
            $(this).find('span').html();
            $(this).parent().find('.username').focus();
        });

        $(this).find('.error').fadeOut(2000);
    }
});
