class Calendar {
	constructor(options) {
		
	}
	// 判断该年是平年还是闰年
	isLeapYear(year) {
		return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0)
	}
	// 每个月的最后一天是几号(month - [0-11])
	getMonthCount(year, month) {
		const arr = [
			31, null, 31, 30, 
			31, 30, 31, 31,
			30, 31, 30, 31
		]
		const count = arr[month] || (this.isLeapYear(year) ? 29 : 28)
		return Array.from(new Array(count), (item, index) => {
			return {
				year,
				month,
				day: index + 1
			}
		})
	}
	// 获得某年某月的 1号 是星期几 (从[日-六](0-6))
	getWeekday(year, month) {
		const date = new Date(year, month, 1)
		return date.getDay()
	}
	// 获得上个月的天数
	getPreMonthCount(year, month) {
		if (month === 0) {
			return this.getMonthCount(year - 1, 11)
		}
		return this.getMonthCount(year, month - 1)
	}
	// 获得下个月的天数
	getNextMonthCount(year, month) {
		if (month === 11) {
			return this.getMonthCount(year + 1, 0)
		}
		return this.getMonthCount(year, month + 1)
	}
	updateCalendar(year, month, day) {
		if (typeof year === 'undefined' && typeof month === 'undefined' && typeof day === 'undefined') {
			const nowDate = new Date()
			year = nowDate.getFullYear()
			month = nowDate.getMonth()
			day = nowDate.getDate()
		}
		// 生成日历数据，上个月剩下的的 x 天 + 当月的 28（平年的2月）或者29（闰年的2月）或者30或者31天 + 下个月的 y 天 = 42
		let currentMonth = this.getMonthCount(year, month).map(item => {
			return {
				type: 'currentMonth',
				data: item
			}
		})
		let preMonth = this.getPreMonthCount(year, month).map(item => {
			return {
				type: 'preMonth',
				data: item
			}
		})
		let nextMonth = this.getNextMonthCount(year, month).map(item => {
			return {
				type: 'nextMonth',
				data: item
			}
		})
		let whereMonday = this.getWeekday(year, month)
		if (whereMonday === 0) {
			whereMonday = 7
		}
		let preArr = preMonth.slice(-1 * whereMonday)
		let nextArr = nextMonth.slice(0, 42 - currentMonth.length - whereMonday)
		return [].concat(preArr, currentMonth, nextArr)
	}
}