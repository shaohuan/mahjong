/**
 * Created by huan.shao on 10/4/16.
 */
jQuery(document).ready(function() {
    function  updateUserProfile(){
        $('#profile-img'). attr('src',localStorage.getItem("headimgurl"));
        $('#user_name').html(localStorage.getItem("user_name"));
        $('#role_name').html(localStorage.getItem("role_name")=="admin"?"超级用户":"代理用户");
        $('#doudou').html(localStorage.getItem("doudou"));
    };
    updateUserProfile();

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

    });


    if(!!localStorage.role_name && localStorage.role_name=="agent"){
        $('#query_type').css('visibility','visible');
    }else{
        $('#query_type').css('visibility','hidden');
    };



    //选择用户的ID
    $("#table_users").delegate("tr", "click", function(){
        // var value = $(this).closest('tr').children('td:first').text();
        var selected = $(this).hasClass("highlight");
        $("#table_users tr").removeClass("highlight");
        if(!selected){
            $(this).addClass("highlight");
        }
    });


    function showErr(msg,id){
        $('#'+id).html(msg).css('visibility','visible');
    }

    function hideErr(id) {
        $('#'+id).css('visibility','hidden');
    }

    //确认充值
    $('#confirm_recharge').click(function () {
        var beans = $('#beans').val();
        var selectedRow = $("#table_users tr.highlight");
        if (selectedRow.length == 0){
            showErr("请先选择一个用户",'recharge-error');
            return;
        }

        if (isNaN(beans) || beans.trim().length==0){
            showErr("柑桔必须为数字","recharge-error");
            return;
        }

        var user_id = selectedRow.children('td:first').text();
        fetchData('/v0/order/create','POST',{'user_id':user_id,'beans':parseInt(beans)},function (res) {
            hideErr();
        },function (msg) {
            showErr(msg,'recharge-error');
        },'recharge-error');
    });
    $('#search_user_btn').on('click',function () {
        //查询用户

        var role_name = localStorage.getItem('role_name');
        var params = {},searchKey = $('#user_key').val();
        if (searchKey.trim().length == 0){
            showErr("查询关键字不能为空",'recharge-error')
            return;
        }

        if (role_name == 'agent'){
            var userType = $("#query_type").val();
            params[userType] = searchKey;
        };


        fetchData(' /v0/account/query_list','GET',params,function (res) {
            loadData2UserTable("table_users",res.user_list);
            $("#recharge_amount").css('visibility','visible');
            hideErr();

        },function (msg) {
            showErr(msg,'recharge-error');
        },'recharge-error');
    });


    //查询充值历史记录
    $("#tab2 div.record_query_btn").click(function () {
        fetchData(' /v0/order/query','GET',{},function (res) {
            //渲染table
            loadData2HistoryTable("order_list",res.order_list);
            $("#recharge_amount").css('visibility','visible');
            hideErr();
        },function (msg) {
            showErr(msg,'recharge-error');
        },'history-error');

    });

    //检查数组中是否包含某个元素
    function include(arr, obj) {
        for(var i=0; i<arr.length; i++) {
            if (arr[i] == obj) return true;
        }
    }

    function loadData2HistoryTable(tableId,data) {

        var dict = {"orderid":"充值ID","uid":"用户ID","nick_name":"昵称","creation_time":"时间","fee":"充值数","beans":"余额","descrption":"描述",
            "status":"订单状态"};
        var r = new Array(), j = -1, desc="";
        for (var i=0, size=data.length; i<size; i++){
            r[++j] ='<tr>';
            $.each(data[i], function(key, value){
                desc = !!dict[key]?dict[key]:"";
                r[++j] ='<td data-table-header="' +desc+ '">';
                r[++j] = value + '</td>';
            });
            r[++j] = '</tr>';
        }
        $('#' +tableId + " tbody").html(r.join(''));
    }


    function loadData2UserTable(tableId,data) {
        var displayCols = ['user_id','user_name','headimgurl'];
        var r = new Array(), j = -1;
        for (var i=0, size=data.length; i<size; i++){
            r[++j] ='<tr>';
            $.each(data[i], function(key, value){
                if (key == "headimgurl"){
                    r[++j] ='<td data-table-header="' +key+ '">';
                    r[++j] = '<img alt="头像" src="' + value + ' ></td>';
                    return true;
                }

                if (include(displayCols,key)){
                    r[++j] ='<td data-table-header="' +key+ '">';
                    r[++j] = value + '</td>';
                }
            });
            r[++j] ='<td data-table-header="...">...</td>';
            r[++j] = '</tr>';
        }
        $('#' +tableId + " tbody").html(r.join(''));
    }


    function fetchData(url,type,params,onSuccess,onError,error_src){
        $.ajax({
            url: url,
            contentType: 'application/json; charset=utf-8',
            data:$.extend(params,{token:localStorage.token}),
            error: function(response) {
                onError();
                if (response.status != 200){
                    $('#'+error_src).html("请求出错，错误代码："+response.status).css('visibility','visible');
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

});

