//移动端屏幕适配
(function () {
	let b = document.documentElement,
	c = null
	function w() {
		const a = b.getBoundingClientRect().width
		//750为设计稿宽度
		b.style.fontSize = 100 * ((a > 750 ? 750 : a) / 750) + 'px'
	}
	window.addEventListener('resize', function() {
		clearTimeout(c)
		c = setTimeout(w, 300)
	})
	w()
})()