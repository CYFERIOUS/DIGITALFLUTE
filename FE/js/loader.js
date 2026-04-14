// JavaScript Document
var loaderFinished = false;

function init() {
	if (loaderFinished) {
		return;
	}
	loaderFinished = true;

	window.addEventListener('scroll', function () {
		if (typeof classie === 'undefined') {
			return;
		}
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 80,
			header = document.querySelector('header');
		if (!header) {
			return;
		}
		if (distanceY > shrinkOn) {
			classie.add(header, 'smaller');
		} else if (classie.has(header, 'smaller')) {
			classie.remove(header, 'smaller');
		}
	});

	try {
		if (window.jQuery) {
			$('#bigPapaLoader').fadeOut('slow');
		} else {
			var el = document.getElementById('bigPapaLoader');
			if (el) {
				el.style.display = 'none';
			}
		}
	} catch (e) {
		var fallback = document.getElementById('bigPapaLoader');
		if (fallback) {
			fallback.style.display = 'none';
		}
	}
}

function scheduleHideLoader() {
	setTimeout(init, 3000);
}

window.addEventListener('load', scheduleHideLoader);
// If a subresource or iframe never finishes, `load` may never fire — still remove the overlay.
setTimeout(init, 12000);
