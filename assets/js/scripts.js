

var slidePositions = [350, 630, 890, 1060, 1295]
var progressLocs = [];

jQuery(function($) {


$(document).ready(function() {
	
	setSVGDimensions();
	
	
	if ($('body').hasClass('home')) {
		initFrontpage();
	}
	
	if ($('body').hasClass('page-template-page-progress-php')) {
		initProgress();
	}
	
	if ($('body').hasClass('page-template-page-work-php')) {
		initWork();
	}
	
	$('#menu_toggle').click(function(e) {
		e.preventDefault();
		$('#main-nav .nav').slideToggle();
		$('#menu_close').toggle();
	});
	
	$('#menu_close').click(function(e) {
		e.preventDefault();
		$('#main-nav .nav').slideToggle();
		$('#menu_close').hide();
	});
	
	
	// smoothscrolling
	// http://css-tricks.com/snippets/jquery/smooth-scrolling/
	$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});
	
	// wookmark masonry
	(function ($){
      $('#tiles').imagesLoaded(function() {
        // Prepare layout options.
        var options = {
          autoResize: true, // This will auto-update the layout when the browser window is resized.
          container: $('#main'), // Optional, used for some extra CSS styling
          offset: 30, // Optional, the distance between grid items
          itemWidth: 325, // Optional, the width of a grid item
          flexibleWidth: '50%',
          fillEmptySpace: false, // Optional, fill the bottom of each column with widths of flexible height
          ignoreInactiveItems: false,
          comparator: function(a, b) {
            return $(a).hasClass('inactive') && !$(b).hasClass('inactive') ? 1 : -1;
          }
        };

        // Get a reference to your grid items.
        var handler = $('#tiles li'),
            filters = $('#filters li');

        // Call the layout function.
        handler.wookmark(options);

        /**
         * When a filter is clicked, toggle it's active state and refresh.
         */
        var onClickFilter = function(event) {
          var item = $(event.currentTarget),
              activeFilters = [];
          item.toggleClass('active');

          // Collect active filter strings
          filters.filter('.active').each(function() {
            activeFilters.push($(this).data('filter'));
          });

          handler.wookmarkInstance.filter(activeFilters, 'or');
        }

        // Capture filter click events.
        filters.click(onClickFilter);
      });
    })(jQuery);
    
    // fancybox for masonry tiles
   $(".fancybox").fancybox({
		maxWidth	: 900,
		maxHeight	: 700,
		fitToView	: true,
		width		: '70%',
		height		: '70%',
		autoSize	: false,
		autoScale   : true,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none'
	});
	
	// Setting volume for bg audio
	if( $('#bg-audio').length ) {
		myAudio=document.getElementById("bg-audio");
		myAudio.volume=0.2;	
	}
	
	// toggle audio
	// http://ftutorials.com/html5-audio/
	$('.volume').toggle(
	function () {
		document.getElementById('bg-audio').pause();
	},
	function () {
		document.getElementById('bg-audio').play();
	});
	
	$('.vidreview').click(
	function () {
		document.getElementById('bg-audio').pause();
	});
	
	loadGravatars();
	
}); /* end of as page load scripts */


$(window).resize(function(){
	setSVGDimensions();
});


//our work page navigation
function initWork() {
	$window = $(window);
	
	//intro SVG animation
	var s = Snap(".watery");
	s.animate({strokeDashoffset: slidePositions[0]}, 4000);
	
	var locs = [0];
	$('section.content-section').each(function() {
		var offset = $(this).offset();
		var adjusted = offset.top - ($window.height() / 2);
		locs.push(adjusted);
	});
	
	//animate river as page scrolls
	currentIndex = 0;
	$(window).scroll(function(){
		var top = $window.scrollTop();
		var closest = getClosestValues(locs, top);
		var closestIndex = locs.indexOf(closest);
		
		if (currentIndex != closestIndex) {
			s.animate({strokeDashoffset: slidePositions[closestIndex]}, 4000);
			currentIndex = closestIndex;
		}
	});
	
	//button navigation
	$('#work-nav .nav-dot, #work-nav .text').click(function(e) {
		e.preventDefault();
		var target = $(this).attr('data-target');
		
		if (target != undefined) {
			$('html, body').animate({
		        scrollTop: $("#"+target).offset().top
		    }, 1000);
		}
	});
	
}


//get the closest lowest and highest values
function getClosestValues(a, x) {
    var lo = -1, hi = a.length;
    while (hi - lo > 1) {
        var mid = Math.round((lo + hi)/2);
        if (a[mid] <= x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (a[lo] == x) hi = lo;
    return a[lo];
}


//progress page navigation and slideshow
function initProgress() {
	
	setButtonLocations();
	
	$('#progress-prev').click(function(e) {
		e.preventDefault();
		progress('previous');
	});
	
	$('#progress-next').click(function(e) {
		e.preventDefault();
		progress('next');
	});
	
	$('#progress-nav ul a').click(function(e) {
		e.preventDefault();
		progress($(this).parent().index());
	});
	
	console.log( progressLocs[0]);
	
	var s = Snap(".water");
	s.animate({strokeDashoffset: progressLocs[0]},3000);
	
	if ((typeof timerProgress !== "undefined")) {
		clearTimeout ( timerProgress );
	}
	timerProgress = setTimeout('progress()',10000);
	
}


//set the locations for buttons on the progress timeline
function setButtonLocations() {
	
	var $window_width = $(window).width();
	
	$('#progress-nav ul a').each(function() {
		var offset = $(this).offset();
		var loc = ((1714 * offset.left) / $window_width) + 50;
		progressLocs.push(loc);
	});
}


function initFrontpage() {
	
	//intro SVG animation
	var s = Snap(".watery");
	s.animate({strokeDashoffset: slidePositions[0]}, 4000);
	
	$('#logo, #main-nav li').hide();
	//page elements setup
	setTimeout(function() { 
		$('#main-nav li').fadeIn(2000);
		$('#logo').fadeIn(2000); 
	}, 2500);
	
	
	//slides setup
	$('#slides .slide').height($(window).height() - $('.footer').height());	
	$('#slides .slide.start').css({'opacity':1}).removeClass('start');
	$('#slides .slide .fade-first, #slides .slide .fade-second, #slides .slide .blur').css({'opacity':0});
	
	//intro slide
	setTimeout(function() { 
		$('#slides .slide.show .fade-first').animate({opacity: 1.0}, 1000);
	}, 1000);
	
	
	//homepage navigation
	$('#nav-dots .nav-dot, #nav-dots .text').click(function(e) {
		e.preventDefault();
		var target = $(this).attr('data-slide');
		gallery(target);
	});
	$('#mobile-nav-dots .nav-dot').click(function(e) {
		$('#nav-dots span').removeClass( 'nav-dot-current' );
		$(this).addClass( 'nav-dot-current' );
		gallery($(this).index());
	});
	
	//(re)setup slideshow timer when images are loaded
	$('#slides').imagesLoaded(function() {
		
		
		setTimeout(function() { 
			$('#slides .slide.show .fade-second').animate({opacity: 1.0}, 1000);
		}, 4000);
		
		setTimeout(function() { 
			$('#slides .slide.show .bg-img.blur').animate({opacity: 1}, 2000);
		}, 3000);
		
		if ((typeof timerSlideshow !== "undefined")) {
			clearTimeout ( timerSlideshow );
		}
		timerSlideshow = setTimeout('gallery()',8000);
	});
}



//set SVG height/width
function setSVGDimensions() {
	var $window = $(window);
	var newheight = $window.height();
	var newwidth = $window.width();      
	$("#the_river_menu_home").height(newheight);
	$("#the_river_menu_progress").width(newwidth);
}


}); //end jquery wrapper




function gallery(target) {
	
	jQuery(function($) {
		$slides = $('#slides');	
		
		//timer
		if ((typeof timerSlideshow !== "undefined")) {
			clearTimeout ( timerSlideshow );
		}
		timerSlideshow = setTimeout('gallery()',10000);
		
		//if no elements have the show class, grab the first image
		var current = ($slides.find('.slide.show') ?  $slides.find('.slide.show') : $slides.find('.slide:first'));		
		
		
		if (current.index() != target) {
			if (target == 'previous') {
				var next = ((current.prev().length) ? ((current.prev().hasClass('caption'))? $slides.find('.slide:last') :current.prev()) : $slides.find('.slide:last'));
			}
			else if (!isNaN(parseFloat(target)) || target == 0) {
				//load target image
				var next = $slides.find('.slide:eq('+target+')');
			} else {
				//load next image
				var next = ((current.next().length) ? ((current.next().hasClass('caption')) ? $slides.find('.slide:first') :current.next()) : undefined);
			}
			
			//if not at end of slideshow, continue
			if (next != undefined) {
				
				//animate water svg to target
				var s = Snap(".watery");
				s.animate({strokeDashoffset: slidePositions[next.index()]}, 4000);
				
				//reset styles for animations
				next.find('.fade-first').css({'opacity':0});
				next.find('.fade-second').css({'opacity':0});
				next.find('.bg-img.blur').css({'opacity':0});
				
				//start video
				if (next.find('#slide_video').length) {
					next.find('#slide_video').get(0).play();
				}
				
				//show next slide
				next.css({opacity: 0.0}).addClass('show').animate({opacity: 1.0}, 1000);
			
				//hide current slide
				current.animate({opacity: 0.0}, 1000).removeClass('show');
				
				//navigation
				$('#mobile-nav-dots span').removeClass( 'nav-dot-current' );
				$('#mobile-nav-dots span').eq(next.index()).addClass( 'nav-dot-current' );
				
				//internal animations
				setTimeout(function() { 
					$slides.find('.slide.show .fade-first').animate({opacity: 1.0}, 1000);
				}, 3000);
				
				setTimeout(function() { 
					$slides.find('.slide.show .fade-second').animate({opacity: 1.0}, 1000);
				}, 5000);
				
				setTimeout(function() { 
					$slides.find('.slide.show .bg-img.blur').animate({opacity: 1}, 1000);
				}, 2000);
				
			} else {
				clearTimeout ( timerSlideshow );
			}
			
		}
	});
}



function progress(target) {
	
	jQuery(function($) {
		$slides = $('#progress');	
		
		//if no elements have the show class, grab the first image
		var current = ($slides.find('.slide.show') ?  $slides.find('.slide.show') : $slides.find('.slide:first'));
		
		if (current.index() != target) {
			if (target == 'previous') {
				var next = ((current.prev().length) ? ((current.prev().hasClass('caption'))? $slides.find('.slide:last') :current.prev()) : $slides.find('.slide:last'));
			}
			else if (!isNaN(parseFloat(target)) || target == 0) {
				//load target image
				var next = $slides.find('.slide:eq('+target+')');
			} else {
				//load next image
				var next = ((current.next().length) ? ((current.next().hasClass('caption')) ? $slides.find('.slide:first') :current.next()) : $slides.find('.slide:first'));
			}
			
			//animate water svg to target
			var s = Snap(".water");
			s.animate({strokeDashoffset: progressLocs[next.index()]},3000);
			
			//show next slide
			next.css({opacity: 0.0}).addClass('show').animate({opacity: 1.0}, 1000);
		
			//hide current slide
			current.animate({opacity: 0.0}, 1000).removeClass('show');
			
			//navigation
			$('#progress-nav ul a').removeClass('active');
			$('#progress-nav ul a').eq(next.index()).addClass('active');
			
			if ((typeof timerProgress !== "undefined")) {
				clearTimeout ( timerProgress );
			}
			timerProgress = setTimeout('progress()',10000);
			
		}
	});
}





/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y }
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;



function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function

