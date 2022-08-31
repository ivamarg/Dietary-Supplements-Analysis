(function($) {
"use strict";

/**
 * Swiper
 */
$('.swiper').each(function() {
	var self = $(this),
		wrapper = $('.swiper-wrapper', self),
		optData = eval('(' + self.attr('data-options') + ')'),
		optDefault = {
			paginationClickable: true,
			pagination: self.find('.swiper-switch'),
			nextButton: self.find('.swiper-button-next-custom'),
			prevButton: self.find('.swiper-button-prev-custom'),
			spaceBetween: 30
		},
		options = $.extend(optDefault, optData);
	wrapper.children().wrap('<div class="swiper-slide"></div>');
	var swiper = new Swiper(self, options);

function thumbnails(selector) {

if (selector.length > 0) {
			var wrapperThumbs = selector.children('.swiper-wrapper'),
				optDataThumbs = eval('(' + selector.attr('data-options') + ')'),
				optDefaultThumbs = {
					spaceBetween: 10,
					centeredSlides: true,
					slidesPerView: 3,
					touchRatio: 0.3,
					slideToClickedSlide: true,
					pagination: selector.find('.swiper-switch'),
					nextButton: selector.find('.swiper-button-next-custom'),
					prevButton: selector.find('.swiper-button-prev-custom'),
				},
				optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);
			wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
			var swiperThumbs = new Swiper(selector, optionsThumbs);
			swiper.params.control = swiperThumbs;
			swiperThumbs.params.control = swiper;
		}

}
	thumbnails(self.next('.swiper'));
});


//*
// Header
//*

var wh = $(window).height(),
    half = wh / 2,
    headerHeight = $('header').outerHeight();

$(window).scroll(function() {
	var scrollTop = $(window).scrollTop();

if(scrollTop >=  half) {
		$('header').addClass('is-scroll');
	}else {
		$('header').removeClass('is-scroll');
	}

});

$('.onepage-nav').dropdownMenu({
    menuClass: 'onepage-menu',
    breakpoint: 1200,
    toggleClass: 'active',
    classButtonToggle: 'navbar-toggle',
    subMenu: {
        class: 'sub-menu',
        parentClass: 'menu-item-has-children',
        toggleClass: 'active'
    }
});

$('.onepage-nav').onePageNav({
    currentClass: 'current-menu-item',
    scrollOffset: headerHeight,
});


//*
// Back to top
//*


$(window).scroll(function() {
	var wh = $(window).height(),
		scrollTop = $(window).scrollTop();

if(scrollTop >= wh ){
		$('#back-to-top').addClass('is-visible')
	}else {
		$('#back-to-top').removeClass('is-visible')
	}
});

var headerHeight = $('header').outerHeight();

$('#back-to-down').on('click', function() {
	var offsets = $(this).closest('.hero').next().offset().top - headerHeight;

$('html,body').animate({
        scrollTop: offsets
    }, 700);
})

})(jQuery);

