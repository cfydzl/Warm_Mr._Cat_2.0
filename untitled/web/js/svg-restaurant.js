//统计图
$(function () {
    function makeSVG(tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }
    var name = new Array("two", "four", "six", "eight")
    $.ajax({
        type: "get",
        url: "/untitled_war_exploded/restaurant",
        data: {
            opt: "findnum",
        },
        async: false,
        success: function (text) {
            var textobj= eval("(" + text + ")");
            if (textobj[0].hasOwnProperty("msg")) {
                tip_show(textobj.msg);
                return;
            }
            for (var i in textobj) {
                var num = new Array(textobj[i].nine, textobj[i].eleven, textobj[i].thirteen, textobj[i].fifteen, textobj[i].seventeen, textobj[i].nineteen)
                for (var j = 0; j < num.length; j++) {
                    var circle = makeSVG('rect', {
                        y: ((6 - parseInt(num[j])) * 45 + 50),
                        x: 100 + (j * 180),
                        width: 20,
                        height: 320 - ((6 - parseInt(num[j])) * 45 + 50),
                        'stroke-width': 2
                    });
                    document.getElementById(name[i]).appendChild(circle);
                }
            }
        },
        error: function (text) {
            var textobj = eval("(" + text + ")");
            tip_show(textobj.msg);
        }
    })
})