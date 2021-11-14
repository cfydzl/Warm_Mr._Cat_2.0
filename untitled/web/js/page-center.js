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
            url: "/untitled_war_exploded/user_information",
            data: {
                opt: "init"
            },
            async: false,
            success: function () {
                console.log("success");
            },
            error: function (text) {
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
                    $(".center-top-name").text(username)
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }else {
            $(".center-top-name").text("游客")
            $(".center-name>a").text("登录")
        }
    }
//退出
    $(".exit").click(function () {
        document.cookie = "username= ; expires=" +(new Date(0)).toUTCString();;
        document.cookie = "password= ; expires=" +(new Date(0)).toUTCString();;
        window.location.href = "index.html";
    })
//信息显示
    var cookie=document.cookie;
    var username="username";
    var password="password";
    var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
    username=cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
    password=cookie.match(reg)[2];
    if(username!="visitor") {
        $.ajax({
            type: "POST",
            url:"/untitled_war_exploded/center",
            data: {
                opt: "information",
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
                $(".username-information").text(textobj[0].username)
                $(".password-information").text(textobj[0].password)
                //联系方式
                if (textobj[0].phone.length != 0) {
                    $(".phone-information").text(decodeURIComponent(decodeURI(textobj[0].phone)))
                } else {
                    $(".phone-information").text("请完善信息")
                }
                //地址
                if (textobj[0].address.length != 0) {
                    $(".address-information").text(decodeURIComponent(decodeURI(textobj[0].address)))
                } else {
                    $(".address-information").text("请完善信息")
                }
                //用户名
                if (textobj[0].name.length != 0) {
                    $(".name-information").text(decodeURIComponent(decodeURI(textobj[0].name)))
                } else {
                    $(".name-information").text("请完善信息")
                }
            },
            error:function (text)
            {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }else {
        $(".username-information").text("游客（请先登录）")
        $(".password-information").text("游客（请先登录）")
        $(".phone-information").text("游客（请先登录）")
        $(".address-information").text("游客（请先登录）")
        $(".name-information").text("游客（请先登录）")
    }
//信息点击
    $(".personal-information>div>span").click(function () {
        var cookie=document.cookie;
        var username="username";
        var password="password";
        var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
        username=cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
        password=cookie.match(reg)[2];
        if(username!="visitor") {
            //密码修改点击
            if ($(this).attr("class") == "password-button select") {
                $(".change-show").removeAttr("style")
                $(".change-password").removeAttr("style")
            }
            //用户修改点击
            else if ($(this).attr("class") == "name-button select") {
                if ($(".name-information").text() == "请完善信息") {
                    $(".username-import>div").text("原来用户名: ")
                } else {
                    $(".username-import>div").text("原来用户名:  " + $(".name-information").text())
                }
                $(".change-show").removeAttr("style")
                $(".change-username").removeAttr("style")
            }
            //电话修改点击
            else if ($(this).attr("class") == "phone-button select") {
                if ($(".phone-information").text() == "请完善信息") {
                    $(".phone-import>div").text("原来联系方式: ")
                } else {
                    $(".phone-import>div").text("原来联系方式:  " + $(".phone-information").text())
                }
                $(".change-show").removeAttr("style")
                $(".change-phone").removeAttr("style")
            } else {
                if ($(".address-information").text() == "请完善信息") {
                    $(".address-import>div").text("原来外卖地址: ")
                } else {
                    $(".address-import>div").text("原来外卖地址:  " + $(".address-information").text())
                }
                $(".change-show").removeAttr("style")
                $(".change-address").removeAttr("style")
            }
        }else {
            alert("请先登录")
        }
    })
    $(".change-show>div>div>p").click(function () {
        $(".change-show").attr("style", "display:none");
        $(this).parent().parent().attr("style", "display:none");
    })
//信息修改
    function change(copt, ctext) {
        var cookie=document.cookie;
        var username="username";
        var password="password";
        var reg = new RegExp("(^|\\s)"+ username +"=([^;]+)(;|$)");
        username=cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)"+ password +"=([^;]+)(;|$)");
        password=cookie.match(reg)[2];
        $.ajax({
            type: "POST",
            url:"/untitled_war_exploded/center",
            data: {
                opt: "changeinformation",
                setifo:copt,
                text: encodeURI(ctext),
                username:username,
                password:password
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if(textobj.hasOwnProperty("msg")){
                    tip_show(textobj.msg);
                    return ;
                }
                if (textobj.ctext != "0") {
                    tip_show("修改成功");
                    setTimeout("window.location.href=\"center.html\"",2500)
                }
            },
            error:function (text)
            {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }

    $(".change-show>div>span").click(function () {
        var changeopt = "";
        var changetext = "";
        //密码修改提交
        if ($(this).attr("class") == "password-submit select") {
            if ($(".password-import>input").val().length != 0 && $(".password-import>input").val() == $(".password-reimport>input").val()) {
                changeopt = "PASSWORD";
                changetext = $(".password-import>input").val();
                change(changeopt, changetext);
            } else {
                tip_show("密码不同");
            }
        }
        //用户名修改提交
        else if ($(this).attr("class") == "username-submit select") {
            if ($(".username-reimport>input").val().length != 0) {
                changeopt = "NAME";
                changetext = $(".username-reimport>input").val();
                change(changeopt, changetext);
            } else {
                tip_show("输入为空");
            }
        }
        //电话修改
        else if ($(this).attr("class") == "phone-submit select") {
            if ($(".phone-reimport>input").val().length != 0) {
                changeopt = "PHONE";
                changetext = $(".phone-reimport>input").val();
                change(changeopt, changetext);
            } else {
                tip_show("输入为空");
            }
        }
        //外卖地址
        else {
            if ($(".address-reimport>input").val().length != 0) {
                changeopt = "ADDRESS";
                changetext = $(".address-reimport>input").val();
                change(changeopt, changetext);
            } else {
                tip_show("输入为空");
            }
        }
    })
//左边信息框
    $(".close-left>div").click(function () {
        $(".personal-information").attr("style", "display:none")
        $(".restaurant-information").attr("style", "display:none")
        $(".menu-information").attr("style", "display:none")
        $(".out-information").attr("style", "display:none")
        $(".contact-information").attr("style", "display:none")
        if ($(this).attr("class") == "close-personal-information select") {
            $(".personal-information").removeAttr("style");
        } else if ($(this).attr("class") == "close-restaurant-information select") {
            $(".restaurant-information").removeAttr("style");
        } else if ($(this).attr("class") == "close-menu-information select") {
            $(".menu-information").removeAttr("style");
        } else if ($(this).attr("class") == "close-out-information select") {
            $(".out-information").removeAttr("style");
        } else if ($(this).attr("class") == "close-contact-information select") {
            $(".contact-information").removeAttr("style");
        }
    })
})