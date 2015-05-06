jQuery(function($) {


	var scroll_left = jQuery("#scroll_left"),
		scroll_right = jQuery("#scroll_right");

	$([scroll_left, scroll_right]).each(function() {
		$(this).on('click', function() {
			return false;
		});
	});

	// check for touchable device
	var isTouch =  false;
	if( jQuery('html').hasClass('touch') ){
		isTouch = true;
	}

	// remove preloader
	if( jQuery('#max-preloader').size() > 0 ) {
		jQuery('#max-preloader').remove();
	}

    // block UI to make the thumbnails unclickable until masonry is loaded
    $('#primary').block({
      message: $('#my-loading'),
      overlayCSS:  {
        backgroundColor: 'transparent',
        opacity: 0.5,
        cursor: 'wait'
      }
    });

	//scrollpane parts
	var scrollPane       = jQuery( ".scroll-pane" ),
	scrollContent        = jQuery( ".scroll-content" ),
	$items               = jQuery('li.item img', scrollPane),
	responsive_viewport  = { "width": jQuery(window).width(), "height": jQuery(window).height() }, // getting changed viewport dimensions
	scroller_cont_height = 240; // the default container height for mobile devices

    if( responsive_viewport.width >= 480 ){
      // set the height of the container
      scroller_cont_height = responsive_viewport.height - scrollPane.offset().top - jQuery('#colophon').outerHeight() - parseInt(scrollPane.css('padding-bottom'),10) - 1;
    }

    // set the scroll pane height
    scrollPane.height( scrollPane.offset().top );

	// set scrollInterval
	var scrollInterval = 25, // scroll steps in px
		timer_speed    = 15; // scroll timer speed in milliseconds

	// show scroll arrows on hover
	scrollPane.hover(
		function(){
			jQuery(".scroller-arrow:not(.disabled)").stop(false, true).fadeIn();
		},
		function(){
			jQuery(".scroller-arrow:not(.disabled)").stop(false, true).fadeOut();
		}
	);

		var speed = 0;

		function prepareScrollerComponents() {

      var responsive_viewport = { "width": jQuery(window).width(), "height": jQuery(window).height() };
      var img_height          = 240;

      // we are on larger devices
      if( responsive_viewport.width >= 320  ){

          // set the height of the container
          img_height = responsive_viewport.height - scrollPane.offset().top - jQuery('#colophon').outerHeight() - parseInt(scrollPane.css('padding-bottom'),10) - 1;

      }

      // use default max height
      if( img_height >= maxframe.scroller_height && maxframe.scroller_height != 0 ) {
        img_height = maxframe.scroller_height;
      }

      if( responsive_viewport.height <= 480 ){
        img_height = 240;
      }

      // start to calculate the slider width if height is ready
      $items.promise().done(function() {

  			if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
  				jQuery("#scroll_left, #scroll_right").css({ display: 'block' });
  			}

        $items.each(function(){
           jQuery(this).height( img_height );
           jQuery(this).css({ maxWidth: 'none'});
        })

  			$cw = 0;
  			jQuery('li.item', scrollContent).each(function(){
  				$cw = $cw + jQuery(this).outerWidth(true);
  			})

  			scrollContent.width( $cw + 1 );

  			// calculate the scrolling speed
  			speed = (scrollInterval * 100) / $cw;

  			setScrollerWidth();

  			if(isTouch === false){
  				scrollbar.slider('option', 'value', 0);
  			}

  			scrollContent.css({ visibility: 'visible' });
  			scrollPane.css({ height: img_height });

  		})

		}

		$items.imagesLoaded(function(){

			prepareScrollerComponents();

		});

		jQuery(window).smartresize(function(){

			prepareScrollerComponents();

		});


		var slide_handler = function(e, ui) {

			if(isTouch === false){

				if(ui.value == 0){
					scroll_left.addClass('disabled').stop(false, true).fadeOut();
					scroll_right.removeClass('disabled').stop(false, true).fadeIn();
				}

				if(ui.value > 0 && ui.value < 100){
					scroll_left.removeClass('disabled').stop(false, true).fadeIn();
					scroll_right.removeClass('disabled').stop(false, true).fadeIn();
				}
				if(ui.value == 100){
					scroll_left.removeClass('disabled').stop(false, true).fadeIn();
					scroll_right.addClass('disabled').stop(false, true).fadeOut();
				}

			}

			if ( scrollContent.width() > scrollPane.width() ) {
				scrollContent.css( "margin-left", Math.round(
					ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
				) + "px" );


        if(ui.value > 0) {
			jQuery('.tofront').fadeIn(250, function(){ $(this).on('click', function() { scrollbar.slider('option', 'value', 0) }); })
        }else{
          jQuery('.tofront').fadeOut();
        }

			} else {
				scrollContent.css( "margin-left", 0 );
			}
		};

		//build slider
		if(isTouch === false){
			var scrollbar = jQuery( ".scroll-bar" ).slider({
				slide: slide_handler,
				change: slide_handler
			});
		}

	jQuery('.scroll-content-item:last').css({marginRight: 0});

	jQuery(window).load(function(){

		if(isTouch === false){

			// Mousewheel plugin
			jQuery(scrollPane).add(jQuery(scrollPane).find('li')).mousewheel(function(event, delta) {
				var value = scrollbar.slider('option', 'value');

				if (delta >= 0) { value -= speed; }
				else if (delta <= 0) { value += speed; }

				// Ensure that its limited between 0 and 100
				value = Math.max(0, Math.min(100, value));

				scrollbar.slider('option', 'value', value);

				event.preventDefault();

			});

		}

		// unblock primary container
		$('#primary').unblock();

	});

	// trigger for scroll right event
	$.fn.mouseenter_trigger_right = function(){

		var maxWidth = ( scrollContent.width() - jQuery(window).width() ) * -1 ;

		timer = setInterval(function() {

			scroll_left.removeClass('disabled').stop(false, true).fadeIn();

			var slider = jQuery('.scroll-bar');
			var curSlider = slider.slider("option", "value");
			curSlider += speed; // += and -= directions of scroling with MouseWheel

			// Ensure that its limited between 0 and 100
			curSlider = Math.max(0, Math.min(100, curSlider));

			if (curSlider > slider.slider("option", "max")){
				scroll_right.addClass('disabled');
				curSlider = slider.slider("option", "max");
			} else if (curSlider < slider.slider("option", "min")){
				curSlider = slider.slider("option", "min");
			}else{

			}

			scrollbar.slider('option', 'value', curSlider);

		}, timer_speed);

	}

	// trigger for scroll left event
	$.fn.mouseenter_trigger_left = function(){

		timer = setInterval(function() {

			scroll_right.removeClass('disabled');

			var slider = jQuery('.scroll-bar');;
			var curSlider = slider.slider("option", "value");
			curSlider -= speed; // += and -= directions of scroling with MouseWheel

			// Ensure that its limited between 0 and 100
			curSlider = Math.max(0, Math.min(100, curSlider));

			if (curSlider > slider.slider("option", "max")){
				curSlider = slider.slider("option", "max");
			}else if (curSlider < slider.slider("option", "min")){
				scroll_left.addClass('disabled');
				curSlider = slider.slider("option", "min");
			}

			scrollbar.slider('option', 'value', curSlider);

		}, timer_speed);


	}


	if( isTouch === false ){

		scroll_right.mouseenter(function(){
			jQuery(this).mouseenter_trigger_right();
		});

		scroll_left.mouseenter(function(){
			jQuery(this).mouseenter_trigger_left();
		});

		jQuery("#scroll_right, #scroll_left").mouseleave(function() {
			clearInterval(timer);
		});

	}

	function setScrollerWidth(){
		var origWidth = jQuery(".scroll-bar").width();//read the original slider width
		var sliderWidth = origWidth;//the width through which the handle can move needs to be the original width minus the handle width
		var sliderMargin =  (origWidth - sliderWidth) * 0.5;//so the slider needs to have both top and bottom margins equal to half the difference
		jQuery(".scroll-bar-wrap").css({ paddingRight: jQuery('.scroll-bar .ui-slider-handle').width() });//set the slider height and margins
		jQuery(".scroll-bar").css({ right: jQuery('.scroll-bar .ui-slider-handle').width() })

		jQuery('.scroll-bar .ui-slider-handle').text('::');

	}

	// Show the scroll-bar-wrap when all images are loaded
	jQuery('#portfolioList img').imagesLoaded(function(){
		jQuery('.scroll-bar-wrap').show();
	})

  if(isTouch) {
    // new myScroll touch scrolling
    var myScroll;
    function myScrollLoaded() {
    	setTimeout(function () {
  		  myScroll = new iScroll('customScroller', {
          hScrollbar: false,
          vScrollbar: false,
          onBeforeScrollMove: function() {
            jQuery('#customScroller .overlay').show();
          },
          onTouchEnd : function(){
            jQuery('#customScroller .overlay').hide();
          },
          vScroll: false,
          onBeforeScrollStart: function ( e ) {
            if ( this.absDistX > (this.absDistY + 5 ) ) {
              // user is scrolling the x axis, so prevent the browsers' native scrolling
              e.preventDefault();
            }
          }
        });
      }, 100);
    }
    window.addEventListener('load', myScrollLoaded, false);

    function myScrollRefresh() {
     	setTimeout(function() {
     		myScroll.refresh();
     	}, 0);
    };
  }


  // Listen for orientation changes
  window.addEventListener("orientationchange", function() {
  	// Announce the new orientation Number
  	prepareScrollerComponents();
  }, false);

});
