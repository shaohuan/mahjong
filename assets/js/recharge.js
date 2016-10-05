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
});