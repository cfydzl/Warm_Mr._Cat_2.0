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
//评论区

    $.ajax({
        type: "GET",
        url: "/untitled_war_exploded/index_show",
        data: {
            opt: "commenttext",
        },
        async: false,
        success: function (text) {
            var textobj = eval("(" + text + ")");
            if (textobj[0].hasOwnProperty("msg")) {
                tip_show(textobj.msg);
                return;
            }
            for (var i in textobj) {

                var join = "<div class=\"bottom-line\">" +
                    "<img class=\"bottom-line-picture\" src=\"../img/touxiang.png\">" +
                    "<div class=\"comment\">" +
                    "<div class=\"comment-time\">" + textobj[i].time + "</div>" +
                    "<div class=\"comment-name\">" + decodeURIComponent(decodeURI(textobj[i].name)) + "</div>" +
                    "<img class=\"comment-name-picture\" src=\"../img/3.png\"/>" +
                    "<div class=\"comment-text\">" + decodeURIComponent(decodeURI(textobj[i].text)) + "</div>" +
                    "<div class=\"comment-zan\">" +
                    "<div style=\"display: none\">" + textobj[i].userid + "</div>" +
                    "<div class=\"fa fa-thumbs-o-up\"> &nbsp</div>" +
                    "<span class=\"select\">" + textobj[i].ding + "</span>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                $(".bottom").prepend(join);
            }
        },
        error: function (text) {
            var textobj = eval("(" + text + ")");
            tip_show(textobj.msg);
        }
    })
//推荐菜单

    $.ajax({
        type: "GET",
        url: "/untitled_war_exploded/index_show",
        data: {
            opt: "menutext",
            name: "%E6%8E%A8%E8%8D%90"
        },
        async: false,
        success: function (text) {
            var textobj = eval("(" + text + ")");
            if (textobj.hasOwnProperty("msg")) {
                tip_show(textobj.msg);
                return;
            }
            for (var i in textobj) {
                var join = "<div class=\"menu-picture\">" +
                    "<img src=\"" + decodeURIComponent(decodeURI(textobj[i].picture)) + "\" width=\"192px\" height=\"108px\"/>" +
                    "<div class=\"menu-infor\">" +
                    "<div>" + decodeURIComponent(decodeURI(textobj[i].name)) + "(五星推荐)</div>" +
                    "<img src=\"../img/3.png\" width=\"80px\" height=\"14px\"/>" +
                    "<div class=\"menu-peace\">" +
                    "￥" + decodeURIComponent(decodeURI(textobj[i].price)) + "元" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                $(".menu-text").append(join);
            }
        },
        error: function (text) {
            var textobj = eval("(" + text + ")");
            tip_show(textobj.msg);
        }
    })
//抢购支付
    $(".buy-sale").click(function () {
        var username = "username";
        var password = "password";
        var cookie = document.cookie;
        var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
        var username = cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
        var password = cookie.match(reg)[2];
        if (username != "visitor") {
            $(".mask").removeAttr("style")
        } else {
            alert("请先前往个人中心登录")
        }
    })
    $(".mask>div>div>p").click(function () {
        $(".mask").attr("style", "display:none");
    })
    $(".book-submit").click(function () {
        alert("支付完成");
        window.location.href = "indexshow.html";
    })
//点赞
    $(".bottom").delegate(".comment-zan>div", "click", function () {
        var now = $(this).next();
        $.ajax({
            type: "GET",
            url: "/untitled_war_exploded/index_show",
            data: {
                opt: "changezan",
                optnum: $(this).prev().text()
            },
            async: false,
            success: function () {
                now.text(parseInt(now.text(), 10) + 1)
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }

        })
    })
})