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
                    if (textobj.num == "1") {
                        window.location.href = "index.html";
                    }
                    $(".center-top-name").text(username)
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
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
//功能切换
    var list = new Array();
    list[0] = ".show-base";
    list[1] = ".menu-base";
    list[2] = ".restaurant-base";
    list[3] = ".desk-base";
    list[4] = ".book-base";
    list[5] = ".comment-base";
    list[6] = ".user-base";
    $(".left>div").click(function () {
        for (var i = 0; i < 7; i++) {
            $(list[i]).attr("style", "display:none");
        }
        $(list[$(this).index()]).removeAttr("style")
    })
//菜单显示
    $(".menu-info").click(function () {
        $(".menu-list").html(null);
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "menushow"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    window.location.href = "index.html";
                    return;
                }
                for (var i in textobj) {
                    var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].menuid)) + "\">\n" +
                        "            <span class=\"NAME\">菜品名称：" + decodeURIComponent(decodeURI(textobj[i].name)) + "</span>\n" +
                        "            <span class=\"SPECIES\">菜品分类：" + decodeURIComponent(decodeURI(textobj[i].species)) + "</span>\n" +
                        "            <span class=\"PRICE\">菜品价格：￥" + decodeURIComponent(decodeURI(textobj[i].price)) + "元</span>\n" +
                        "            <span class=\"PICTURE\">图片名称：" + decodeURIComponent(decodeURI(textobj[i].picture)) + "</span>\n" +
                        "            <div class=\"change-div\">\n" +
                        "                <span class=\"fa fa-file-text-o\" name=\"" + decodeURIComponent(decodeURI(textobj[i].menuid)) + "\"> 修改</span>\n" +
                        "                <span class=\"fa fa-times\" name=\"" + decodeURIComponent(decodeURI(textobj[i].menuid)) + "\"> 删除</span>\n" +
                        "            </div>\n" +
                        "        </div>"
                    $(".menu-list").append(join)
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

//添加菜品
    $(".menu-insert").click(function () {
        $(".mask").removeAttr("style")
        $(".menu-insert-show").removeAttr("style")
        $(".menu-insert-list-name>input").val(null);
        $(".menu-insert-list-price>input").val(null);
        $(".menu-insert-list-picture>input").val(null);
        $(".file-submit").val(null)
    })
    $(".menu-insert-list-title").click(function () {
        $(".mask").attr("style", "display:none")
        $(".menu-insert-show").attr("style", "display:none")
    })

//菜品数据提交
    $("#posttext").click(function () {
        if (!$(".file-submit").val() || $(".menu-insert-list-name>input").val().length == 0 && $(".menu-insert-list-price>input").val().length == 0
            && $(".menu-insert-list-picture>input").val().length == 0) {
            tip_show("输入错误");
        } else {
            var reg = /^[0-9]+$/
            if (!reg.test($(".menu-insert-list-price>input").val())) {
                tip_show("价格错误");
            } else {
                var formData = new FormData();
                formData.append("species", $(".menu-insert-list-spices").find("option:selected").attr("class"));
                formData.append("name", encodeURI($(".menu-insert-list-name>input").val()));
                formData.append("price", encodeURI($(".menu-insert-list-price>input").val()));
                formData.append("picture", encodeURI($(".menu-insert-list-picture>input").val()));
                formData.append("file", $(".file-submit")[0].files[0]);
                $.ajax({
                    url: "/untitled_war_exploded/insert_file",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    "data": formData,
                    success: function (data) {
                        var data = eval("(" + data + ")");
                        tip_show(data.msg);
                        $(".menu-info").click();
                        $(".mask").attr("style", "display:none")
                        $(".menu-insert-show").attr("style", "display:none")
                    },
                    error: function (text) {
                        var textobj = eval("(" + text + ")");
                        tip_show(textobj.msg);
                    }
                })
            }
        }
    })

//菜品数据删除
    $(".menu-list").delegate(".fa-times", "click", function () {
        var id = $(this).attr("name");
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "menudelete",
                id: id
            },
            async: false,
            success: function (data) {
                var data = eval("(" + data + ")");
                if (data.hasOwnProperty("msg")) {
                    tip_show("服务器错误");
                    return;
                }
                console.log(data);
                id = ".menu-list>." + id;
                $(id).remove();
                tip_show("删除成功");
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
//菜品数据修改
    $(".menu-list").delegate(".fa-file-text-o", "click", function () {
        $(".MENUID").text($(this).attr("name"));
        var id = ".menu-list>." + $(this).attr("name") + ">.";
        var NAME = $(id + "NAME").text().split("：");
        var PRICE = $(id + "PRICE").text().split("￥");
        PRICE = PRICE[1].split("元")
        $(".mask").removeAttr("style")
        $(".menu-change-show").removeAttr("style")
        $(".menu-change-list-name>input").val(NAME[1]);
        $(".menu-change-list-price>input").val(PRICE[0]);
    })
    $(".menu-change-list-title").click(function () {
        $(".mask").attr("style", "display:none")
        $(".menu-change-show").attr("style", "display:none")
    })

//菜品信息更新
    $(".menu-change-submit").click(function () {
        var reg = /^\d{1,14}(\.\d{1,2})?$/;
        if (!reg.test($(".menu-change-list-price>input").val())) {
            tip_show("价格错误");
        } else {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/admin",
                data: {
                    opt: "menuupdate",
                    species: $(".menu-change-list-spices").find("option:selected").attr("class"),
                    name: encodeURI($(".menu-change-list-name>input").val()),
                    price: encodeURI($(".menu-change-list-price>input").val()),
                    menuid: encodeURI($(".MENUID").text()),
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    var id = ".menu-list>." + $(".MENUID").text() + ">.";
                    var name = id + "NAME";
                    var species = id + "SPECIES";
                    var price = id + "PRICE";
                    $(name).text("菜品名称：" + $(".menu-change-list-name>input").val());
                    $(price).text("菜品价格：￥" + $(".menu-change-list-price>input").val() + "元");
                    $(species).text("菜品分类：" + decodeURI($(".menu-change-list-spices").find("option:selected").attr("class")));
                    $(".mask").attr("style", "display:none")
                    $(".menu-change-show").attr("style", "display:none")
                    tip_show("修改成功");
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })

//餐厅信息
    $(".restaurant").click(function () {
        var list = new Array();
        list[0] = "two";
        list[1] = "four";
        list[2] = "six";
        list[3] = "eight";
        var time = new Array();
        time[0] = "NINE";
        time[1] = "ELEVEN";
        time[2] = "THIRTEEN";
        time[3] = "FIFTEEN";
        time[4] = "SEVENTEEN";
        time[5] = "NINETEEN";
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "restaurant"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i = 0; i < 4; i++) {
                    var ans = "." + list[i] + ">." + time[0]
                    $(ans).text(textobj[i].nine);
                    ans = "." + list[i] + ">." + time[1]
                    $(ans).text(textobj[i].eleven);
                    ans = "." + list[i] + ">." + time[2]
                    $(ans).text(textobj[i].thirteen);
                    ans = "." + list[i] + ">." + time[3]
                    $(ans).text(textobj[i].fifteen);
                    ans = "." + list[i] + ">." + time[4]
                    $(ans).text(textobj[i].seventeen);
                    ans = "." + list[i] + ">." + time[5]
                    $(ans).text(textobj[i].nineteen);
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

    $(".restaurant-base-reduce").click(function () {
        $(".mask").removeAttr("style");
        $(".book-select").removeAttr("style");
        $(".book-span").text("客户结算")
    })
    $(".restaurant-base-increase").click(function () {
        $(".mask").removeAttr("style");
        $(".book-select").removeAttr("style");
        $(".book-span").text("客户就餐")
    })
    $(".book-pay").click(function () {
        var num = -1;
        if ($(".book-span").text() == "客户结算") {
            num = 1;
        }
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "changedesk",
                desk: $('input[name="desk"]:checked').attr("class"),
                time: $('input[name="time"]:checked').attr("class"),
                num: num
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                tip_show("操作完成");
                $(".mask").attr("style", "display:none")
                $(".book-select").attr("style", "display:none")
                $(".restaurant").click()
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
    $(".book-title>p").click(function () {
        $(".mask").attr("style", "display:none")
        $(".book-select").attr("style", "display:none")
    })
//订桌显示
    $(".desk-book").click(function () {
        $(".desk-list").text("");
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "deskdata"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    if ((decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(取消订桌)") != -1) || (decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(完成订桌)") != -1)) {
                        var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\">\n" +
                            "            <span class=\"BOOK_ID\">订桌编号:" + decodeURIComponent(decodeURI(textobj[i].book_id)) + "</span>\n" +
                            "            <span class=\"USERNAME\">订桌用户:" + decodeURIComponent(decodeURI(textobj[i].username)) + "</span>\n" +
                            "            <span class=\"TYPE\">类型:" + decodeURIComponent(decodeURI(textobj[i].type)) + "</span>\n" +
                            "            <span class=\"TIME\">时间:" + decodeURIComponent(decodeURI(textobj[i].time)) + "</span>\n" +
                            "            <div class=\"fa fa-check-square-o\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 已结单</div>\n" +
                            "        </div>"
                        $(".desk-list").append(join)
                    } else {
                        var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\">\n" +
                            "            <span class=\"BOOK_ID\">订桌编号:" + decodeURIComponent(decodeURI(textobj[i].book_id)) + "</span>\n" +
                            "            <span class=\"USERNAME\">订桌用户:" + decodeURIComponent(decodeURI(textobj[i].username)) + "</span>\n" +
                            "            <span class=\"TYPE\">类型:" + decodeURIComponent(decodeURI(textobj[i].type)) + "</span>\n" +
                            "            <span class=\"TIME\">时间:" + decodeURIComponent(decodeURI(textobj[i].time)) + "</span>\n" +
                            "            <div class=\"fa fa-check-square-o\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 结单</div>\n" +
                            "        </div>"
                        $(".desk-list").append(join)
                    }
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

    function fun_desk(ptype, ptime) {
        if (ptype == encodeURI("(完成订桌)两人桌")) {
            ptype = 'two';
        } else if (ptype == encodeURI("(完成订桌)四人桌")) {
            ptype = 'four';
        } else if (ptype == encodeURI("(完成订桌)六人桌")) {
            ptype = 'six';
        } else if (ptype == encodeURI("(完成订桌)大包厢")) {
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
            url: "/untitled_war_exploded/admin",
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
                tip_show("操作完成");
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    }

    $(".desk-list").delegate(".fa-check-square-o", "click", function () {
        var id = $(this).attr("name")
        if (!($(this).text().indexOf("已") != -1)) {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/admin",
                data: {
                    opt: "cancel_desk",
                    id: id
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    fun_desk(textobj[0].type, textobj[0].time)
                    $(".desk-book").click()
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
//订单管理
    $(".menu-book").click(function () {
        $(".book-list").html(null)
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "menudata"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    if ((decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(取消订单)") != -1) || (decodeURIComponent(decodeURI(textobj[i].type)).indexOf("(完成订单)") != -1)) {
                        var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\">\n" +
                            "            <span class=\"MENU_ID\">订单编号:" + decodeURIComponent(decodeURI(textobj[i].menuid)) + "</span>\n" +
                            "            <span class=\"MENU_USERNAME\">订单用户:" + decodeURIComponent(decodeURI(textobj[i].user)) + "</span>\n" +
                            "            <span class=\"MENU_NUM\">订单价格:" + decodeURIComponent(decodeURI(textobj[i].sum)) + "</span>\n" +
                            "            <span class=\"MENU_TYPE\">订单类型:" + decodeURIComponent(decodeURI(textobj[i].type)) + "</span>\n" +
                            "            <div class=\"fa fa-check-square-o\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 已结单</div>\n" +
                            "            <div class=\"fa fa-buysellads\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 详细</div>\n" +
                            "        </div>"
                        $(".book-list").append(join)
                    } else {
                        var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\">\n" +
                            "            <span class=\"MENU_ID\">订单编号:" + decodeURIComponent(decodeURI(textobj[i].menuid)) + "</span>\n" +
                            "            <span class=\"MENU_USERNAME\">订单用户:" + decodeURIComponent(decodeURI(textobj[i].user)) + "</span>\n" +
                            "            <span class=\"MENU_NUM\">订单价格:" + decodeURIComponent(decodeURI(textobj[i].sum)) + "</span>\n" +
                            "            <span class=\"MENU_TYPE\">订单类型:" + decodeURIComponent(decodeURI(textobj[i].type)) + "</span>\n" +
                            "            <div class=\"fa fa-check-square-o\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 结单</div>\n" +
                            "            <div class=\"fa fa-buysellads\" name=\"" + decodeURIComponent(decodeURI(textobj[i].id)) + "\"> 详细</div>\n" +
                            "        </div>"
                        $(".book-list").append(join)
                    }
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

    $(".book-list").delegate(".fa-check-square-o", "click", function () {
        var id = $(this).attr("name")
        if (!($(this).text().indexOf("已") != -1)) {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/admin",
                data: {
                    opt: "cancel_menu",
                    id: id
                },
                async: false,
                success: function (text) {
                    var textobj = eval("(" + text + ")");
                    if (textobj.hasOwnProperty("msg")) {
                        tip_show(textobj.msg);
                        return;
                    }
                    tip_show("操作完成")
                    $(".menu-book").click();
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
    $(".book-list").delegate(".fa-buysellads", "click", function () {
        $(".mask-text").html(null)
        var id = $(this).attr("name")
        $(".book_menu-select").removeAttr("style")
        $(".mask").removeAttr("style")
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "menu_detail",
                optnum: id
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                textobj[0].text = decodeURIComponent(decodeURI(textobj[0].text));
                var menutext = textobj[0].text.split(",")
                $(".book-title>span").text("￥" + textobj[0].sum + "元")
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
//评论
    $(".comment-info").click(function () {
        $(".comment-list").html(null);
        $.ajax({
            type: "GET",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "comment"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    var join = "<div class=\"" + decodeURIComponent(decodeURI(textobj[i].userid)) + "\">\n" +
                        "            <span class=\"COMMENT_NAME\">评论用户: " + decodeURIComponent(decodeURI(textobj[i].name)) + "</span>\n" +
                        "            <span class=\"COMMENT_TEXT\">评论内容: " + decodeURIComponent(decodeURI(textobj[i].text)) + "</span>\n" +
                        "            <span class=\"COMMENT_TIME\">评论时间: " + decodeURIComponent(decodeURI(textobj[i].time)) + "</span>\n" +
                        "            <span class=\"COMMENT_DING\">评论点赞: " + decodeURIComponent(decodeURI(textobj[i].ding)) + "</span>\n" +
                        "            <div class=\"fa fa-times\" name=\"" + decodeURIComponent(decodeURI(textobj[i].userid)) + "\"> 删除</div>\n" +
                        "        </div>"
                    $(".comment-list").prepend(join);
                }

            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })

    $(".comment-list").delegate(".fa-times", "click", function () {
        var id = $(this).attr("name");
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "delete",
                id: id
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                tip_show("删除成功");
                $(".comment-info").click()
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
//信息修改
    $(".people-info").click(function () {
        $(".user-list").html(null);
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "usertext"
            },
            async: false,
            success: function (text) {
                var textobj = eval("(" + text + ")");
                if (textobj.hasOwnProperty("msg")) {
                    tip_show(textobj.msg);
                    return;
                }
                for (var i in textobj) {
                    if (textobj[i].management == 1) {
                        var join = "<div class=\"" + textobj[i].id + "\">\n" +
                            "            <span class=\"USER_USERNAME\">管理员: " + decodeURIComponent(decodeURI(textobj[i].username)) + "</span>\n" +
                            "            <span class=\"USER_PASSWORD\">密码: " + decodeURIComponent(decodeURI("********")) + "</span>\n" +
                            "            <span class=\"USER_NAME\">用户名: " + decodeURIComponent(decodeURI(textobj[i].name)) + "</span>\n" +
                            "            <span class=\"USER_PHONE\">电话: " + decodeURIComponent(decodeURI(textobj[i].phone)) + "</span>\n" +
                            "            <span class=\"USER_ADDRESS\">地址: " + decodeURIComponent(decodeURI(textobj[i].address)) + "</span>\n" +
                            "            <div class=\"fa fa-times\" name=\"" + textobj[i].id + "\"> 删除</div>\n" +
                            "            <div class=\"fa fa-file-text-o\" name=\"" + textobj[i].id + "\"> 修改</div>\n" +
                            "        </div>"
                        $(".user-list").append(join);
                    } else {
                        var join = "<div class=\"" + textobj[i].id + "\">\n" +
                            "            <span class=\"USER_USERNAME\">账户: " + decodeURIComponent(decodeURI(textobj[i].username)) + "</span>\n" +
                            "            <span class=\"USER_PASSWORD\">密码: " + decodeURIComponent(decodeURI("********")) + "</span>\n" +
                            "            <span class=\"USER_NAME\">用户名: " + decodeURIComponent(decodeURI(textobj[i].name)) + "</span>\n" +
                            "            <span class=\"USER_PHONE\">电话: " + decodeURIComponent(decodeURI(textobj[i].phone)) + "</span>\n" +
                            "            <span class=\"USER_ADDRESS\">地址: " + decodeURIComponent(decodeURI(textobj[i].address)) + "</span>\n" +
                            "            <div class=\"fa fa-times\" name=\"" + textobj[i].id + "\"> 删除</div>\n" +
                            "            <div class=\"fa fa-file-text-o\" name=\"" + textobj[i].id + "\"> 修改</div>\n" +
                            "        </div>"
                        $(".user-list").append(join);
                    }
                }
            },
            error: function (text) {
                var textobj = eval("(" + text + ")");
                tip_show(textobj.msg);
            }
        })
    })
    $(".user-list").delegate(".fa-times", "click", function () {
        var id = $(this).attr("name");
        if (id == 1) {
            tip_show("无法删除");
        } else {
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/admin",
                data: {
                    opt: "deleteuser",
                    id: id
                },
                success: function (text) {
                    var text = eval("(" + text + ")");
                    if (text.hasOwnProperty("msg")) {
                        tip_show(text.msg);
                        return;
                    }
                    tip_show("删除成功");
                    id = ".user-list>." + id + ">.";
                    var USER_USERNAME = $(id + "USER_USERNAME").text().split(": ");
                    if (USER_USERNAME[1] == $(".admin-user").text() || $(".menu-change-list-man").find("option:selected").attr("class") == 0) {
                        document.cookie = "username= ; expires=" + (new Date(0)).toUTCString();
                        ;
                        document.cookie = "password= ; expires=" + (new Date(0)).toUTCString();
                        ;
                        window.location.href = "index.html";
                    }
                    $(".people-info").click()
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })
    $(".user-list").delegate(".fa-file-text-o", "click", function () {
        var id = $(this).attr("name");
        $(".user_id").text(id);
        id = ".user-list>." + id + ">.";
        var USER_USERNAME = $(id + "USER_USERNAME").text().split(": ");
        var USER_PASSWORD = $(id + "USER_PASSWORD").text().split(": ");
        var USER_NAME = $(id + "USER_NAME").text().split(": ");
        var USER_PHONE = $(id + "USER_PHONE").text().split(": ");
        var USER_ADDRESS = $(id + "USER_ADDRESS").text().split(": ");
        $(".mask").removeAttr("style")
        $(".user-change-show").removeAttr("style")
        $(".user-change-list-user").html("用户账号&nbsp&nbsp&nbsp&nbsp&nbsp" + USER_USERNAME[1]);
        $(".user-change-list-password>input").val(USER_PASSWORD[1])
        $(".user-change-list-name>input").val(USER_NAME[1])
        $(".user-change-list-phone>input").val(USER_PHONE[1])
        $(".user-change-list-address>input").val(USER_ADDRESS[1])
        if (id == ".user-list>.1>.") {
            $(".menu-change-list-man").html("管理权限&nbsp&nbsp&nbsp&nbsp&nbsp管理员");
        } else {
            $(".menu-change-list-man").html(
                "管理权限&nbsp" +
                "<select placeholder=\"请选择权限\">" +
                "<option class=\"0\">用户</option>" +
                "<option class=\"1\">管理员</option>" +
                "</select>");
        }
    })

    $("#updateuser").click(function () {
        var password = $(".user-change-list-password>input").val();
        var reg = new RegExp(/[0-9a-zA-Z]|/);
        if (password.length < 8) {
            alert("密码长度必须大于七位")
        } else if (!reg.test(password)) {
            alert("密码只允许字母与数字")
        } else {
            var man = 1;
            if ($(".user_id").text() != "1") {
                man = $(".menu-change-list-man").find("option:selected").attr("class")
            }
            $.ajax({
                type: "POST",
                url: "/untitled_war_exploded/admin",
                data: {
                    opt: "changeuser",
                    id: $(".user_id").text(),
                    password: $(".user-change-list-password>input").val(),
                    name: encodeURI($(".user-change-list-name>input").val()),
                    phone: encodeURI($(".user-change-list-phone>input").val()),
                    address: encodeURI($(".user-change-list-address>input").val()),
                    man: man
                },
                success: function (text) {
                    var text = eval("(" + text + ")");
                    if (text.hasOwnProperty("msg")) {
                        tip_show(text.msg);
                        return;
                    }
                    tip_show("修改完成");
                    var id = ".user-list>." + $(".user_id").text() + ">.";
                    var USER_PASSWORD = $(id + "USER_PASSWORD").text().split(": ");
                    var USER_USERNAME = $(id + "USER_USERNAME").text().split(": ");
                    if (USER_USERNAME[1] == $(".admin-user").text() && (USER_PASSWORD[1] != $(".user-change-list-password>input").val() || man == 0)) {
                        document.cookie = "username= ; expires=" + (new Date(0)).toUTCString();
                        ;
                        document.cookie = "password= ; expires=" + (new Date(0)).toUTCString();
                        ;
                        window.location.href = "index.html";
                    }
                    $(".mask").attr("style", "display:none")
                    $(".user-change-show").attr("style", "display:none")
                    $(".people-info").click()
                },
                error: function (text) {
                    var textobj = eval("(" + text + ")");
                    tip_show(textobj.msg);
                }
            })
        }
    })

//显示主页
    $(".index-info").click(function () {
        $.ajax({
            type: "POST",
            url: "/untitled_war_exploded/admin",
            data: {
                opt: "indexinfo",
            },
            success: function (text) {
                var text = eval("(" + text + ")");
                $(".today-menu").text(text["today-menu"])
                $(".win-menu").text(text["win-menu"])
                $(".sum-menu").text(text["sum-menu"])
                $(".today-book").text(text["today-book"])
                $(".win-book").text(text["win-book"])
                $(".sum-book").text(text["sum-book"])
                $(".sum-user").text(text["sum-user"])
                $(".sum-comment").text(text["sum-comment"])
            }
        })
    })
    $(".index-info").click()
//bug窗口修复
    $(".fa-close").click(function () {
        $(".mask").attr("style", "display:none")
        $(".menu-insert-show").attr("style", "display:none")
        $(".menu-change-show").attr("style", "display:none")
        $(".book-select").attr("style", "display:none")
        $(".book_menu-select").attr("style", "display:none")
        $(".user-change-show").attr("style", "display:none")
    })
})

