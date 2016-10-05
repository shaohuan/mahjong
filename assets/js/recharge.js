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



    $("#table_users").delegate("tr", "click", function(){
        //获取ID值
        var value=$(this).closest('tr').children('td:first').text();

        var selected = $(this).hasClass("highlight");
        $("#table_users tr").removeClass("highlight");
        if(!selected){
            $(this).addClass("highlight");
        }
    });
    
    
    $("#tab2 div.record_query_btn").click(function () {
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


        //渲染table
        loadData2UserTable("table_users",res.user_list)
    });

});


function include(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
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