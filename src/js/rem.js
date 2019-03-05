//移动端屏幕适配
(function () {
    var b = document.documentElement, c = null;
    function w() {
        var a = b.getBoundingClientRect().width;
        //750为设计稿宽度
        b.style.fontSize = 100 * ((a > 750 ? 750 : a) / 750) + "px";
    };
    window.addEventListener("resize", function() {
        clearTimeout(c);
        c = setTimeout(w, 300);
    });
    w();
})();