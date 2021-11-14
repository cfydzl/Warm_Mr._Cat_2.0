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
//订桌
    $(".book-desk").click(function () {
        var cookie=document.cookie;
        var username="username";
        var password="password";
        var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
        username=cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
        password=cookie.match(reg)[2];
        if (username!="visitor")
        {
            $(".book-show").removeAttr("style")
        }else {
            alert("请前往个人中心登录")
        }

    })
    $(".book-show>div>div>p").click(function () {
        $(".book-show").attr("style","display:none");
    })
    $(".book-pay").click(function () {
        $(".mask").removeAttr("style")
    })
    $(".mask>div>div>p").click(function () {
        $(".mask").attr("style","display:none");
    })
    $(".book-submit").click(function () {
        var desktext=$('input[name="desk"]:checked').attr("class");
        if (desktext=='two')
        {
            desktext=encodeURI("两人桌");
        }else if (desktext=='four')
        {
            desktext=encodeURI("四人桌");
        }else if (desktext=='six')
        {
            desktext=encodeURI("六人桌");
        }else if (desktext=='eight')
        {
            desktext=encodeURI("大包厢");
        }
        var timetext=$('input[name="time"]:checked').attr("class");
        if (timetext=='NINE')
        {
            timetext="09:00-11:00"
        }else if (timetext=='ELEVEN')
        {
            timetext="11:00-13:00"
        }else if (timetext=='THIRTEEN')
        {
            timetext="13:00-15:00"
        }else if (timetext=='FIFTEEN')
        {
            timetext="15:00-17:00"
        }else if (timetext=='SEVENTEEN')
        {
            timetext="17:00-19:00"
        }else if (timetext=='NINETEEN')
        {
            timetext="19:00-21:00"
        }
        var cookie=document.cookie;
        var username="username";
        var password="password";
        var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
        username=cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
        password=cookie.match(reg)[2];
        $.ajax({
            type: "GET",
            url: "/untitled_war_exploded/restaurant",
            data: {
                opt : "bookdesk",
                desk:$('input[name="desk"]:checked').attr("class"),
                desktext:desktext,
                time:$('input[name="time"]:checked').attr("class"),
                timetext:timetext,
                username: username,
                password: password
            },
            async: false,
            success:function(text) {
                var textobj =eval("("+text+")");
                if (textobj.hasOwnProperty("msg")) {
                    $(".mask").attr("style","display:none");
                    tip_show(textobj.msg);
                    return;
                }
                if(textobj.num==1)
                {
                    tip_show("订桌完成");
                    setTimeout("window.location.href=\"restaurant.html\"",2500)

                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
})