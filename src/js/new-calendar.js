//当月日历类
class Calendar {
    constructor(option) {
        this.year = option.year;
        this.month = option.month;
        this.day = option.day ? option.day : 1;
        this.firstDayWeek = this.getCurrentMonthFirstWeek();
    }
    //当月第一天是周几
    getCurrentMonthFirstWeek(){
        return new Date(this.year, this.month - 1, 1).getDay();
    }
    currentMonth() {
        return this.computeTime('current')
    }
    nextMonth() {
        return this.computeTime('next')
    }
    prevMonth() {
        return this.computeTime('prev')
    }
    computeTime(type) {
        let val = 0,
            month = this.month;
        switch(type) {
            case 'current':
                break;
            case 'next':
                if(month > 12) {
                    month = 12;
                }
                val = 1;//下月或者下年1月
                break;
            case 'prev':
                if(month <= 1) {
                    month = 1;
                }
                month = month - 1;
                val = 0;//上月或上年12月
                break;
            default:
                return;
        }
        let date = new Date(this.year, month, val);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            totalDay: date.getDate(),
            week: date.getDay()
        }
    }
    //生成当月各日期的数组
    getData() {
        let prevMonth = this.prevMonth();
        let currentMonth = this.currentMonth();
        let nextMonth = this.nextMonth();
        let prevList = [];
        let currentList = [];
        let nextList = [];
        for(let i = 0; i < this.firstDayWeek; i++) {
            prevList.push({
                type: 'prev',
                year: prevMonth.year,
                month: prevMonth.month,
                day: prevMonth.totalDay --
            });
        }
        prevList = prevList.sort((a, b) => {
            return a.day - b.day;
        })
        for(let i = 1; i <= currentMonth.totalDay; i++) {
            currentList.push({
                type: 'current',
                year: currentMonth.year,
                month: currentMonth.month,
                day: i
            })
        }
        let len = prevList.length + currentList.length;
        //总元素数为42
        for(let i = len; i < 42; i++) {
            nextList.push({
                type: 'next',
                year: nextMonth.year,
                month: nextMonth.month,
                day: nextMonth.totalDay ++
            })
        }
        return [].concat(prevList, currentList, nextList);
    }
}
