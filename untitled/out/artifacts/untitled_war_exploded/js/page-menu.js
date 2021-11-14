//自动登录
$(function () {
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function tip_show(text) {
        $(".show-tip").text(text);
        $(".show-tip").fadeIn(500);
        $(".show-tip").fadeOut(2500);
    }

    if (document.cookie.indexOf("username=") == -1) {
        $.ajax({
            type: "POST",
            url:"/untitled_war_exploded/user_information",
            data: {
                opt: "init"
            },
            async: false,
            success: function () {
                console.log("success");
            },
            error:function (text)
            {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
        window.location.href = "index.html";
    } else {
        var username = "username";
        var password = "password";
        var cookie = document.cookie;
        var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
        var username = cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
        var password = cookie.match(reg)[2];
        if (username != "visitor") {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/user_information",
                data: {
                    opt: "state",
                    username: username,
                    password: password
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        window.location.href = "index.html";
                        return;
                    }
                    if (textobj.num == "2") {
                        window.location.href = "admin.html";
                    }
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    }
//菜单生成
    var list=new Array();
    list[0]="%E6%8E%A8%E8%8D%90";
    list[1]="%E4%B8%BB%E9%A3%9F";
    list[2]="%E6%97%B6%E7%B4%A0";
    list[3]="%E6%97%B6%E8%8D%A4";
    list[4]="%E6%B5%93%E6%B1%A4";
    list[5]="%E5%B0%8F%E9%A3%9F";
    list[6]="%E9%85%92%E6%B0%B4";
    var species=new Array();
    species[0]="tuijian";
    species[1]="zhushi";
    species[2]="shisu";
    species[3]="shihun";
    species[4]="nongtang";
    species[5]="xiaoshi";
    species[6]="jiushui";
    for (var j=0;j<7;j++)
    {
        $.ajax({
            type: "GET",
            url: "/untitled_war_exploded/index_show",
            data: {
                opt: "menutext",
                name: list[j]
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    var join="<div class=\"menu-picture\" id=\""+textobj[i].menuid+"\">" +
                        "<img src=\""+textobj[i].picture+"\">" +
                        "<div class='name-price'>" +
                        "<div class=\"menu-picture-name\">"+decodeURIComponent(decodeURI(textobj[i].name))+"</div>" +
                        "<div class=\"menu-picture-price\">￥"+textobj[i].price+"元</div>" +
                        "</div>"+
                        "<div class=\"menu-num\">\n" +
                        "<div class=\"span-jia\"><span class=\"fa fa-plus-square-o\"></span></div>" +
                        "<p class="+textobj[i].menuid+">0</p>" +
                        "<div class=\"span-jian\"><span class=\"fa fa-minus-square-o\"></span></div>" +
                        "</div>" +
                        "</div>"
                    $("."+species[j]).append(join);
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }
//菜单数量获取
    $(".menu-information-title>li").click(function () {
        $(".menu-information-title>li").removeClass('title-color');
        $(this).addClass('title-color');
        var d=document.getElementsByName("sum-menu");
        for (var i=0;i<d.length;i++)
        {
            d[i].style.display="none";
        }
        d[$(this).index()].style.display="block";
        //alert($(this).page());
    })
//菜单点击事件
    //账单求和
    function calculate(price,opt) {
        $(".pay-num").text(parseInt($(".pay-num").text(),10)+(price*opt));
    }
    //添加购物车
    function fun(num,menuid,opt)
    {
        $.ajax({
            type: "GET",
            url: "/untitled_war_exploded/menu",
            data: {
                opt : "findnum",
                id: menuid
            },
            async: false,
            success:function (text) {
                var textobj =eval("("+text+")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                var join ="<div class="+menuid+">\n" +
                    "                    <div class=\"car-text-name\">"+decodeURIComponent(decodeURI(textobj[0].name))+"￥"+textobj[0].price+"</div>\n" +
                    "                    <div class=\"car-text-num\">\n" +
                    "                        <div class=\"p-jia\"><span class=\"fa fa-plus-square-o\"></span></div>\n" +
                    "                        <p class=\"pay-price select\">"+num+"</p>\n" +
                    "                        <div class=\"p-jian\"><span class=\"fa fa-minus-square-o\"></span></div>\n" +
                    "                    </div>\n" +
                    "                </div>"
                var ID=".car-text ."+menuid;
                $(ID).remove();
                if (num>0)
                {
                    $(".car-text").append(join);
                }
                calculate(textobj[0].price,opt);
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }
    $(".menu-information").delegate(".span-jia","click",function () {
        $(this).next().text(parseInt($(this).next().text(),10)+1);
        fun($(this).next().text(),$(this).next().attr("class"),1);
    })
    $(".menu-information").delegate(".span-jian","click",function () {
        if (parseInt($(this).prev().text(),10)>0)
        {
            $(this).prev().text(parseInt($(this).prev().text(),10)-1)
            fun($(this).prev().text(),$(this).prev().attr("class"),-1);
        }
    })
    //购物车点击-->返回去点击菜单
    $(".car-text").delegate(".p-jia","click",function () {
        var ID="#"+$(this).parent().parent().attr("class")+" .span-jia";
        $(ID).trigger("click");
    })
    $(".car-text").delegate(".p-jian","click",function () {
        var ID="#"+$(this).parent().parent().attr("class")+" .span-jian";
        $(ID).trigger("click");
    })
//结算
    $(".pay-button").click(function () {
        if (parseInt($(".pay-num").text(),10)<=0)
        {
            tip_show("购物车为空");
            return;
        }
        var cookie=document.cookie;
        var username="username";
        var password="password";
        var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
        username=cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
        password=cookie.match(reg)[2];
        if (username!="visitor")
        {
            $(".mask").removeAttr("style")
        }else {
            alert("请前往个人中心登录")
        }
    })
    $(".mask>div>div>p").click(function () {
        $(".mask").attr("style","display:none");
    })
    $(".book-submit").click(function () {
        if (parseInt($(".pay-button").prev().text(),10)>0)
        {
            var text="";
            var name=document.getElementsByClassName("car-text-name");
            var len=document.getElementsByClassName("car-text-name").length;
            var price=document.getElementsByClassName("pay-price");
            for (var i=0;i<len;i++)
            {
                text=text+name[i].innerHTML+"*"+price[i].innerHTML;
                if (i<len-1)
                {
                    text=text+",";
                }
            }
            var $typetext="";
            if ($('input[name="out"]:checked').attr("class")=="into")
            {
                $typetext="%E5%A0%82%E9%A3%9F";
            }else
            {
                $typetext="%E5%A4%96%E5%8D%96";
            }
            var cookie=document.cookie;
            var username="username";
            var password="password";
            var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
            username=cookie.match(reg)[2];
            reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
            password=cookie.match(reg)[2];
            $.ajax({
                type:"GET",
                url: "/untitled_war_exploded/menu",
                data: {
                    opt : "bookmenu",
                    menutext:encodeURI(text),
                    menunum:$(".pay-num").text(),
                    typetext:$typetext,
                    username:username,
                    password:password
                },
                async: false,
                success:function (text) {
                     var textobj =eval("("+text+")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    if(textobj.num==1)
                    {
                        tip_show("下单完成");
                        setTimeout("window.location.href=\"menu.html\"",2500)
                    }
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
})