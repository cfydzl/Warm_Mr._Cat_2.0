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
        document.cookie = "username= ; expires=" + (new Date(0)).toUTCString();
        ;
        document.cookie = "password= ; expires=" + (new Date(0)).toUTCString();
        ;
        window.location.href = "index.html";
    })
//定单显示
    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];
    $.ajax({
        type: "POST",
        url: "/untitled_war_exploded/order",
        data: {
            opt: "findrestaurant",
            username: username,
        },
        async: false,
        success: function (text) {
            var textobj = eval("(" + text + ")");
            if (textobj.hasOwnProperty("msg")) {
                tip_show(textobj.msg);
                return;
            }
            for (var i in textobj) {
                var join = ""
                if (decodeURIComponent(decodeURI(textobj[i].type)) == '(取消订单)外卖' ||
                    decodeURIComponent(decodeURI(textobj[i].type)) == '(取消订单)堂食' ||
                    decodeURIComponent(decodeURI(textobj[i].type)) == '(完成订单)堂食' ||
                    decodeURIComponent(decodeURI(textobj[i].type)) == '(完成订单)外卖') {
                    join = "<div class=\"details\">\n" +
                        "            <img src=\"../img/1.png\">\n" +
                        "            <div class=\"details-title\">暖喵先生</div>\n" +
                        "            <span class=\"details-button select\">已结单<p style=\"display: none\">" + textobj[i].id + "</p></span>\n" +
                        "            <div class=\"details-sum\">总价￥:" + textobj[i].sum + "</div>\n" +
                        "            <div class=\"details-type\">订单类型:&nbsp&nbsp&nbsp" + decodeURIComponent(decodeURI(textobj[i].type)) + "</div>\n" +
                        "            <div class=\"details-id select\">订单编号：" + textobj[i].menuid + "&nbsp&nbsp&nbsp(点击查看详情)<p style=\"display: none\">" + textobj[i].id + "</p></div>\n" +
                        "        </div>"
                } else {
                    join = "<div class=\"details\">\n" +
                        "            <img src=\"../img/1.png\">\n" +
                        "            <div class=\"details-title\">暖喵先生</div>\n" +
                        "            <span class=\"details-button select\">退订<p style=\"display: none\">" + textobj[i].id + "</p></span>\n" +
                        "            <div class=\"details-sum\">总价￥:" + textobj[i].sum + "</div>\n" +
                        "            <div class=\"details-type\">订单类型:&nbsp&nbsp&nbsp" + decodeURIComponent(decodeURI(textobj[i].type)) + "</div>\n" +
                        "            <div class=\"details-id select\">订单编号：" + textobj[i].menuid + "&nbsp&nbsp&nbsp(点击查看详情)<p style=\"display: none\">" + textobj[i].id + "</p></div>\n" +
                        "        </div>"
                }
                $(".order-information-text").append(join)
            }
        },
        error: function (text) {
            var textobj = eval("(" + text + ")");
            tip_show(textobj.msg);
        }
    })

//订桌
    $(".close-desk-information").click(function () {
        $(".desk-information-text").html(null)
        var username = "username";
        var password = "password";
        var cookie = document.cookie;
        var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
        var username = cookie.match(reg)[2];
        reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
        var password = cookie.match(reg)[2];
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/order",
            data: {
                opt: "finddesk",
                username: username,
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    var join = "";
                    if ((decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(取消订桌)") != -1) || (decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(完成订桌)") != -1)) {
                        join = "<div class=\"details\">\n" +
                            "            <img src=\"../img/1.png\">\n" +
                            "            <div class=\"details-title\">暖喵先生</div>\n" +
                            "            <span class=\"details-button select\">已结单<p style=\"display: none\">" + textobj[i].id + "</p></span>\n" +
                            "            <div class=\"details-sum\"></div>\n" +
                            "            <div class=\"details-type\">订桌类型:&nbsp&nbsp&nbsp" + decodeURIComponent(decodeURI(textobj[i].type)) + "&nbsp&nbsp&nbsp订桌时间:&nbsp&nbsp&nbsp" + textobj[i].time + "</div>\n" +
                            "            <div class=\"details-id select\">订桌编号：" + textobj[i].book_id + "<p style=\"display: none\">" + textobj[i].id + "</p></div>\n" +
                            "        </div>"
                    } else {
                        join = "<div class=\"details\">\n" +
                            "            <img src=\"../img/1.png\">\n" +
                            "            <div class=\"details-title\">暖喵先生</div>\n" +
                            "            <span class=\"details-button select\">退订<p style=\"display: none\">" + textobj[i].id + "</p></span>\n" +
                            "            <div class=\"details-sum\"></div>\n" +
                            "            <div class=\"details-type\">订桌类型:&nbsp&nbsp&nbsp" + decodeURIComponent(decodeURI(textobj[i].type)) + "&nbsp&nbsp&nbsp订桌时间:&nbsp&nbsp&nbsp" + textobj[i].time + "</div>\n" +
                            "            <div class=\"details-id select\">订桌编号：" + textobj[i].book_id + "<p style=\"display: none\">" + textobj[i].id + "</p></div>\n" +
                            "        </div>"
                    }
                    $(".desk-information-text").append(join)
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];

    function fun(ptype, ptime) {
        if (ptype == encodeURI("(取消订桌)两人桌")) {
            ptype = 'two';
        } else if (ptype == encodeURI("(取消订桌)四人桌")) {
            ptype = 'four';
        } else if (ptype == encodeURI("(取消订桌)六人桌")) {
            ptype = 'six';
        } else if (ptype == encodeURI("(取消订桌)大包厢")) {
            ptype = 'eight';
        }
        if (ptime == "09:00-11:00") {
            ptime = 'NINE'
        } else if (ptime == "11:00-13:00") {
            ptime = 'ELEVEN'
        } else if (ptime == "13:00-15:00") {
            ptime = 'THIRTEEN'
        } else if (ptime == "15:00-17:00") {
            ptime = 'FIFTEEN'
        } else if (ptime == "17:00-19:00") {
            ptime = 'SEVENTEEN'
        } else if (ptime == "19:00-21:00") {
            ptime = 'NINETEEN'
        }
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/order",
            data: {
                opt: "change",
                type: ptype,
                time: ptime,
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                if (textobj.cal == "1") {
                    tip_show("取消成功");
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }

    $(".right-desk-information").delegate(".details-button", "click", function () {
        var id = $(this).children().text();
        var now = $(this);
        if (!($(this).text().indexOf("已") != -1)) {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/order",
                data: {
                    opt: "canceldesk",
                    id: id,
                    username: username,
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    if (textobj.cal == "1") {
                        fun(textobj.type, textobj.time)
                        $(".close-desk-information").click()
                    }
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
//退单事件
    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];
    $(".right-order-information").delegate(".details-button", "click", function () {
        var caltext = $(this).children().text()
        if (!($(this).text().indexOf("已") != -1)) {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/order",
                data: {
                    opt: "cancel",
                    cal: caltext,
                    username: username,
                    password: password
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    if (textobj.cal == "1") {
                        tip_show("取消成功");
                        window.location.href = "order.html";
                    }
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
//查看订单
    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];
    $(".mask>div>div>p").click(function () {
        $(".mask").attr("style", "display:none");
    })
    $(".right-order-information").delegate(".details-id", "click", function () {
        var optnum = $(this).children().text();
        $(".mask").removeAttr("style")
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/order",
            data: {
                opt: "findtext",
                optnum: optnum,
                username: username,
                password: password
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                console.log(textobj);
                textobj[0].text = decodeURIComponent(decodeURI(textobj[0].text));
                var menutext = textobj[0].text.split(",")
                $(".book-title>span").text("￥" + textobj[0].sum+ "元")
                for (var i = 0; i < menutext.length; i++) {
                    var join = "<div>" + menutext[i] + "</div>"
                    $(".mask-text").append(join)
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
//切换
    $(".close-left>div").click(function () {
        $(".right-order-information").attr("style", "display:none");
        $(".right-desk-information").attr("style", "display:none");
        $(".right-comment-information").attr("style", "display:none");
        if ($(this).text() == "菜品订单") {
            $(".right-order-information").removeAttr("style")
        } else if ($(this).text() == "桌位订单") {
            $(".right-desk-information").removeAttr("style")
        } else {
            $(".right-comment-information").removeAttr("style")
        }
    })
//评论区加载
    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];
    $.ajax({
        type: "POST",
        url: "/untitled_war_exploded/order",
        data: {
            opt: "findcomment",
            username: username
        },
        async: false,
        success: function (text) {
            var textobj = eval("(" + text + ")");
            if (textobj.hasOwnProperty("msg")) {
                tip_show(textobj.msg);
                return;
            }
            for (var i in textobj)
            {
                var join = "<div class=\"info-list\" id=\"" + textobj[i].userid + "\">\n" +
                    "            <div class=\"list-text\">" + decodeURIComponent(decodeURI(textobj[i].text)) + "</div>\n" +
                    "            <div class=\"list-time\">" + textobj[i].time + "</div>\n" +
                    "            <span class=\"fa fa-thumbs-o-up\"> " + textobj[i].ding + "</span>\n" +
                    "            <span class=\"fa fa-trash-o\"><p style=\"display: none\">" + textobj[i].userid + "</p></span>\n" +
                    "        </div>"
                $(".comment-information-list").prepend(join)
            }
        },
        error: function (text) {
            var textobj = eval("(" + text + ")");
            tip_show(textobj.msg);
        }
    })
//评论区发表
    var username = "username";
    var password = "password";
    var cookie = document.cookie;
    var reg = new RegExp("(^|\\s)" + username + "=([^;]+)(;|$)");
    var username = cookie.match(reg)[2];
    reg = new RegExp("(^|\\s)" + password + "=([^;]+)(;|$)");
    var password = cookie.match(reg)[2];
    $(".comment-information-submit").click(function () {
        if (username != "visitor") {
            if ($(".comment-information-text").val().trim().length != 0) {
                $.ajax({
                    type: "POST",
                    url: "/untitled_war_exploded/order",
                    data: {
                        opt: "insert",
                        opttext: encodeURI($(".comment-information-text").val()),
                        username: username
                    },
                    async: false,
                    success: function (text) {
                        var textobj = eval("(" + text + ")");
                        if (textobj.hasOwnProperty("msg")) {
                            tip_show(textobj.msg);
                            return;
                        }
                        var join = "<div class=\"info-list\" id=\"" + textobj[0].userid + "\">\n" +
                            "            <div class=\"list-text\">" + decodeURIComponent(decodeURI(textobj[0].text)) + "</div>\n" +
                            "            <div class=\"list-time\">" + textobj[0].time + "</div>\n" +
                            "            <span class=\"fa fa-thumbs-o-up\"> " + textobj[0].ding + "</span>\n" +
                            "            <span class=\"fa fa-trash-o\"><p style=\"display: none\">" + textobj[0].userid + "</p></span>\n" +
                            "        </div>"
                        $(".comment-information-list").prepend(join)
                        tip_show("发表成功");
                        $(".comment-information-text").val("")
                    },
                    error: function (text) {
                        var textobj = eval("(" + text + ")");
                        tip_show(textobj.msg);
                    }
                })
            } else {
                tip_show("输入为空");
            }
        } else {
            tip_show("请登录");
        }
    })
//删除评论
    $(".comment-information-list").delegate(".fa-trash-o", "click", function () {
        var userid = $(this).children().text();
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/order",
            data: {
                opt: "delete",
                optid: userid
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                if (textobj.num == 1) {
                    userid = ".comment-information-list>#" + userid;
                    $(userid).remove()
                    tip_show("删除成功");
                }else
                {
                    tip_show("服务器错误");
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
})
