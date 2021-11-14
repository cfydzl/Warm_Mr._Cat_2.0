//自动登录
$(function () {
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function tip_show(text)
    {
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
    } else {
        var username="username";
        var password="password";
        var cookie = document.cookie;
        var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
        var username = cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
        var password = cookie.match(reg)[2];
        if (username=="visitor")
        {
            window.location.href = "indexshow.html";
        }else {
            $.ajax({
                type: "POST",
                url:"/untitled_war_exploded/user_information",
                data: {
                    opt: "state",
                    username: username,
                    password: password
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if(textobj.hasOwnProperty("msg")){
                        tip_show(textobj.msg);
                        return ;
                    }
                    if (textobj.num == "1") {
                        window.location.href = "indexshow.html";
                    }else if (textobj.num == "2")
                    {
                        window.location.href = "admin.html";
                    }
                },
                error:function (text)
                {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    }
//登录
    $(".button").click(function () {
        var username = $(".user input").val();
        var password = $(".password input").val();
        if (username.length==0||password.length==0)
        {
            tip_show("输入为空");
            return ;
        }
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
                if(textobj.hasOwnProperty("msg")){
                    tip_show(textobj.msg);
                    return ;
                }
                if (textobj.num == "1") {
                    var data = new Date().getTime();
                    var newD = new Date(data + 3 * 24 * 60 * 60 * 1000)
                    document.cookie = "username=" + username + "; expires=" + newD.toUTCString();
                    document.cookie = "password=" + password + "; expires=" + newD.toUTCString();
                    window.location.href = "indexshow.html";
                } else if (textobj.num == "2")
                {
                    var data = new Date().getTime();
                    var newD = new Date(data + 3 * 24 * 60 * 60 * 1000)
                    document.cookie = "username=" + username + "; expires=" + newD.toUTCString();
                    document.cookie = "password=" + password + "; expires=" + newD.toUTCString();
                    window.location.href = "admin.html";
                }
            },
            error:function (text)
            {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
//游客登陆
    $(".visitor").click(function () {
        var username="visitor";
        var password="visitor";
        var data = new Date().getTime();
        var newD = new Date(data + 3 * 24 * 60 * 60 * 1000)
        document.cookie = "username=" + username + "; expires=" + newD.toUTCString();
        document.cookie = "password=" + password + "; expires=" + newD.toUTCString();
        window.location.href = "indexshow.html";
    })
//切换页面
    $(".register").click(function () {
        $(".show").attr("style", "display:none");
        $(".register-show").removeAttr("style")
    })
    $(".return").click(function () {
        $(".register-show").attr("style", "display:none");
        $(".show").removeAttr("style")
    })
//注册点击事件
    $(".register-button").click(function () {
        var username = $(".register-show .user input").val();
        var password = $(".register-show .password input").val();
        var repassword = $(".repassword input").val();
        var reg = new RegExp(/[0-9a-zA-Z]|/);
        if (password.length == 0 || username.length == 0||repassword.length==0) {
            tip_show("输入为空");
        } else if (password.length < 8 || username.length < 8) {
            tip_show("长度>=8");
        } else if (!reg.test(password) || !reg.test(username)) {
            tip_show("非法字符");
        } else if (/.*[\u4e00-\u9fa5]+.*$/.test(username))
        {
            tip_show("允许字母数字");
        }else if(password != repassword)
        {
            tip_show("密码不同");
        }else
        {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/user_information",
                data: {
                    opt: "login",
                    username: username,
                    password: password,
                    repassword:repassword
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if(textobj.hasOwnProperty("msg")){
                        tip_show(textobj.msg);
                        return ;
                    }
                    if (textobj.num == "1") {
                        tip_show("注册成功");
                        var data = new Date().getTime();
                        var newD = new Date(data + 3 * 24 * 60 * 60 * 1000)
                        document.cookie = "username=" + username + "; expires=" + newD.toUTCString();
                        document.cookie = "password=" + password + "; expires=" + newD.toUTCString();
                        sleep(2000).then(() => {
                            window.location.href = "center.html";
                        })
                    }
                },
                error:function (text)
                {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
})