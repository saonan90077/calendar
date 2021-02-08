const calendar = new Calendar()

const obj = {
	contianer: document.querySelector('.week-body'),
	init: function() {
		this.contianer.innerHTML = this.renderNode('prev') + this.renderNode() + this.renderNode('next')
	},
	renderNode(type) {
		let list = []
		if(!type) {
			list = calendar.updateCalendar()
		}else{
			const { year, month, day } = this.computedMonth(type, {})
			list = calendar.updateCalendar(year, month, day)
		}
		const str = renderweekBodyItemData(list)
		return `<ul class='swiper-slide week-body_item'>${str}</ul>`
	},
	computedMonth: function(type, { year, month, day }) {
		let _year, _month, _day, date
		if (typeof year === 'undefined' && typeof month === 'undefined' && typeof day === 'undefined') {
			date = new Date()
		}else {
			date = new Date(year, month, day)
		}
		_year = date.getFullYear()
		_month = date.getMonth()
		_day = date.getDate()
		switch(type) {
			case 'prev':
				if(_month === 0) {
					_year--
					_month = 11
				}else{
					_month--
				}
				break
			case 'next':
				if(_month === 11) {
					year++
					_month = 0
				}else{
					_month++
				}
				break
			default:
				break
		}
		return {
			year: _year,
			month: _month,
			day: _day
		}
	}
}

function renderWeekHead() {
	const weekStrs = ['日', '一', '二', '三', '四', '五', '六']
	const weekHead = document.querySelector('.week-head')
	const str = weekStrs.reduce((result, item) => {
		return result + `<li>${item}</li>`
	}, '')
	weekHead.innerHTML = str
}

function renderweekBodyItemData(list) {
	const now = new Date()
	const month = now.getMonth()
	const day = now.getDate()
	const result = list.reduce((total, item) => {
		const className = month === item.data.month && day === item.data.day ? 'current' : ''
		return total + `<li
			class='${ item.type + ' ' + className }'
			data-type='${ item.type }'
			data-year='${ item.data.year }'
			data-month='${ item.data.month }'
			data-day='${ item.data.day }'>${ item.data.day }</li>`
	}, '')
	return result
}

const Swiper = new Swiper('.swiper-container', {
	initialSlide: 1,
	observer: true,
	observeSlideChildren: true,
	on:{
		slideChangeTransitionEnd: function(swiper){
			const activeSlide = swiper.slides[swiper.activeIndex]
			if(!activeSlide) {
				return
			}
			const isEnd = swiper.isEnd
			const isBeginning = swiper.isBeginning
			const el = activeSlide.querySelector('.currentMonth')
			const date = {
				year: el.getAttribute('data-year'),
				month: el.getAttribute('data-month'),
				day: el.getAttribute('data-day')
			}
			let _date, arr, str
			if(isEnd || isBeginning) {
				_date = obj.computedMonth(isEnd ? 'next' : (isBeginning ? 'prev' : ''), date)
				arr = calendar.updateCalendar(_date.year, _date.month, _date.day)
				str = renderweekBodyItemData(arr)
			}
			if(isEnd) {
				swiper.appendSlide(`<ul class='swiper-slide week-body_item'>${str}</ul>`)
			}
			if(isBeginning){
				swiper.prependSlide(`<ul class='swiper-slide week-body_item'>${str}</ul>`)
			}
		}
	}
})

const el = document.querySelector('.swiper-container_wrapper')
el.addEventListener('click', function(e) {
	const node = e.target
	if(node.nodeName === 'LI') {
		const date = {
			year: node.getAttribute('data-year'),
			month: +node.getAttribute('data-month') + 1,
			day: node.getAttribute('data-day')
		}
		alert(`${ date.year }-${ date.month }-${ date.day }`)
	}
	
})
renderWeekHead()
obj.init()