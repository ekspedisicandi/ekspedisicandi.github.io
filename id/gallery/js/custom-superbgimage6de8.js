/*-----------------------------------------------------------------------------------
 	My Custom JS for SuperBgImage Script Wordpress Theme
-----------------------------------------------------------------------------------*/
/*
	1. =General Settings
*/

/* Init jQuery on page load */
jQuery(document).ready(function($) {

	/* check for touchable device */
	var isTouch =  false,
		click_event = 'click';

	if( jQuery('html').hasClass('touch') ){
		isTouch = true,
		click_event = 'click'; /* change click event for play button to touchstart */
	}

	/* defining some variables */
	var $fullsize       = jQuery('#fullsize'),
		$scrollerItems  = jQuery('#fullsize .item'),
		$cntItems       = $scrollerItems.length,
		$fullsizeTimer  = jQuery('#fullsizeTimer'),
		$fullsizeStart  = jQuery('#fullsizeStart'),
		$fullsizeStop   = jQuery('#fullsizeStop'),
		$togthumbs      = jQuery('#toggleThumbnails'),
		$thumbContainer = jQuery('#thumbnailContainer'),
	  	$colophon       = jQuery('#colophon'),
	  	thumbs_array 	= jQuery('#thumbnailContainer').find('a');


  	window.thumbnailsLoaded = false;

/*-----------------------------------------------------------------------------------*/
/*	1. =General Settings
/*-----------------------------------------------------------------------------------*/

	jQuery.fn.stopTimer = function() {

    /* check for CSS Transform with modernizr */
    if( !Modernizr.csstransitions ){
		  jQuery(this).stop().width(0);
		}else{
  		jQuery(this).stop().css({ 'transition': 'width 0 linear', width: 0 });
		}

	}

	jQuery.fn.startTimer = function( timer, resume ) {

		var elem = jQuery(this);

		if(resume){

			var left_duration = timer * ( jQuery(window).width() - elem.width() ) / jQuery(window).width();

			jQuery.fn.superbgimage.options.slide_interval = left_duration;

			elem.stop(true).animate({
				width:  jQuery(window).width()
			}, {
				duration: left_duration,
				specialEasing: {
					width: "linear"
				}
			});

		}else{

			if( jQuery.fn.superbgimage.options.slideshow == 1 || ( jQuery('#superbgimageplayer').hasClass('jwplayer_init') && jwplayer('superbgimageplayer').getState() == "PLAYING" ) ) {

				$actItem = jQuery('#fullsize .item.activeslide');
				$ind = 	jQuery('a.activeslide').index("#fullsize .item") + 1;

				if( $ind == 1){
					$fullsize.animate({ marginLeft: 0 });
				}

        /* check for CSS Transform with modernizr */
        if( !Modernizr.csstransitions ){

  				elem.css({ width: 0 }).stop(true).animate({
  					width: jQuery(window).width()
  				}, {
  					duration: timer,
  					specialEasing: {
  						width: "linear"
  					}
  				});

				} else {

          elem.css({ 'transition-duration': timer + "ms", width: jQuery(window).width() });

				}

			}

		}

	};

	jQuery.fn.pauseTimer = function( timer ){
		jQuery(this).stop(true);
		$fullsizeStart.show();
		$fullsizeStop.hide();
	}

	/* set position of controls */
	if(jQuery('#thumbnails').hasClass('centered')){
		jQuery('#thumbnails .controls').css({ right: 50 + "%", marginRight: -jQuery('#thumbnails .controls').outerWidth() / 2 });
	}

	jQuery('#fullsize .overlay').on('touchstart touchend', function(e) {
		e.preventDefault();
		jQuery(this).toggleClass('overlay-visible');
	});


	/* add hover effect to the thumbnails */
	jQuery('#fullsize a').on('mouseover mouseout', '.overlay', function(e){
		jQuery(this).toggleClass('overlay-visible');
	})

	jQuery(window).on('load', function() {

		// set the width for the thumbnails scroller
		setScrollerWidth( thumbs_array, 0 );

		// check to show images in viewport

		var images_to_load = jQuery('a.item img:not(img.loaded)', $fullsize);

		if ( images_to_load.length ) {
			images_to_load.each(function(){
				var a = jQuery(this).parent();
				if( a.position().left - a.width() <= $thumbContainer.width() ) {
					var img = jQuery(this);
					img.attr( 'src', img.data('src') ).addClass('loaded')
				}
			});
		}

		/* reset opacity and visibility */
		var anim_height = jQuery('#thumbnails').outerHeight( true ) + $colophon.outerHeight( true );

		/* scrollpane parts */
		var scrollPane = jQuery( "#thumbnailContainer" ),
			scrollContent = $fullsize;

		/* set height of containers */
	    /*
			jQuery('#thumbnails, #thumbnails .rel').css({
	  		height: jQuery('#fullsize a:first img').outerHeight() + parseInt(jQuery('#fullsize').css('margin-top')) * 2
			})
	    */

		var slide_handler = function(e, ui) {

			if ( scrollContent.width() > scrollPane.width() ) {

				var scroll_margin = ui.value / 100 * ( scrollPane.width() - scrollContent.width() );

				scrollContent.css( "margin-left", Math.round( scroll_margin ) + "px" );

				// check to show images in viewport
				jQuery('a.item img:not(img.loaded)', $fullsize).each(function(){
					var img = jQuery(this);
					img.not('img.loaded').attr( 'src', img.data('src') ).addClass('loaded')
				});

				setScrollerWidth( thumbs_array, 0 );

			} else {

				scrollContent.css( "margin-left", 0 );

			}
		};

		/* build slider */
		var scrollbar = jQuery( ".scroll-bar" ).slider({
			slide: slide_handler,
			change: slide_handler
		});

		jQuery('.scroll-content-item:last').css({marginRight: 0});

		if(!isTouch){

	  		if( !jQuery('#thumbnails').hasClass('mouse-scrub') ){

	  			/* Mousewheel plugin */
	  			scrollPane.mousewheel(function(event, delta) {
	  				var value = scrollbar.slider('option', 'value');

	  				if (delta > 0) { value -= 1.25; }
	  				else if (delta < 0) { value += 1.25; }

	  				/* Ensure that its limited between 0 and 100 */
	  				value = Math.max( 0, Math.min( 100, value) );
	  				scrollbar.slider( 'option', 'value', value );

	  				event.preventDefault();
	  			});

	  		}

	  		jQuery("#scroll_right").on('mouseover', function(){

				timer = setInterval(function() {

					jQuery("#scroll_left").removeClass('disabled');

					var speed = parseInt(2);
					var slider = jQuery('.scroll-bar');
					var curSlider = slider.slider("option", "value");
					curSlider += speed; /* += and -= directions of scroling with arrows */

					if (curSlider > slider.slider("option", "max")){
						jQuery("#scroll_right").addClass('disabled');
						curSlider = slider.slider("option", "max");
					} else if (curSlider < slider.slider("option", "min")){
						curSlider = slider.slider("option", "min");
					}else{

					}
					slider.slider("value", curSlider);

				}, 25);

	  		});

	  		jQuery("#scroll_right").on('mouseout', function() {
	  			clearInterval(timer);
	  		});

	  		jQuery("#scroll_left").on('mouseover', function(){

	  		  timer = setInterval(function() {

	  				jQuery("#scroll_right").removeClass('disabled');

	  				var speed = parseInt(2);
	  				var slider = jQuery('.scroll-bar');;
	  				var curSlider = slider.slider("option", "value");
	  				curSlider -= speed; /* += and -= directions of scroling with arrows */

	  				if (curSlider > slider.slider("option", "max")){
	  					curSlider = slider.slider("option", "max");
	  				}else if (curSlider < slider.slider("option", "min")){
	  					jQuery("#scroll_left").addClass('disabled');
	  						curSlider = slider.slider("option", "min");
	  				}

	  				slider.slider("value", curSlider);

	  			}, 25);

	  		});

	  		jQuery("#scroll_left").on('mouseout', function() {
	  				clearInterval(timer);
	  		});

	    }

	});

	function setScrollerWidth( elements, original, return_only ){

		var contWidth = original;

		// loop through image files and add it's width to contWidth
		elements.each(function() {
			contWidth = contWidth + jQuery(this).outerWidth(true);
		})

		// break the function and return the contWidth
		if( return_only ) {
			return contWidth;
		}

		if( contWidth > jQuery( '#thumbnails .rel' ).width() ){
			jQuery( '#thumbnails .pulldown-items' ).width( contWidth + 5 );
			if(!isTouch) jQuery( '#thumbnails .scroll-link' ).addClass('scroll-visible');
		}else{
			jQuery( '#thumbnails .rel' ).css({ padding: 0 });
		}

		var origWidth    = jQuery(".scroll-bar").width(); /* read the original slider width */
		var sliderWidth  = origWidth - 200; /* the width through which the handle can move needs to be the original width minus the handle width */
		var sliderMargin =  ( origWidth - sliderWidth )*0.5; /* so the slider needs to have both top and bottom margins equal to half the difference */
		jQuery(".scroll-bar-wrap").css({ width:sliderWidth, marginRight: sliderMargin }); /* set the slider height and margins */
	}

	/* Show or hide scrolling on window resize */
	jQuery(window).smartresize(function(){

		var contWidth = setScrollerWidth( thumbs_array, 0, true );

		if( contWidth > jQuery( '#thumbnails' ).width() ){
			jQuery( '#thumbnails .pulldown-items' ).width( contWidth );
			if(!isTouch) jQuery( '#thumbnails .scroll-link' ).addClass('scroll-visible');
		}else{
			if(!isTouch) jQuery( '#thumbnails .scroll-link' ).removeClass('scroll-visible')
			jQuery( '#thumbnails .pulldown-items' ).css( "margin-left", 0 );
		}

		// check to show images in viewport
		var images_to_load = jQuery('a.item img:not(img.loaded)', $fullsize);

		if ( images_to_load.length ) {

			images_to_load.each(function(){
				var img = jQuery(this);
				img.not('img.loaded').attr( 'src', img.data('src') ).addClass('loaded')
			});

			setScrollerWidth( thumbs_array, 0 );

		}

		/* refresh the myScroll script */
		if(isTouch){
			myScrollRefresh();
		}

	});

	/* initialize SuperBGImage */
	$fullsize.superbgimage();

	/* prev slide */
	var fullsizePrev = jQuery('#thumbnails a.fullsize-prev, .fsg-arrows a.fsg-arrows-prev').livequery( click_event,function(e) {
		perform_prevAnimation($fullsize, $fullsizeTimer);
		e.preventDefault();
		return false;
	});

	/* Function to bind the home touchswipe action on the background */
	if( jQuery().swipe ) {

  	$.fn.addFullsizeTouchswipe = function(){
  		jQuery(this).swipe({
  			threshold: 50,
  			swipe: function(event, direction, distance, duration, fingerCount) {

  				if( fingerCount == 1 ){ /* one finger touch gestures */

  					/* show next Slideshow Image if swipe left */
  					if( 'left' === direction ) {
  						perform_nextAnimation();
  					}

  					/* show next Slideshow Image if swipe right */
  					if( 'right' === direction ){
  						perform_prevAnimation( $fullsize, $fullsizeTimer );
  					}

  					/* hide Thumbnails */
  					if( 'down' === direction ){
  						$togthumbs.toggleThumbnails('hide');
  					}

  					/* show thumbnails */
  					if( 'up' === direction ){
  						$togthumbs.toggleThumbnails('show');
  					}

  				}

  				if( fingerCount == 2 ){ /* two finger touch gestures */

  					if( 'up' === direction && true === window.allElementsVisible ) {
  						$expander.hideAllElements('hide', 1);
  					}

  					if( 'down' === direction && false === window.allElementsVisible ) {
  						$expander.hideAllElements('show', 1);
  					}

  				}

  			},
  			fingers: 'all',
  			allowPageScroll: 'none'
  		});
  	};

  	/* check for touch devices */
  	if(isTouch){
  		/* add the touchswipe events */
  		jQuery("#superbgimage, #scanlines, #page").swipe("destroy");
  		jQuery("#superbgimage, #scanlines, #page").addFullsizeTouchswipe();
    }

  }

	/* prev animation function */
	function perform_prevAnimation($fullsize, $fullsizeTimer){

		jQuery('#superbgimageplayer').html();
		jQuery('#startInterval').val("start");

		$fullsizeTimer.stopTimer();
		$fullsize.prevSlide();

		if(jQuery.fn.superbgimage.options.slideshow == 1){
			$fullsize.startSlideShow();
		}else{
			$fullsize.stopSlideShow();
		}

	}

	/* next slide */
	var fullsizeNext = jQuery('#thumbnails a.fullsize-next, .fsg-arrows a.fsg-arrows-next').livequery(click_event,function() {
		perform_nextAnimation();
		return false;
	});

	/* next animation function */
	function perform_nextAnimation(){

		jQuery('#superbgimageplayer').html();

		jQuery('#startInterval').val("start");

		$fullsizeTimer.stopTimer();
		$fullsize.nextSlide();

		if(jQuery.fn.superbgimage.options.slideshow == 1){
			$fullsize.startSlideShow();
		}else{
			$fullsize.stopSlideShow();
		}

	}

	/* mouse move scroller */
	if( jQuery('#thumbnails').hasClass('mouse-scrub') ){

		/* Get our elements for faster access and set overlay width */
		var div = jQuery('#thumbnailContainer'),
		ul = jQuery('#fullsize'),

		ulPadding = 15;

		/* remove scrollbars */
		div.css({overflow: 'hidden'});

		/* find last image container */
		var lastLi = jQuery('a',ul).filter(":last");

		/* When user move mouse over menu */
		div.mousemove(function(e){

	      /*
			As images are loaded ul width increases,
			so we recalculate it each time
	      */

	  		/* Get menu width */
	  		var divWidth = div.width();

			var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + ulPadding;
			var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;

			div.scrollLeft(left);

			// check to show images in viewport
			var images_to_load = jQuery('a.item img:not(img.loaded)', $fullsize);

			if ( images_to_load.length ) {

				images_to_load.each(function(){
					var img = jQuery(this);
					img.not('img.loaded').attr( 'src', img.data('src') ).addClass('loaded')
				});

				setScrollerWidth( thumbs_array, 0 );

			}

		});

	}

	/* keypress navigation */
	if( jQuery('#thumbnails').hasClass('key-nav') && jQuery('a.item', $fullsize).size() > 1 ){
		jQuery(document).keydown(function (e) {

			var keyCode = e.keyCode || e.which,
				arrow = {left: 37, up: 38, space: 32, right: 39, down: 40 };

				switch (keyCode) {
					case arrow.left:

						perform_prevAnimation($fullsize, $fullsizeTimer);

					break;

					case arrow.up:

						$togthumbs.toggleThumbnails('show');

					break;

					case arrow.right:

						perform_nextAnimation();

					break;

					case arrow.down:

						$togthumbs.toggleThumbnails('hide');

					break;

				}

		});
	}else{
  		jQuery('#fullsizeKeynav').hide();
	}

	/* Mouse leave/enter Thumbnails */
	if( jQuery('#thumbnails').hasClass('mouse-leave') ){

		jQuery('#colophon, #thumbnails').on('mouseenter', function(e){
      var thumbnails = jQuery('#thumbnails'),
			    fotBot     = parseInt( $colophon.css('bottom') ),
          botAni     = $colophon.outerHeight();

			if( fotBot < 0 || $colophon.hasClass('footer-hide') ){
				botAni = 0;
			}

      if( !Modernizr.csstransitions ){
        thumbnails.stop().animate({ bottom: botAni });
      }else{
        thumbnails.removeClass('thumbs-collapsed').css({ bottom: 0, 'transform': 'translate3d(0, ' + botAni * - 1 + 'px, 0)' });
      }

		});

		jQuery('#thumbnails').on('mouseleave', function(e){

			var thumbnails = jQuery('#thumbnails'),
				  fotBot     = parseInt( $colophon.css('bottom') ),
          botAni     = $colophon.outerHeight();

			if( fotBot < 0 || $colophon.hasClass('footer-hide') ){
				botAni = 0;
			}

      if( !Modernizr.csstransitions ){
			  thumbnails.stop().animate({ bottom: -thumbnails.outerHeight() + botAni + thumbnails.find('.controls').outerHeight() });
      }else{
        var translateY = thumbnails.outerHeight( true ) - parseInt( thumbnails.css('padding-top'), 10) - botAni;
  			thumbnails.addClass('thumbs-collapsed').css({ bottom: 0, 'transform': 'translate3d(0, '+ (translateY) +'px, 0)' });
  		}


		});

	}

	/* new myScroll touch scrolling */
	if(isTouch){

	    if( jQuery('#thumbnailContainer').length ) {

	      var myScroll;

	      function myScrollLoaded() {
	      	setTimeout(function () {
	    		myScroll = new iScroll('thumbnailContainer', {
	            hScrollbar: false,
	            vScrollbar: false,
	            vScroll: false,
	            onBeforeScrollMove: function() {

	              	jQuery('#fullsize .overlay').show();

	            },
	            onTouchEnd : function(){

					jQuery('#fullsize .overlay').hide();

					// check to show images in viewport
					var images_to_load = jQuery('a.item img:not(img.loaded)', $fullsize);

					if ( images_to_load.length ) {

						images_to_load.each(function(){
							var img = jQuery(this);
							img.not('img.loaded').attr( 'src', img.data('src') ).addClass('loaded')
						});

					}

					setScrollerWidth( thumbs_array, 0 );

	            }
	          });
	        }, 100);
	      }

	      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	      window.addEventListener('load', myScrollLoaded, false);

	      function myScrollRefresh() {
	       	setTimeout(function() {
	       		myScroll.refresh();
	       	}, 0);
	      };

	    }

	}

})