;$(document).ready(function() {
    function dateFormatter(val) {
        return val >= 10 ? val : "0" + val;
    }
    function getClickDate(date) {
        $(".fixLoading").show();
        console.log(date)
        $(".date-txt").html(date[0] + "年" + date[1] + "月" + date[2] + "日");
        setTimeout(() => {
            $(".fixLoading").hide();
        }, 1000)
    }
    var renderDate = function(opts) {
        this.el = opts.el;
        this.init({
            year: opts.year,
            month:  opts.month,
            day: opts.day
        });
    }
    renderDate.prototype.init = function(opts) {
        var nextHtml = "",
            prevHtml = "";
        if(opts.year == 1970 && opts.month == 0) {
            prevHtml = "";
        }else{
            prevHtml = this.renderHtml({
                year: opts.month == 0 ? (opts.year - 1) : opts.year,
                month: opts.month == 0 ? 11 : opts.month - 1,
                day: opts.day
            });
        }
        var currentHtml = this.renderHtml({
            year: opts.year,
            month: opts.month,
            day: opts.day
        });
        if(opts.year == new Date().getFullYear() && opts.month == new Date().getMonth()) {
            nextHtml = "";
        }else{
            nextHtml = this.renderHtml({
                year: opts.month == 11 ? (opts.year + 1) : opts.year,
                month: opts.month == 11 ? 0 : opts.month + 1,
                day: opts.day
            });
        }
        $(this.el).html(prevHtml + currentHtml + nextHtml);
        this.click();
    }
    renderDate.prototype.renderHtml = function(obj) {
        //当月第一天是周几
        var firstDay = new Date(obj.year, obj.month, 1).getDay();
        //上一月或者上一年
        var prevDate = new Date(obj.year, obj.month, 0);
        //上一月总天数
        var prevMonthTotalDay = prevDate.getDate();
        //上一年或者当年
        var prevYear = prevDate.getFullYear();
        //上一月对应月份
        var prevYearMonth = prevDate.getMonth();
        //当前月总天数
        var currentMonthTotalDay = new Date(obj.year, obj.month + 1, 0).getDate();
        //下一月或者下一年
        var nextDate = new Date(obj.year, obj.month + 2, 0);
        var nextDateYear = nextDate.getFullYear();
        var nextDateMonth = nextDate.getMonth();

        var arr = [];
        for(var i = 0; i<firstDay; i++) {
            var prevDay = prevMonthTotalDay--;
            arr.push("<li class='prevMonth' data-date=" + prevYear + "-" + dateFormatter(prevYearMonth + 1) + "-" +  dateFormatter(prevDay) + ">" + "<span>" + prevDay  + "</span>" + "</li>");
        }
        arr.reverse();
        for(var j = 1; j<=currentMonthTotalDay; j++) {
            var defaultDay = j == obj.day ? "defaultDay" : "";
            arr.push("<li class='currentMonth' data-date=" + obj.year + "-" + dateFormatter(obj.month + 1) + "-" +  dateFormatter(j) + ">" + "<span class='"+ defaultDay +"'>" + j + "</span><i>" + "</i></li>")
        }
        var next = 1;
        var len = arr.length;
        for(var k = len; k<42; k++) {
            arr.push("<li class='nextMonth' data-date=" + nextDateYear + "-" + dateFormatter(nextDateMonth + 1) + "-" +  dateFormatter(next) + ">" + "<span>" + (next++) + "</span>" + "</li>")
        }

        return "<ul class='swiper-slide'>" + arr.join("") + "</ul>";
    };
    renderDate.prototype.click = function() {
        $(this.el).off("click", "li").on("click", "li", function() {
            if($(this).hasClass("currentMonth")) {
                $(this).parent().find("span").removeClass("selected");
                $(this).find("span").addClass("selected");
                getClickDate($(this).attr("data-date").split("-"))
            }
        })
    }
    var render = new renderDate({
        el: "#calendarHtml",
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate()
    });
    var mySwiper = new Swiper('#calendar', {
        initialSlide: 1,
        observer:true,
        observeSlideChildren:true,
        on: {
            slideChangeTransitionEnd: function() {
                var currentDay = $(".swiper-slide").eq(this.activeIndex).find(".defaultDay").parent().attr("data-date").split("-");
                getClickDate(currentDay);
                this.allowSlideNext = true;
                this.allowSlidePrev = true;
                $(".arrow-left").css("opacity", "1");
                $(".arrow-right").css("opacity", "1");
                if(this.isEnd) {
                    if(currentDay[0] == new Date().getFullYear()) {
                        if(currentDay[1] != new Date().getMonth() + 1) {
                            this.appendSlide(render.renderHtml({
                                year: currentDay[1] == 12 ? (Number(currentDay[0]) + 1) : Number(currentDay[0]),
                                month: currentDay[1] == 12 ? 0 : Number(currentDay[1]),
                                day: Number(currentDay[2])
                            }));
                        }else{
                            this.allowSlideNext = false;
                            $(".arrow-right").css("opacity", "0.6");
                        }
                    }else{
                        this.appendSlide(render.renderHtml({
                            year: currentDay[1] == 12 ? (Number(currentDay[0]) + 1) : Number(currentDay[0]),
                            month: currentDay[1] == 12 ? 0 : Number(currentDay[1]),
                            day: Number(currentDay[2])
                        }));
                    }
                }
                if(this.isBeginning) {
                    if(currentDay[0] == 1970) {
                        if(currentDay[1] != 1) {
                            this.prependSlide(render.renderHtml({
                                year: currentDay[1] == 1 ? (Number(currentDay[0]) - 1) : Number(currentDay[0]),
                                month: currentDay[1] == 1 ? 11 : Number(currentDay[1] - 2),
                                day: Number(currentDay[2])
                            }));
                        }else{
                            this.allowSlidePrev = false;
                            $(".arrow-left").css("opacity", "0.6");
                        }
                    }else{
                        this.prependSlide(render.renderHtml({
                            year: currentDay[1] == 1 ? (Number(currentDay[0]) - 1) : Number(currentDay[0]),
                            month: currentDay[1] == 1 ? 11 : Number(currentDay[1] - 2),
                            day: Number(currentDay[2])
                        }));
                    }
                }
            }
        }
    });

    $(".arrow-right").click(function() {
        mySwiper.slideNext();
    });
    $(".arrow-left").click(function() {
        mySwiper.slidePrev();
    });



    //弹出层
    var yearModal = 0,
        monModal = 1,
        dayModal = new Date().getDate();
    $(".dateModal").on("touchmove", function(e) {
        e.preventDefault();
    })
    //年
    var yearArr = [];
    for(var year = 1970; year<= new Date().getFullYear(); year++) {
        yearArr.push("<div class='swiper-slide' data-year='"+ year + "'>" + year + "年" + "</div>");
    };
    $("#selectYearHtml").html(yearArr.join(""))
    var yearRender = new Swiper("#selectYear", {
        direction: "vertical",
        initialSlide: yearArr.length - 1,
        slideToClickedSlide: true,
        slidesPerView: 7,
        effect: "coverflow",
        centeredSlides: true,
        coverflowEffect: {
            stretch: -5,
            rotate: 10,
            depth: 60,
            modifier: 2,
            slideShadows : false
        },
        on: {
            slideChange: function() {
                var year = $("#selectYearHtml").find("div").eq(this.activeIndex).attr("data-year");
                yearModal = year;
                monthRender({
                    year: Number(yearModal),
                    month: Number(monModal)
                });
                dayRender({
                    year: Number(yearModal),
                    month: Number(monModal) - 1
                });
            }
        }
    });
    //月
    var monRender = new Swiper("#selectMon", {
        direction: "vertical",
        observer:true,
        observeSlideChildren:true,
        slideToClickedSlide: true,
        initialSlide: new Date().getMonth(),
        slidesPerView: 7,
        effect: "coverflow",
        centeredSlides: true,
        coverflowEffect: {
            stretch: -5,
            rotate: 10,
            depth: 60,
            modifier: 2,
            slideShadows : false
        },
        on: {
            slideChange: function() {
                var mon = $("#selectMonHtml").find("div").eq(this.activeIndex).attr("data-month");
                monModal = mon;
                dayRender({
                    year: Number(yearModal),
                    month: Number(monModal) - 1
                });
            }
        }
    });
    function monthRender(opts) {
        var current = new Date();
        var curYear = current.getFullYear();
        var curMon = current.getMonth();
        var totalMon = curYear == opts.year ? curMon + 1 : 12;
        var monthArr = [];
        for(var month = 1; month <= totalMon; month++) {
            monthArr.push("<div class='swiper-slide' data-month='"+ month + "'>" + month + "月" + "</div>");
        };
        $("#selectMonHtml").html(monthArr.join(""));
    }
    //日
    var dayRender_ = new Swiper("#selectDay", {
        direction: "vertical",
        initialSlide: dayModal - 1,
        observer:true,
        observeSlideChildren:true,
        slideToClickedSlide: true,
        slidesPerView: 7,
        effect: "coverflow",
        centeredSlides: true,
        coverflowEffect: {
            stretch: -5,
            rotate: 10,
            depth: 60,
            modifier: 2,
            slideShadows : false
        },
        on: {
            slideChange: function() {
                dayModal = $("#selectDayHtml").find("div").eq(this.activeIndex).attr("data-day");
            }
        }
    });
    function dayRender(opts) {
        var current = new Date();
        var curYear = current.getFullYear();
        var curMon = current.getMonth();
        var curDay = current.getDate();
        var totalDay = 0;
        if(curYear == opts.year && opts.month == curMon) {
            totalDay = curDay;
        }else{
            totalDay = new Date(opts.year, opts.month + 1, 0).getDate();
        }
        var dayArr = [];
        for(var i = 1; i<= totalDay; i++) {
            dayArr.push("<div class='swiper-slide' data-day='"+ i + "'>" + i + "日" + "</div>");
        }
        $("#selectDayHtml").html(dayArr.join(""));
    }
    $(".date-txt").click(function() {
        $(".dateModal").animate({
            height: "100%"
        });
        $(".action").show();
        $(".dateModal").find(".swiper-container").animate({
            height: "3.78rem"
        }, function() {
            yearRender.update();
            monRender.update();
            dayRender_.update();
        });
    });
    $(".cancel").click(function(e) {
        e.preventDefault();
        $(".dateModal").find(".swiper-container").animate({
            height: "0"
        });
        $(".dateModal").animate({
            height: "0"
        });
        $(".action").hide();
    });
    $(".enter").click(function(e) {
        e.preventDefault();
        var y = yearModal,
            m = dateFormatter(monModal),
            d = dateFormatter(dayModal);
        $(".cancel").click();
        render.init({
            year: Number(y),
            month: Number(m) - 1,
            day: Number(d)
        });
        if(y == 1970 && m == 1) {
            mySwiper.slideTo(0);
        }else{
            if(mySwiper.activeIndex == 1) {
                mySwiper.allowSlideNext = y == new Date().getFullYear() ? false : true;
                $(".arrow-right").css("opacity", mySwiper.allowSlideNext ? "1" : "0.6");
                getClickDate([y, m , d]);
            }else{
                mySwiper.slideTo(1);
            }
        }
        
    });
});
