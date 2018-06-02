// This is a jquary addon for mouse and tuch hold function
jQuery.fn.mouseHold = function(timeout, f, callback) {
	if (timeout && typeof timeout == 'function') {
		f = timeout;
		timeout = 100;
	}
	if (f && typeof f == 'function') {
		var timer = 0;
		var fireStep = 0;
		return this.each(function() {

			jQuery(this).on('mousedown touchstart',function() {
				fireStep = 1;
				var ctr = 0;
				var t = this;
				timer = setInterval(function() {
					ctr++;
					f.call(t, ctr);
					fireStep = 2;
					callback(ctr);
					if(ctr > 30) clearMousehold(); // timelimit if get stuck
				}, timeout);
			})

			clearMousehold = function() {
				clearInterval(timer);
				if (fireStep == 1) f.call(this, 1);
				fireStep = 0;
				console.log("off");
			}

			jQuery(this).on('mouseout touchmove',clearMousehold);
			jQuery(this).on('mouseleave touchcancel',clearMousehold);
			jQuery(this).on('mouseup touchend',clearMousehold);
		})
	}
}
