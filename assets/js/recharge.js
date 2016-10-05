/**
 * Created by huan.shao on 10/4/16.
 */
jQuery(document).ready(function() {
    $('.tabgroup > div').hide();
    $('.tabgroup > div:first-of-type').show();
    $('.tabs a').click(function(e){
        e.preventDefault();
        var $this = $(this),
            tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).children('div').hide();
        $(target).show();

    })


    $("#table_recharge tr").click(function(){
        //获取ID值
        var value=$(this).closest('tr').children('td:first').text();

        var selected = $(this).hasClass("highlight");
        $("#table_recharge tr").removeClass("highlight");
        if(!selected)
            $(this).addClass("highlight");
    });
    
    
    $("#tab2 div.record_query_btn").click(function () {
        alert('请求AJAX');
    });



});



function fetchData(url,type,params,onSuccess,onError){
    $.ajax({
        url: url,
        contentType: 'application/json; charset=utf-8',
        data:$.extend(params,{token:localStorage['token']}),
        error: function(response) {
            if (response.status != 200){
                alert("请求出错，错误代码："+response.status)
                return;
            }
            if(!!response['error_code'] && response['error_code']==10041){
                alert("Token过期，请重新登陆!")
                localStorage.removeItem('token');
                window.location.href='index.html';
            }

        },

        success: onSuccess,
        type: type
    });
}