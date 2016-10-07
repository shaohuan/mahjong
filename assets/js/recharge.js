/**
 * Created by huan.shao on 10/4/16.
 */
jQuery(document).ready(function() {
    function  updateUserProfile(){
        var headImgUrl = localStorage.getItem("headimgurl");
        if (!!headImgUrl && (headImgUrl.match(/\.(jpeg|jpg|gif|png)$/) != null)){
            $('#profile-img'). attr('src',headimgurl);
        };

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


    if("agent" == localStorage.role_name){
        $('#query_type').append($('<option>', {
            value: 'nick_name',
            text: '微信昵称'
        }));
    }else{
        $('#query_type').append($('<option>', {
            value: 'user_name',
            text: '代理账号'
        }));
    };



    //选择用户的ID
    $("#table_users tbody").delegate("tr", "click", function(){
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
            showErr("柑子必须为数字","recharge-error");
            return;
        }

        var user_id = selectedRow.children('td:first').text();
        fetchData('/v0/order/create','POST',{'user_id':user_id,'beans':parseInt(beans)},function (res) {
            $('#beans').val("");
            showErr("充值成功,剩余柑子："+res.beans,'recharge-error');
        },function (msg) {
            // showErr(msg,'recharge-error');
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

        var userType = $("#query_type").val();
        params[userType] = searchKey;


        fetchData(' /v0/account/query_list','GET',params,function (res) {
            if (res.user_list.length == 0){
                showErr('没有找到匹配用户','recharge-error');
            }else{
                loadData2UserTable("table_users",res.user_list);
                $("#recharge_amount").css('visibility','visible');
                hideErr('recharge-error');
            }

        },function (msg) {
        },'recharge-error');
    });


    //查询充值历史记录
    $("#tab2 div.record_query_btn").click(function () {
        fetchData(' /v0/order/query','GET',{"status":1},function (res) {
            //渲染table
            if (res.order_list.length == 0){
                showErr('查询结果为空','history-error');
            }else{
                loadData2HistoryTable("order_list",res.order_list);
                $("#recharge_amount").css('visibility','visible');
                hideErr('history-error');
            }

        },function (msg) {
            // showErr(msg,'history-error');


        },'history-error');

    });

    //检查数组中是否包含某个元素
    function include(arr, obj) {
        for(var i=0; i<arr.length; i++) {
            if (arr[i] == obj) return true;
        }
    }

    function loadData2HistoryTable(tableId,data) {

        var dict = {"orderid":"充值ID","op_userid":"操作人ID","user_id":"用户ID","nick_name":"昵称","left_beans":"操作人剩余柑子","creation_time":"时间","fee":"充值数","costs":"花费金额","beans":"充值柑子","descrption":"描述",
            "status":"订单状态"};
        var r = new Array(), j = -1, desc="";

        //动态构建table header
        var header = data[0];
        r[++j] = '<thead><tr>';
        for (var en_title in header){
            desc = !!dict[en_title]?dict[en_title]:en_title;
            r[++j] = '<th scope="col">'+desc+'</th>';
        }
        r[++j] = '</tr></thead>';


        //动态构建table body
        r[++j] = '<tbody>';
        for (i=0, size=data.length; i<size; i++){
            r[++j] ='<tr>';
            $.each(data[i], function(key, value){
                desc = !!dict[key]?dict[key]:"";
                r[++j] ='<td data-table-header="' +desc+ '">';
                r[++j] = value + '</td>';
            });
            r[++j] = '</tr>';
        }
        r[++j] = '</tbody>';

        $('#' +tableId).html(r.join(''));
    }


    function loadData2UserTable(tableId,data) {
        var dict = { "user_id":"用户ID",
                    "total_score":"用户分数",
                    "doudou":"柑子",
                    "sex":"性别",
                    "win_rounds":"赢回合数",
                    "total_rounds":"总回合数",
                    "headimgurl":"头像",
                    "user_name":"用户名"
                 };
        var r = new Array(), j = -1,desc="", gender="", portrait;


        //动态构建table header
        var header = data[0];
        r[++j] = '<thead><tr>';
        for (var en_title in header){
            desc = !!dict[en_title]?dict[en_title]:en_title;
            r[++j] = '<th scope="col">'+desc+'</th>';
        }
        r[++j] = '</tr></thead>';

        //动态构建tbody
        r[++j] = '<tbody>';
        for (var i=0, size=data.length; i<size; i++){
            r[++j] ='<tr>';
            $.each(data[i], function(key, value){
                desc = !!dict[key]?dict[key]:"";

                if (key == "headimgurl"){
                    if(value.match(/\.(jpeg|jpg|gif|png)$/) != null){
                        portrait = value;
                    }else{
                        portrait = "./assets/img/thumbnail.png";
                    }
                    r[++j] ='<td data-table-header="' +desc+ '">';
                    r[++j] = '<img alt="头像" class="tb-portrait" src="' + portrait + '" ></td>';
                    return true;
                }else{
                    if ('sex' == key){
                        value = (value == 1)?"男":"女";
                    }
                    r[++j] ='<td data-table-header="' +desc+ '">';
                    r[++j] = value + '</td>';
                }
            });
            r[++j] = '</tr>';
        }
        r[++j] = '</tbody>';

        $('#' +tableId).html(r.join(''));
    }


    function fetchData(url,type,params,onSuccess,onError,error_src){
        var contentType;
        if(type.toLowerCase() == 'get'){
            contentType = 'application/json; charset=utf-8';
        }else{
            contentType = 'application/x-www-form-urlencoded';
        }
        $.ajax({
            url: url,
            contentType: contentType,
            data:$.extend(params,{token:localStorage.token}),
            error: function(response) {
                if (response.status != 200){
                    showErr("请求出错，错误代码："+response.status,error_src);
                    onError(response);
                    return;
                };

            },

            success: function (res) {
                if(!!res['error_code'] && res['error_code']==10041){
                    alert("Token过期，请重新登陆!")
                    localStorage.removeItem('token');
                    window.location.href='index.html';
                }else{
                    switch (res.error_code){
                        case 0:
                            hideErr(error_src);
                            onSuccess(res);
                            break;
                        case 1:
                            showErr("未知的错误",error_src)
                            break;
                        case 2:
                            showErr("手机格式非法",error_src)
                            break;
                        case 3:
                            showErr("参数为空",error_src)
                            break;
                        case 4:
                            showErr("没有授权",error_src)
                            break;
                        case 10001:
                            showErr("错误码验证失败",error_src)
                            break;
                        case 10002:
                            showErr("昵称已经存在",error_src)
                            break;
                        case 10003:
                            showErr("设置密码太短",error_src)
                            break;
                        case 10004:
                            showErr("手机号码已经存在",error_src)
                            break;
                        case 10021:
                            showErr("密码错误",error_src)
                            break;
                        case 10041:
                            showErr("token非法",error_src)
                            break;
                        case 10042:
                            showErr("验证码已发送",error_src)
                            break;
                        case 10043:
                            showErr("验证码超时",error_src)
                            break;
                        case 10044:
                            showErr("验证码发送失败",error_src)
                            break;
                        case 10045:
                            showErr("柑子不够",error_src)
                            break;
                        default:
                            showErr("请求出错，错误码:"+res.error_code,error_src)
                    }
                }

            },
            type: type
        });
    }

});

