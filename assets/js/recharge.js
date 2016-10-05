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



    //选择用户的ID

    $("#table_users").delegate("tr", "click", function(){
        // var value = $(this).closest('tr').children('td:first').text();
        var selected = $(this).hasClass("highlight");
        $("#table_users tr").removeClass("highlight");
        if(!selected){
            $(this).addClass("highlight");
        }
    });


    function showRechargeErr(msg){
        $('#recharge-error').html(msg).css('visibility','visible');
    }
    
    function hideRechargeErr() {
        $('#recharge-error').css('visibility','hidden');
        
    }
    
    //确认充值
    $('#confirm_recharge').click(function () {
        var beans = $('#beans').val();
        var selectedRow = $("#table_users tr.highlight");
        if (selectedRow.length == 0){
            showRechargeErr("请先选择一个用户");
            return;
        }

        if (isNaN(beans) || beans.trim().length==0){
            showRechargeErr("柑桔必须为数字");
            return;
        }

        var user_id = selectedRow.children('td:first').text();
        fetchData('/v0/order/create','POST',{'user_id':user_id,'beans':beans},function (res) {
            hideRechargeErr();
        },function (msg) {
            showRechargeErr(msg);

        });
    });
    $('#search_user_btn').on('click',function () {
        //查询用户
        var res = {
            "error_code":0,
            "msg":"success",
            "user_list":[
                {
                    "user_id":123456,
                    "user_name":"张三",
                    "headimgurl":"http://xxxx",
                    "sex":1,
                    "doudou":10,
                    "total_rounds":10,
                    "win_rounds":3,
                    "total_score":0
                },
                {
                    "user_id":123456,
                    "user_name":"张三",
                    "headimgurl":"http://xxxx",
                    "sex":1,
                    "doudou":10,
                    "total_rounds":10,
                    "win_rounds":3,
                    "total_score":0
                },
                {
                    "user_id":123456,
                    "user_name":"张三",
                    "headimgurl":"http://xxxx",
                    "sex":1,
                    "doudou":10,
                    "total_rounds":10,
                    "win_rounds":3,
                    "total_score":0
                }
            ]
        };

        loadData2UserTable("table_users",res.user_list);
        $("#recharge_amount").css('visibility','visible');

    })
    
    
    $("#tab2 div.record_query_btn").click(function () {
        var res =         {
            "error_code":0,
            "msg":"success",
            "order_list":[
                {
                    "orderid":"wx0001",
                    "uid":222,
                    "beans":0,
                    "fee":0,
                    "status":0,
                    "descrption":"xxxx",
                    "creation_time":132
                },
                {
                    "orderid":"wx0001",
                    "uid":222,
                    "beans":0,
                    "fee":0,
                    "status":0,
                    "descrption":"xxxx",
                    "creation_time":132
                },
                {
                    "orderid":"wx0001",
                    "uid":222,
                    "beans":0,
                    "fee":0,
                    "status":0,
                    "descrption":"xxxx",
                    "creation_time":132
                },
                {
                    "orderid":"wx0001",
                    "uid":222,
                    "beans":0,
                    "fee":0,
                    "status":0,
                    "descrption":"xxxx",
                    "creation_time":132
                }
            ]
        };



        //渲染table
        loadData2HistoryTable("order_list",res.order_list);


    });

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


function fetchData(url,type,params,onSuccess,onError){
    $.ajax({
        url: url,
        contentType: 'application/json; charset=utf-8',
        data:$.extend(params,{token:localStorage.token}),
        error: function(response) {
            if (response.status != 200){
                $('#recharge-error').html("请求出错，错误代码："+response.status).css('visibility','visible');
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