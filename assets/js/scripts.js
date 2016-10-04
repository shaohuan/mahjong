
jQuery(document).ready(function() {
    $('.page-container form').submit(function(){

        // $.ajax({
        //     url: 'http://api.joind.in/v2.1/talks/10889',
        //     data: {
        //         format: 'json'
        //     },
        //     error: function() {
        //         $('#info').html('<p>An error has occurred</p>');
        //     },
        //     success: function(data) {
        //         localStorage.token = "loginIn";
        //         window.location.href='recharge.html';
        //     },
        //     type: 'POST'
        // });


        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        if(username == '') {
            $(this).find('.error').fadeIn('fast', function(){
                $(this).find('span').html("用户名不能为空");
                $(this).parent().find('.username').focus();
            });

            $(this).find('.error').fadeOut(2000);
            return false;
        }
        if(password == '') {

            $(this).find('.error').fadeIn('slow', function(){
                $(this).find('span').html("密码不能为空");
                $(this).parent().find('.password').focus();

            });
            $(this).find('.error').fadeOut('slow', function(){
            });
            return false;
        }
    });

});
