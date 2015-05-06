/*-----------------------------------------------------------------------------------
 	My Custom JS for Invictus WordPress Theme
-----------------------------------------------------------------------------------*/
/*
  0.    = Main Variable settings
  1.    = General Settings
  2.    = Setup Supefish Pulldown menu
  3.    = Setup Portfolio hover
  4.    = Init Tipsy Tooltips on Elements with class .tooltip
  5.    = Shortcode JS
  6.    = Contact Form Validation
  7.    = Hide all Elements	window.thumsVisible = true;
  8.    = Hide Thumbnails
  9.    = Back-to-top
  10.   = Responsive jQuery
  11.   = Init fitvids if needed
  12.   = PrettyPhoto Init
  13.   = on window load events
  14.   = Splashscreen
  15.   = Mobile Menu
  16.   = Image grayscale
  17.   = Background Image Animation
  18.   = ImagesLoaded Plugin
  19.   = pngFix Plugin
  20.   = iOS orientationchange
  21.   = Smartresize Plugin
  22.   = ClassIE Plugin
  23.   = Grayscale IE10+
*/

// Init jQuery on page load
jQuery(document).ready(function($) {

/*-----------------------------------------------------------------------------------*/
/*	0. =Main Variable settings
/*-----------------------------------------------------------------------------------*/

	var isTouch     = false, // check for touchable device
  		$brand      = jQuery('#branding'),
  		$thumbs     = jQuery('#thumbnails'),
  		$colophon   = jQuery('#colophon'),
  		$togthumbs  = jQuery('#toggleThumbs'),
  		$expander   = jQuery('#expander'),
  		$main       = jQuery('#main'),
  		$primary    = jQuery('#primary'),
  		$content    = jQuery('#content'),
  		$scans      = jQuery('#scanlines'),
  		$sidebar    = jQuery('#sidebar'),
  		$nav        = jQuery('nav#navigation'),
  		$superbg    = jQuery('#superbgimage'),
  		clickevent  = 'click',
  		$mobilem    = jQuery('#max-mobile-menu'),
  		$mobile_btn = jQuery('#mobileMenuButton'),
  		$showtitle  = jQuery('#showtitle'),
  		$welcome    = jQuery('#welcomeTeaser'),
  		$modernizr  = !Modernizr.csstransitions || !Modernizr.csstransforms || !Modernizr.csstransforms3d ? false : true,
      addAdminBar = jQuery('#wpadminbar').height() || 0;

  if( $('.nav-full-width').size() > 0 ) {
    addAdminBar = addAdminBar + 20;
  }

	if( jQuery('html').hasClass('touch') ){
		isTouch = true;
		clickevent = 'touchend'; // change click event for play button to touchstart
	}

	// getting changed viewport dimensions
	var responsive_viewport = { "width": jQuery(window).width(), "height": jQuery(window).height() };

	// backward compatibility for prettyPhoto non HTML5 tags
	jQuery('a[rel*=prettyPhoto]').each(function(i,e){
		jQuery(e).attr('data-rel', jQuery(e).attr('rel')).removeAttr('rel');
	});

/*-----------------------------------------------------------------------------------*/
/*	1. =General Settings
/*-----------------------------------------------------------------------------------*/

  $.fn.isAfter = function(sel){
    return this.prevAll(sel).length !== 0;
  };

  $.fn.isBefore= function(sel){
    return this.nextAll(sel).length !== 0;
  };

  /** Tiny plugin to reposition the showtitle element on small screens */
  $.fn.repositionShowTitle = function() {

    var $this = $(this);

    if( $this.size() > 0 ) {

      var title_offset      = $this.offset();
          title_offset_top  = title_offset.top,
          checker_height    = $brand.outerHeight(true) + $sidebar.outerHeight(true) + $welcome.outerHeight(true);

        if( checker_height > title_offset_top ) {
          $this.css({ left: $brand.width() + 40 });
        }else{
          $this.css({ left: 20 });
        }

    }

  };

	/** Tiny plugin to hide the alt and title tag of a link and images on hover **/
	$.fn.hideTips = function(){
		return this.each(function(){
			var $elem = jQuery(this)
			var savealt = $elem.attr('alt');
			var savetitle = $elem.attr('title');
			$elem.hover(function(){
  			$elem.not('[rel*="prettyPhoto"], [rel*="prettyPhoto"] img, [data-rel*="prettyPhoto"], [data-rel*="prettyPhoto"] img, .gallery-icon a, #sociallinks a, .tooltip').removeAttr('title').removeAttr('alt');
			},function(){
				  $elem.attr({title:savetitle,alt:savealt});
			});
		});
	};

	// Slide Fade toggle
	$.fn.slideFadeToggle = function(speed, easing, callback) {
		// nice slide fade toggle animation - pew pew pew
		return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
	}

	// hide alt and title on hover
	jQuery('a, img').hideTips();


  /* Skin Changer */
  if( jQuery('#skinChanger').length ) {

    var skinchanger = jQuery('#skinChanger');

    if( jQuery('body').hasClass('home') ) {

      if( skinchanger.not('.closed') ) {

        setTimeout(function(){
          skinchanger.addClass('closed');
        }, 3000);

      }

    }

    jQuery('.hide-changer', skinchanger).on('click', function(){

      skinchanger.toggleClass('closed');

    });

  }

/*-----------------------------------------------------------------------------------*/
/*	2. =Setup Supefish Pulldown menu
/*-----------------------------------------------------------------------------------*/
/* Credits: http://users.tpg.com.au/j_birch/plugins/superfish/
*/

	if (jQuery().superfish) {

		jQuery('#navigation ul:first').superfish({
			delay: 250,
			animation: { },
			animationOut: { },
			speed: 'fast',
			autoArrows: false,
			dropShadows: false,
			disableHI: false
		});

    // add drop down arrow to pull down menu items
		var navFullWidth = jQuery('.nav-full-width #navigation');
		if( navFullWidth.length ){
      navFullWidth.find('.menu-item-has-children > a').not('ul ul li.menu-item-has-children > a').append('<i class="fa fa-angle-down"></i>');
      navFullWidth.find('ul ul li.menu-item-has-children > a').append('<i class="fa fa-angle-right"></i>');
		}

	}

/*-----------------------------------------------------------------------------------*/
/*	3. =Setup Portfolio hover
/*-----------------------------------------------------------------------------------*/

  var $portfolioGrid  = jQuery('.portfolio-list'),
      $portfolioItems = $portfolioGrid.children('li.item'),
      stickytime;

/*-----------------------------------------------------------------------------------*/
/*	4. =Init Tipsy Tooltips on Elements with class .tooltip
/*-----------------------------------------------------------------------------------*/

	if(jQuery('.tooltip').size() > 0 ){

		jQuery('.tooltip').tipsy({gravity: 's', offset: 200 });

	}

/*-----------------------------------------------------------------------------------*/
/*	5. =Shortcode JS
/*-----------------------------------------------------------------------------------*/
/*
*/

	/* Tabs Shortcode ----------------------------*/
	if( jQuery().tabs && jQuery(".tabs").size() > 0 ) {

		jQuery(".tabs").tabs({
			fx: { opacity: 'toggle', duration: 200}
		});

	}

  /* Toggle Shortcode ----------------------------*/
  if( jQuery().accordion && jQuery(".toggle-box").size() > 0 ) {

    jQuery(".toggle-box").each( function () {
      if(jQuery(this).attr('data-id') == 'closed') {
        jQuery(this).accordion({ header: '.box-title', collapsible: true, active: false  });
      } else {
        jQuery(this).accordion({ header: '.box-title', collapsible: true});
      }
    });

  }



/*-----------------------------------------------------------------------------------*/
/*	6. =Contact Form Validation
/*-----------------------------------------------------------------------------------*/
/* Credits: http://bassistance.de/jquery-plugins/jquery-plugin-validation/
*/

	if( jQuery("#contactForm").size() ){

		jQuery("#contactForm").validate(	);

	}

/*-----------------------------------------------------------------------------------*/
/*	7. =Hide all Elements
/*-----------------------------------------------------------------------------------*/

	window.allElementsVisible = true;
  window.invictus_elements_hidden = false;

	jQuery.fn.hideAllElements = function(hide, thumbs, footer){

		var $brand         = jQuery('#branding'),
		    $mainheader    = jQuery('.nav-full-width .main-header, .nav-full-height .main-header'),
  			$thumbs        = jQuery('#thumbnails'),
  			$colophon      = jQuery('#colophon'),
  			$togthumbs     = jQuery('#toggleThumbs'),
  			$expander      = jQuery('#expander'),
  			$main          = jQuery('#main'),
  			$page          = jQuery('#page'),
  			$primary       = jQuery('#primary'),
  			$scans         = jQuery('#scanlines'),
  			$sidebar       = jQuery('#sidebar'),
        $_superbg      = jQuery('#superbgimage, #superbgplayer'),
  			$nav           = jQuery('nav#navigation'),
  			$showlink      = jQuery('#showlink'),
  			$controls      = jQuery('#thumbnails .controls'),
  			$flickcntr     = jQuery('#controls-wrapper'),
  			$fsg_arrows    = jQuery('.fsg-arrows'),
  			viewport       = { "width": jQuery(window).width(), "height": jQuery(window).height() };

		if(!hide){
			if( $expander.hasClass('slide-up') ){
				hide = 'hide';
			}else if( $expander.hasClass('slide-down') ){
				hide = 'show';
			}
		}

		/** Slide up **/
		if( hide === 'hide'){

      window.invictus_elements_hidden = true;

      // hide flickr thumbnails if exists
      if( $flickcntr.size() ) {
        if( !$modernizr ){
          $flickcntr.addClass('flickr-controls-hide').stop(false,true).animate({ bottom: 0 }, 250);
        }else{
          $flickcntr.addClass('flickr-controls-transition-hide');
        }
      }

			// Check if it is the homepage
			if( jQuery('body:not(.home)') || thumbs == 1 ){
				if( !$modernizr ){
  				$scans.stop(false,true).fadeOut(250);
				}else{
  				$scans.addClass('opacity-hide');
				}
			}

			$_top = $brand.offset().top + $brand.outerHeight( true );

			// oldschool jQuery animation - what a shame...
      if( !$modernizr ){

        jQuery('.nav-full-height .fsg-arrows-prev').css({'left': 20}); // move to left
  			$primary.stop(false,true).fadeOut(250); // hide primary content
        $expander.stop(false,true).animate({ top: -20 + addAdminBar }); // move expander
        $nav.stop(false,true).animate({ top: "-=" + $nav.outerHeight( true ) }) // show navigation

        if( !$welcome.is('.nav-full-height #welcomeTeaser') ) {
          $welcome.stop(false,true).animate({ top: - $welcome.outerHeight( true ) - $brand.outerHeight() }) // show navigation
        }else{
          $welcome.stop(false,true).animate({ top: "-=" +  $welcome.outerHeight( true ) }) // show navigation
        }

        if( !$mainheader.is('.nav-full-height .main-header') ) {
          $mainheader.stop(false,true).animate({ top: "-=" + $mainheader.outerHeight( true ) }) // show navigation
        }else{
          $mainheader.stop(false,true).animate({ left: "-=" + $mainheader.outerWidth( true ) }) // show navigation
        }

        $brand.stop(false,true).animate({ top: "-=" +  $_top }, function() { // show branding
          $expander.removeClass('slide-up').addClass('slide-down');
        });

        $sidebar.stop(false,true).fadeOut(150);

      // the new cool CSS3 way - boooyaa!
      }else{

        /* hide page elements with transition */
        jQuery.each( [ $brand, $nav, $mainheader ], function(){
          jQuery(this).addClass('branding-hide');
        })

        $welcome.addClass('welcome-hide');

        jQuery('.nav-full-height .fsg-arrows-prev').addClass('fsg-arrows-prev-left');

        /* hide page elements with opacity */
        jQuery.each( [ $sidebar, $primary ], function(){
          jQuery(this).addClass('opacity-hide');
        })

        /* add slide class to expander */
        $expander.removeClass('slide-up').addClass('slide-down');
  		}

			// show thumbnails or hide
			if( $thumbs.hasClass('thumbs-hide-false') || $thumbs.hasClass('thumbs-hide-') ) {
  			$togthumbs.toggleThumbnails('hide', false, true);

  			if( !$modernizr ){
    			$thumbs.animate({'opacity': 0}, 250, function(){ jQuery(this).hide() });
    			$colophon.stop(false,true).animate({ opacity: 0 }, 250).hide();
    		}else{
      		$thumbs.addClass('opacity-hide')
      		$colophon.addClass('opacity-hide');
    		}

  		}

			window.allElementsVisible = false;

		}

		/** Slide down **/
		if( hide === 'show'){

      window.invictus_elements_hidden = false;

      // hide flickr thumbnails if exists
      if( $flickcntr.size() ) {
        if( !$modernizr ){
          $flickcntr.removeClass('flickr-controls-hide').stop(false,true).animate({ bottom: $colophon.outerHeight() },250);
        }else{
          $flickcntr.removeClass('flickr-controls-transition-hide');
        }
      }

			// Check if it is the homepage
			if( !jQuery('#superbgimageplayer').hasClass('ytplayer_init') &&
				!jQuery('#superbgimageplayer').hasClass('vimeoplayer_init') &&
				!jQuery('#superbgimageplayer').hasClass('jwplayer_init') )
			{
				if( jQuery('body:not(.home)') || thumbs == 0 ){
  				if( !$modernizr ){
  					$scans.stop(false, true).fadeIn(250);
  				}else{

    				$scans.removeClass('opacity-hide');
  				}
				}
			};

			// oldschool jQuery animation - what a shame...
      if( !$modernizr ){

        jQuery('.nav-full-height .fsg-arrows-prev').css({'left': 266}); // move to left
        $primary.stop(false,true).fadeIn(250); // show primary content
        $nav.stop(false,true).animate({ top: 0 + addAdminBar }); // show navigation

        if( !$welcome.is('.nav-full-height #welcomeTeaser') ) {
          $welcome.stop(false,true).animate({ top: $brand.outerHeight() + 20 }) // show navigation
        }else{
          $welcome.stop(false,true).animate({ top: 0 }) // show navigation
        }

        if( !$mainheader.is('.nav-full-height .main-header') ) {
         $mainheader.stop(false,true).animate({ top: 0 + addAdminBar }) // show navigation
        }else{
          $mainheader.stop(false,true).animate({ left: 0 }) // show navigation
        }

        $brand.stop(false,true).animate({ top: 0 }, function() { // show branding
          $expander.removeClass('slide-down').addClass('slide-up');
        });

        $sidebar.stop(false,true).fadeIn(150);

      // the new cool CSS3 way - boooyaa!
      }else{

        //$fsg_arrows.removeClass('fsg-arrows-opacity'); // show fsg arrows

        /* show page elements with transition */
        jQuery.each( [ $brand, $nav, $mainheader ], function(){
          jQuery(this).removeClass('branding-hide');
        })

        $welcome.removeClass('welcome-hide');

        jQuery('.nav-full-height .fsg-arrows-prev').removeClass('fsg-arrows-prev-left');

        /* show page elements with opacity */
        jQuery.each( [ $sidebar, $primary ], function(){
          jQuery(this).removeClass('opacity-hide');
        })

        /* add slide class to expander */
        $expander.removeClass('slide-down').addClass('slide-up');
      }

			if(	$thumbs.css('opacity') < 1 ) {

  			if( !$modernizr ){
    			$thumbs.animate({ opacity: 1 }, 250);
	  			$colophon.show().stop(false,true).animate({ opacity: 1 }, 250);
    		}else{
      		$thumbs.removeClass('opacity-hide');
      		$colophon.removeClass('opacity-hide');
    		}

			}

			if( $thumbs.hasClass('thumbs-hide-false') || $thumbs.hasClass('thumbs-hide-') ) {

  			// only show on large screens
  			if(viewport.width <= 481){
  				$togthumbs.toggleThumbnails('hide', false, false);
  			}else{
  			  if ( !thumbs ) {
    				$togthumbs.toggleThumbnails('hide', true, true);
          }else{
            if( $togthumbs.hasClass('slide-up') ) $togthumbs.toggleThumbnails('show', true, true);
          }
  			}

  		}

			window.allElementsVisible = true;

		}

	};

	$expander.on(clickevent, function(){ jQuery(this).hideAllElements(false, 1); return false; });

/*-----------------------------------------------------------------------------------*/
/*	8. =Hide Thumbnails
/*-----------------------------------------------------------------------------------*/

	jQuery.fn.toggleThumbnails = function(hide, footer, showtitle){

    var $_superbg = jQuery('#superbgimage, #superbgplayer');

    // set a height to the thumbnail containers
    if($thumbs.height() == 0){

   		// set height of containers
  		jQuery.each( [$thumbs, jQuery('.rel', $thumbs)], function(){
    		jQuery(this).css({
      		height: jQuery('#fullsize a:first img').outerHeight() + parseInt(jQuery('#fullsize').css('margin-top')) * 2
        })
  		})

    }

		// defaults
		footer = typeof footer !== 'undefined' ? footer : true;

    // hide thumbnails by default when only one item is available
    if( jQuery('#fullsize a.item').size() <= 1 ) {
      hide = 'hide';
      footer == true;
    }

		if( !hide ){
			if( jQuery(this).hasClass('slide-up') ){
				hide = 'show';
			}else if( jQuery(this).hasClass('slide-down') ){
				hide = 'hide';
			}
		}

		$togthumbs.livequery(function(){

			if(jQuery(window).width() <= 481){
				footer = false;
			}

      var add_h = $colophon.outerHeight();

			/** Slide up **/
			if( hide == 'hide' ){

				if(footer === false){

					add_h = 0;

					// Perform the animation
					if( !$modernizr ){

  					$colophon.stop(false,true).animate({ bottom: - $colophon.outerHeight(), opacity: 0 }, 250, function(){
  						jQuery(this).hide();
  					});

					}else{

            $colophon.addClass('footer-hide opacity-hide');

					}

          window.thumsVisible = false;

				};

        // old fashion jQuery animation skill - booooooh!
        if( !$modernizr ){

  				$thumbs
  					.stop(false,true)
  					.animate({ bottom: -$thumbs.outerHeight( true ) + parseInt( $thumbs.css('padding-top'), 10)  + add_h }, 250, function(){
  						$togthumbs.removeClass('slide-down').addClass('slide-up');
  					}).show();

        // new cool CSS3 transform way - boooohya!
				} else {

				  var translateY = $thumbs.outerHeight( true ) - parseInt( $thumbs.css('padding-top'), 10) - add_h;

  				$thumbs.addClass('thumbs-collapsed').css({ bottom: 0, 'transform': 'translate3d(0, '+ (translateY) +'px, 0)' });
  				$togthumbs.removeClass('slide-down').addClass('slide-up');

				}

				if(footer === true){

					// Perform the animation
          if( !$modernizr ){

  					$colophon.show().stop(false,true).animate({ bottom: 0, opacity: 1 }, 250, function(){
  						window.thumsVisible = true;
  					});

          }else{

  					$colophon.removeClass('footer-hide opacity-hide');

  				}

          window.thumsVisible = true;

				};

				if( showtitle === true ) {
          $showtitle.addClass('showtitle-visible');

          // change showtitle position on small screens
          $showtitle.repositionShowTitle();

				}else{
          $showtitle.removeClass('showtitle-visible');
				}

			}

			/** Slide down **/
			if( hide == 'show' ){

				if(footer === false){
					add_h = 0;
				}

        // old fashion jQuery animation skill - booooooh!
        if( !$modernizr ){

  				if( $thumbs.css('opacity') < 1 ) {
  					if(jQuery('#showtitle span.imagetitle').text() != 'description' ){
  						$thumbs.show().stop(false, true).animate({ opacity: 1 }, 250);
  					}
  				}

  				$thumbs
  					.css({ bottom: -$thumbs.outerHeight(true) })
  					.stop(false,true)
  					.animate({ bottom: 0 + add_h }, 250,function(){
  						$togthumbs.removeClass('slide-up').addClass('slide-down');
  					})

        } else {

  				if( $thumbs.css('opacity') < 1 ) {
  					if(jQuery('#showtitle span.imagetitle').text() != 'description' ){
  						$thumbs.removeClass('opacity-hide');
  					}
  				}

          $togthumbs.removeClass('slide-up').addClass('slide-down');
          $thumbs.removeClass('thumbs-collapsed').css({ bottom: 0, 'transform': 'translate3d(0, ' + add_h * - 1 + 'px, 0)' });

        }

				if(footer === true){

					// Perform the animation
          if( !$modernizr ){

  					$colophon.show().stop(false,true).animate({ bottom: 0, opacity: 1 }, 250, function(){
  						window.thumsVisible = true;
  						$superbg.css({ bottom: $colophon.outerHeight(), height: "auto" });
  					});

          }else{

  					$colophon.removeClass('footer-hide opacity-hide');

  				}

          window.thumsVisible = true;

				};

				if( showtitle === true ) {

          $showtitle.addClass('showtitle-visible');

          // change showtitle position on small screens
          $showtitle.repositionShowTitle();

				}else{
          $showtitle.removeClass('showtitle-visible');
				}

			}

		})

		return true;

	}

/*-----------------------------------------------------------------------------------*/
/*	9. =Back-to-top
/*-----------------------------------------------------------------------------------*/

	var anchorTop = jQuery('#anchorTop');

	function max_backToTop(topLink) {
		if(jQuery(window).scrollTop() > 0) {
		  if( !$modernizr ){
  			anchorTop.fadeIn( 200 );
  		}else{
    		anchorTop.removeClass('opacity-hide');
  		}
		} else {
		  if( !$modernizr ){
  			anchorTop.fadeOut( 200 );
  		}else{
    		anchorTop.addClass('opacity-hide');
  		}
		}
	}

	// bind function on scroll
	jQuery(window).scroll( function() {
		max_backToTop(anchorTop);
	});

	// set bottom position if footer is visible
	if( $colophon.size() && $colophon.is(':visible') && responsive_viewport.width > 481 ){
  	anchorTop.css({ 'bottom': $colophon.outerHeight() + 20 });
	}

	anchorTop.on(clickevent, function(e) {
	  e.stopPropagination();
		jQuery('html, body')
			.stop()
			.animate({ scrollTop: 0 }, 350);
		return false;
	});

/*-----------------------------------------------------------------------------------*/
/*	10. =Responsive jQuery
/*-----------------------------------------------------------------------------------*/
    /*
    Responsive jQuery is a tricky thing.
    There's a bunch of different ways to handle
    it so, be sure to research and find the one
    that works for you best.
    */

	if($thumbs){
		var thumbsObj_Attr = $thumbs.attr('data-object');

		if(typeof thumbsObj_Attr != "undefined"){
  		var thumbsObj = jQuery.parseJSON(thumbsObj_Attr);
    }

    window.videoplay = false;
	}

	function responsiveChanges(viewport) {

    var admin_add = 0;

    // mega menu resizer
    if( jQuery(window).outerWidth() - $nav.position().left === $nav.outerWidth() ) {
      $('.max-megamenu-wrapper').width( $nav.outerWidth() );
    }else {
      $('.max-megamenu-wrapper').css({ width: '' });
    }

		// Repositioning Controls of a fullsize gallery
		if( jQuery('#controls-wrapper').size() > 0 ) jQuery('#controls-wrapper').css({ bottom: $colophon.outerHeight() });

    // change showtitle position on small screens
    if( $showtitle.size() > 0 ) {
      $showtitle.repositionShowTitle();
    }

		/* if viewport width is below or equal 767px */
		if ( viewport.width <= 768 ){
			 $togthumbs.toggleThumbnails('hide', false, false);


      if( $primary.is('.not-fixed #primary') && $primary.not('.nav-full-height #primary') ) {
        $primary.css({ top: 0, marginTop: 0, marginBottom: 0 });
      }

      jQuery('#portfolioList').css({ marginTop: 0 });

		}

    if ( viewport.width < 980 ){

      if( $main.is( '.nav-full-height #main') ) {
        $main.css({ paddingTop: $brand.outerHeight() + 10 })
      }

      // adjust top position for welcome teaser
      if( $welcome.length && $welcome.is('.nav-full-height #welcomeTeaser') ) {
        $welcome.css({ top: $brand.outerHeight(true) + addAdminBar });
      }

    }

		/* if viewport height is larger or equal 768px */
		if ( viewport.width > 768 ){

			if($thumbs.size() > 0 && window.videoplay === false ){

				if( thumbsObj.homepage_show_thumbnails == 'true' && $togthumbs.hasClass('slide-up') === true ){
					$togthumbs.toggleThumbnails('show', true, true);
				}

				if( !thumbsObj.homepage_show_thumbnails ){
					$togthumbs.toggleThumbnails('hide', true, true);
				}

			}

      if( !$sidebar.is('.not-fixed #sidebar, .nav-full-height #sidebar') ) {
        $sidebar.css({ top: $brand.outerHeight(true) + addAdminBar });
      }

      if( $sidebar.is('.nav-full-width #sidebar') ) {
        $sidebar.css({ top: $brand.outerHeight(true) + addAdminBar });
      }

      // set negative margin for primary with fixed logo
      if( $primary.is('.not-fixed #primary') && !$primary.is('.nav-full-height #primary') && $sidebar.size() > 0 ) {
        $primary.css({ top: - $brand.height() });
        console.log('here');
      }

      // add margin top on fullsize templates
      if( $primary.is('#primary.portfolio-fullsize-grid') ) {

        if( $primary.is('.not-fixed #primary') && !$primary.is('.nav-full-height #primary') ) {
          var margTop = jQuery('header.entry-header').outerHeight() - $brand.height();
          if( margTop > 0 ) {
            jQuery('#portfolioList').not('.nav-full-width #portfolioList, .nav-full-height #portfolioList').css({ marginTop: margTop });
          }
        }else{
          jQuery('#portfolioList').css({ marginTop: 0 });
        }

      }

      /* remove class for mobile menu on resize */
      jQuery('body.max-mobile-menu-push-toright').removeClass('max-mobile-menu-push-toright');
      jQuery('#max-mobile-menu.max-mobile-menu-open').removeClass('max-mobile-menu-open');
      jQuery('#mobileMenuButton.active').removeClass('active');

		}

		/* if viewport height is larger or equal 980px */
		if ( viewport.width >= 980 ){

      // set negative margin for primary with fixed logo
      if( $primary.is('.not-fixed #primary') && !$primary.is('.nav-full-height #primary') && $sidebar.length ) {
        $primary.css({ top: -$brand.height() + $nav.height(), marginBottom: -$brand.height() + $nav.height() });
      }

      // add margin top on fullsize templates
      if( $primary.is('#primary.portfolio-fullsize-grid') ) {

        if( $primary.is('.not-fixed #primary') && !$primary.is('.nav-full-height #primary') ) {
          jQuery('#portfolioList').not('.nav-full-width #portfolioList, .nav-full-height #portfolioList').css({ marginTop: jQuery('header.entry-header').outerHeight() - $brand.height() + $nav.height() });
        }else{
          var navHeight = 0;
          if( !jQuery('header.entry-header').length ) {
            navHeight = $nav.height();
          }
          jQuery('#portfolioList').not('.nav-full-width #portfolioList, .nav-full-height #portfolioList').css({ marginTop: 0});
        }

      }

      /* Adjust padding top for full height nav on large screens */
      if( $main.is( '.nav-full-height #main') ) {
        $main.css({ paddingTop: 0 })
      }

      // adjust top position for welcome teaser
      if( $welcome.length && $welcome.is('.nav-full-height #welcomeTeaser') ) {
        $welcome.css({ top: 0 + addAdminBar });
      }

    }

    // adjust padding for welcome teaser
    if( $welcome.length && !$welcome.is('.nav-full-height #welcomeTeaser') ) {
      $welcome.css({ top: $brand.outerHeight(true) + addAdminBar });
    }

    // adjust padding-top of main on full width nav
    var fullWidthNavMain = jQuery('.nav-full-width #main');
    if( fullWidthNavMain.length ) {
      fullWidthNavMain.css({ paddingTop: $brand.outerHeight(true) + 20 });
    }

	}

	jQuery(window).smartresize(function(){

		/* getting changed viewport dimensions */
		responsive_viewport = { width: jQuery(window).width(), height: jQuery(window).height() };
		responsiveChanges( responsive_viewport );

    /* change splashscreen position */
		if( jQuery('#splashscreen').length ){

    //   jQuery('#splashscreen').imagesLoaded(function(){

    // 		var splash_inner = jQuery('#splashscreen .inner'),
    // 		    body_width = jQuery('body').width(),
    // 		    splash_width = splash_inner.width(),
    // 		    splash_height = splash_inner.height();

    //     if(responsive_viewport.width > 480 ) {
    //   		splash_inner.css({
    //     		marginLeft: -splash_width / 2,
    //     		marginTop: -splash_height / 2
    //   		})
    // 		}else{
    //   		splash_inner.css({
    //     		marginLeft:'auto',
    //     		marginTop: 30
    //   		})
    // 		}

  		// })

		}

	});

/*-----------------------------------------------------------------------------------*/
/*	11. =Init fitvids if needed
/*-----------------------------------------------------------------------------------*/

  if( jQuery().fitVids ) { /* check if fitvids is enqueued */

  	if( jQuery('.post-video, .entry-video, .entry-content').size() > 0 ){
  		jQuery(".post-video, .entry-video, .entry-content").fitVids()
    }

  }

/*-----------------------------------------------------------------------------------*/
/*	12. =PrettyPhoto Init
/*-----------------------------------------------------------------------------------*/

  if( typeof max_prettyphoto_vars !== 'undefined' && max_prettyphoto_vars.disable_lightbox === 'false' ) {

    /*  add gallery rel attribute to wordpress gallery images to navigation in the lightbox
        if the parent link href is an image */
    jQuery('.gallery-icon a').filter(function() {
      if( jQuery(this).attr('href').match(/\.(jpg|png|gif)/i) ) {
        jQuery(this).attr('data-rel', "prettyPhoto[wp_gal]");
      }
    });

		if(jQuery().prettyPhoto) { // only load prettyPhoto if script file is included

      var pretty_selector = ".blog .entry-content a[href$='.jpg'], .blog .entry-content a[href$='.png'], [data-rel^='prettyPhoto'], .gallery-icon a[href$='.jpg'], .gallery-icon a[href$='.png'], .gallery-icon a[href$='.gif']";

      var pretty_settings = {
          hook: 'data-rel',
          allow_resize: true, /* Resize the photos bigger than viewport. true/false */
          allow_expand: max_prettyphoto_vars.allow_expand === 'true', /* Allow the user to expand a resized image. true/false */
          animationSpeed: max_prettyphoto_vars.animationSpeed,
          slideshow: max_prettyphoto_vars.slideshow,
          theme: max_prettyphoto_vars.theme,
          deeplinking: false,
          changepicturecallback: function(){
            // block scrolling
            jQuery("body").css("overflow", "");
          },
          callback: function() {
            if(jQuery('.scroll-pane').size() > 0){
              jQuery('#scroll_left').not('#scroll_left.disabled').show();
              jQuery('#scroll_right').not('#scroll_right.disabled').show();
            }
            // restore scrolling
            jQuery("body").css("overflow", "");

          },
          show_title: max_prettyphoto_vars.show_title === 'true',
          overlay_gallery: max_prettyphoto_vars.overlay_gallery === 'true',
          overlay_gallery_max: max_prettyphoto_vars.overlay_gallery_max
      }

      // disable social tools
      if( max_prettyphoto_vars.social_tools === 'false' ) {
        pretty_settings.social_tools = false;
      }

      // call prettyPhoto on the pretty_selector with pretty_settings
			jQuery( pretty_selector ).livequery(function(){
				jQuery( pretty_selector ).prettyPhoto( pretty_settings )
      });

		}

  }

/*-----------------------------------------------------------------------------------*/
/*	13. =on window load events
/*-----------------------------------------------------------------------------------*/

  /* On window load. This waits until images have loaded which is essential */
	jQuery(window).load(function(){

    // remove loading class from body
    jQuery('body').removeClass('max-is-loading');

    // remove preloader
    if( jQuery('#max-preloader').size() > 0 ) {
      jQuery('#max-preloader').fadeOut(350, function(){
        jQuery(this).remove();
      });
    }

		/* Fade in images so there isn't a color "pop" document load and then on window load */
    if( jQuery("#thumbnails a.greyscaled img").length ) {
		  jQuery("#thumbnails a.greyscaled img").fadeIn(500);
    }

    /* Bind click event to thumbnail toggle handler */
    if( $togthumbs.length ) {
  		$togthumbs.on(clickevent, function( event ){
  			jQuery(this).toggleThumbnails();
  		  return false;
  		})
    }

    /* set bottom position of item-caption to a negative value of it's own height */
    /* ! only if there are no CSS3 transfrom properties ! */
    if( !$modernizr ) {
      jQuery(window).smartresize( function() {
        if( $portfolioItems.length ) {
          $portfolioItems.each(function(){
            jQuery(this).not('li.show-title').find('.item-caption').css({ bottom: -jQuery(this).find('.item-caption').outerHeight() });
          })
        }
      }).smartresize();
    }

    /* call the responsive function and do some responsive changes */
		responsiveChanges(responsive_viewport);

    /* remove preloader class from body if set */
    if( jQuery("body").hasClass('preload') ) {
      jQuery("body").removeClass("preload");
    }

	});

/*-----------------------------------------------------------------------------------*/
/*	14. =Splashscreen
/*-----------------------------------------------------------------------------------*/
  if( jQuery('#splashscreen').length ) {

    var splashscreen = jQuery('#splashscreen'),
        splashinner  = jQuery('.inner', splashscreen),
        splashlogo   = jQuery('.logo', splashscreen),
        splashbtn    = jQuery('.enter .button', splashscreen),
        splashskip   = true,
        responsive_viewport = { width: jQuery(window).width(), height: jQuery(window).height() };

    // $.removeCookie(splashvar.theme + '_splashscreen', { path: '/' });

    /* check for a cookie and set if necessary */
    if( splashvar.cookieset && typeof jQuery.cookie(splashvar.theme + '_splashscreen') == 'undefined' ) {

      if( splashvar.cookieexpires >= 1 ) {
        /* Create expiring cookie, {splasvar.cookieexpires} days from then: */
        $.cookie(splashvar.theme + '_splashscreen', true, { expires: splashvar.cookieexpires, path: '/' });
      }else{
        /* Create session cookie: */
        $.cookie(splashvar.theme + '_splashscreen', true, { path: '/' });
      }

      /* show the splash */
      splashskip = false;

    }

    if(!splashvar.cookieset) {
      splashskip = false;
    }

    /* dont' skip the splash screen */
    if(!splashskip) {

      splashscreen.imagesLoaded(function(){

        // if(responsive_viewport.width > 480 ) {

        //   /* repositioning the inner container and show it */
        //   splashinner.css({ marginLeft: -splashinner.outerWidth() / 2 });
        //   splashinner.css({ marginTop: -splashinner.outerHeight() / 2 });

        // }

      });

      /* show the inner container after things are setup */
      splashinner.fadeIn(splashvar.fade);

      function splashide(timer) {
        if( typeof fadeouttimer != "undefined" ) clearTimeout(fadouttimer);
          var fadeouttimer = setTimeout(function(){
            splashscreen.fadeOut(splashvar.fade);
        }, timer)
      }

      /* fadeout programatically */
      if( splashvar.fadeout && splashvar.timeout ) {
        jQuery(window).load(function(){
          splashide(splashvar.timeout);
        })
      }

      /* add click event to "Enter" button */
      if( splashbtn.length ) {
        splashbtn.on('click', function(){
          splashide(250);
        })
      }

    }else{
      splashscreen.hide();
    }

  }

/*-----------------------------------------------------------------------------------*/
/*	15. =Mobile Menu
/*-----------------------------------------------------------------------------------*/

  var menuLeft      = document.getElementById( 'max-mobile-menu' ),
      showLeftPush  = document.getElementById( 'mobileMenuButton' ),
      menuHolder    = jQuery('#max-mobile-menu ul.menu'),
      body          = document.body,
      myMenuScroll;

  if( $mobile_btn.length ) {

  	if( jQuery('html').hasClass('touch') ){
  		isTouch = true;
  	}

    if( $modernizr && $(menuLeft).size() ) {
      classie.addClass( menuLeft, 'max-mobile-menu-transition');
    }

    showLeftPush.onclick = function() {
        classie.toggle( this, 'active' );
        classie.toggle( body, 'max-mobile-menu-push-toright' );
        classie.toggle( body, 'no-scroll' );
        classie.toggle( menuLeft, 'max-mobile-menu-open' );
        classie.toggle( menuLeft, 'max-mobile-menu-shadow' );

      if( jQuery('.fullsize-gallery').length ) {
        classie.toggle( this, 'max-mobile-button-push-toright' );
      }

    };

    jQuery('ul.menu li', jQuery(menuLeft) ).each(function(){

      $li = jQuery(this);

      if( jQuery(' > ul.sub-menu', $li).length ) {

        var submenu;

        jQuery('> a', $li).addClass('has-submenu').append('<i class="fa fa-angle-right"><span>Open Menu</span></i>');

        $li.on('click', '> a.has-submenu:not(.active)', function(e){

          e.preventDefault();

          var currentLink   = jQuery(this),
              menu_height   = menuHolder.height(),
              submenu       = jQuery(this).next('ul.sub-menu'),
              hasSubmenu    = submenu.length ? true : false;
              sub_height    = submenu.height();

          currentLink.addClass('active');

          if( hasSubmenu ) {

            // scale the submenu to overlay the parent menu
            submenu.addClass('open');
            if( submenu.height() < menu_height ) {
              submenu.css({ 'height': menu_height });
            }

            // set new height of menu for iScroll
            menuHolder.height(sub_height);

            submenu.on('click', 'a.back', function(e){
              submenu.removeClass('open');
              menuHolder.height('auto');
              jQuery(this).addClass('active');
              currentLink.removeClass('active');

              e.preventDefault();

              if(isTouch){
                myMenuScrollRefresh(); // refresh iScroll because container height has changed
              }

            })

            if(isTouch){
              myMenuScrollRefresh(); // refresh iScroll because container height has changed
            }

          }

        });

      }

    })

    $link_back = jQuery('<a href="#" class="back"><i class="fa fa-times"><span>Close</span></i></a>');
    //$link_back.prependTo( jQuery('ul.sub-menu', jQuery(menuLeft) ) );

    jQuery('a.has-submenu').livequery(function(){

      $li = jQuery('<li class="parent-link"><a href="#" class="back"><i class="fa fa-times"><span>Close</span></i></a></li>').append( jQuery(this).clone() );
      $li.prependTo( jQuery(this).next('ul.sub-menu') );

    })

  	// new myScroll touch scrolling
  	if ( typeof iScroll == 'function' && typeof isTouch != 'undefined' && isTouch ) { // only call when iScroll is included and we are on a touch device

      if( $mobile_btn.length ) {

        function myMenuScrollLoaded() {
        	setTimeout(function () {
      		  myMenuScroll = new iScroll('max-mobile-menu', {
              hScrollbar: false,
              vScrollbar: false,
              hScroll: false
            });
          }, 100);
        }

        document.addEventListener('touchmove', function (e) { }, false);
        window.addEventListener('load', myMenuScrollLoaded, false);

        function myMenuScrollRefresh() {
         	setTimeout(function() {
         		myMenuScroll.refresh();
         	}, 0);
        };

      }

    }

  }

/*-----------------------------------------------------------------------------------*/
/*	16. =Image grayscale
/*-----------------------------------------------------------------------------------*/

	// Grayscale images only on browsers IE10+ since they removed support for CSS grayscale filter
	if ( getInternetExplorerVersion() >= 10 ){

  	var $images = jQuery("a.greyscaled img")

		$images.each(function(){
			var el = jQuery(this);
			el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale').css({"position":"absolute","z-index":"5","opacity":"0"}).insertBefore(el).queue(function(){
				var el = jQuery(this);
				el.parent().css({"width":this.width,"height":this.height});
				el.dequeue();
			});
			this.src = grayscaleIE10(this.src);
		});


    jQuery("a.greyscaled img").on({
        mouseenter: function () {
				  jQuery(this).parent().find('img:first').stop().animate({opacity:1}, 200);
        },
        mouseleave: function () {
				  jQuery('.img_grayscale').stop().animate({opacity:0}, 200);
        }
    });

		function grayscaleIE10(src){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var imgObj = new Image();
			imgObj.src = src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height;
			ctx.drawImage(imgObj, 0, 0);
			var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for(var y = 0; y < imgPixels.height; y++){
				for(var x = 0; x < imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
				}
			}
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			return canvas.toDataURL();
		};
	};

	// Since IE11 can not be detected like this because the new user agent on IE11 is trying to hide as Mozilla
	// we detect IE11 with this function
	function getInternetExplorerVersion(){
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
		}
		else if (navigator.appName == 'Netscape'){
			var ua = navigator.userAgent;
			var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
		}
		return rv;
	};

})


/*-----------------------------------------------------------------------------------*/
/*	18. =ImagesLoaded Plugin
/*-----------------------------------------------------------------------------------*/

  // *************
  // Original plugin Gist: https://gist.github.com/268257
  // Current repos: https://github.com/desandro/imagesloaded
  // fix in response to: https://github.com/desandro/imagesloaded/issues/8
  //
  // In case this is useful to anyone.
  // *************

  // only get imagesLoaded if it is not already loaded
  if(!jQuery().imagesLoaded){

  /*!
   * jQuery imagesLoaded plugin v1.0.4
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */

  (function($, undefined) {

    // jQuery('#my-container').imagesLoaded(myFunction)
    // or
    // jQuery('img').imagesLoaded(myFunction)

    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    //  `this` is the container

    $.fn.imagesLoaded = function( callback ) {
      var $this = this,
          $images = $this.find('img').add( $this.filter('img') ),
          len = $images.length,
          blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

      // some browsers (IE9) fail to trigger image loaded when using cached images
      // This flag is so we can account for this dumb MSIE situation.
      var can_use_cached_images = confirm_can_use_cached_images();

      function confirm_can_use_cached_images() {
        var result = 'Good browser';
        var arr_known_browsers_with_issues = ['ie9','ie10'];

        // block to check for specific know buggy browsers.
        if ($.browser.msie) {
          result = 'ie' + parseInt($.browser.version, 10);    // target => IE9 ONLY at present
        }

        return ($.inArray(result, arr_known_browsers_with_issues) == -1);  // -1 means no match found.
      }

      function triggerCallback() {
        callback.call( $this, $images );
      }

      function imgLoaded( event ) {
        if ( --len <= 0 && event.target.src !== blank ){
          setTimeout( triggerCallback );
          $images.unbind( 'load error', imgLoaded );
        }
      }

      if ( !len ) {
        triggerCallback();
      }

      $images.bind( 'load error',  imgLoaded ).each( function() {
        if (can_use_cached_images == false) {
          this.src = this.src.split('?')[0];
        }

        // cached images don't fire load sometimes, so we reset src.
        if (this.complete || typeof this.complete === "undefined"){
          var src = this.src;
          // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
          this.src = blank;
          this.src = src;
        }
      });

      return $this;
    };

  })(jQuery);

  }

/*-----------------------------------------------------------------------------------*/
/*	19. =pngFix Plugin
/*-----------------------------------------------------------------------------------*/
/**
 * jQuery-Plugin "pngFix"
 * Version: 1.1, 11.09.2007
 * by Andreas Eberhard, andreas.eberhard@gmail.com
 *                      http://jquery.andreaseberhard.de/
 *
 * Copyright (c) 2007 Andreas Eberhard
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'([237-9n-zA-Z]|1\\w)'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(s(m){3.fn.pngFix=s(c){c=3.extend({P:\'blank.gif\'},c);8 e=(o.Q=="t R S"&&T(o.u)==4&&o.u.A("U 5.5")!=-1);8 f=(o.Q=="t R S"&&T(o.u)==4&&o.u.A("U 6.0")!=-1);p(3.browser.msie&&(e||f)){3(2).B("img[n$=.C]").D(s(){3(2).7(\'q\',3(2).q());3(2).7(\'r\',3(2).r());8 a=\'\';8 b=\'\';8 g=(3(2).7(\'E\'))?\'E="\'+3(2).7(\'E\')+\'" \':\'\';8 h=(3(2).7(\'F\'))?\'F="\'+3(2).7(\'F\')+\'" \':\'\';8 i=(3(2).7(\'G\'))?\'G="\'+3(2).7(\'G\')+\'" \':\'\';8 j=(3(2).7(\'H\'))?\'H="\'+3(2).7(\'H\')+\'" \':\'\';8 k=(3(2).7(\'V\'))?\'float:\'+3(2).7(\'V\')+\';\':\'\';8 d=(3(2).parent().7(\'href\'))?\'cursor:hand;\':\'\';p(2.9.v){a+=\'v:\'+2.9.v+\';\';2.9.v=\'\'}p(2.9.w){a+=\'w:\'+2.9.w+\';\';2.9.w=\'\'}p(2.9.x){a+=\'x:\'+2.9.x+\';\';2.9.x=\'\'}8 l=(2.9.cssText);b+=\'<y \'+g+h+i+j;b+=\'9="W:X;white-space:pre-line;Y:Z-10;I:transparent;\'+k+d;b+=\'q:\'+3(2).q()+\'z;r:\'+3(2).r()+\'z;\';b+=\'J:K:L.t.M(n=\\\'\'+3(2).7(\'n\')+\'\\\', N=\\\'O\\\');\';b+=l+\'"></y>\';p(a!=\'\'){b=\'<y 9="W:X;Y:Z-10;\'+a+d+\'q:\'+3(2).q()+\'z;r:\'+3(2).r()+\'z;">\'+b+\'</y>\'}3(2).hide();3(2).after(b)});3(2).B("*").D(s(){8 a=3(2).11(\'I-12\');p(a.A(".C")!=-1){8 b=a.13(\'url("\')[1].13(\'")\')[0];3(2).11(\'I-12\',\'none\');3(2).14(0).15.J="K:L.t.M(n=\'"+b+"\',N=\'O\')"}});3(2).B("input[n$=.C]").D(s(){8 a=3(2).7(\'n\');3(2).14(0).15.J=\'K:L.t.M(n=\\\'\'+a+\'\\\', N=\\\'O\\\');\';3(2).7(\'n\',c.P)})}return 3}})(3);',[],68,'||this|jQuery||||attr|var|style||||||||||||||src|navigator|if|width|height|function|Microsoft|appVersion|border|padding|margin|span|px|indexOf|find|png|each|id|class|title|alt|background|filter|progid|DXImageTransform|AlphaImageLoader|sizingMethod|scale|blankgif|appName|Internet|Explorer|parseInt|MSIE|align|position|relative|display|inline|block|css|image|split|get|runtimeStyle'.split('|'),0,{}));

/*-----------------------------------------------------------------------------------*/
/*	20. =iOS orientationchange
/*-----------------------------------------------------------------------------------*/

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function(w){
	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ){ return; }
    var doc = w.document;
    if( !doc.querySelector ){ return; }
    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
		x, y, z, aig;
    if( !meta ){ return; }
    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true; }
    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false; }
    function checkTilt( e ){
		aig = e.accelerationIncludingGravity;
		x = Math.abs( aig.x );
		y = Math.abs( aig.y );
		z = Math.abs( aig.z );
		// If portrait orientation and in one of the danger zones
        if( !w.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
			if( enabled ){ disableZoom(); } }
		else if( !enabled ){ restoreZoom(); } }
	w.addEventListener( "orientationchange", restoreZoom, false );
	w.addEventListener( "devicemotion", checkTilt, false );
})( this );

/*-----------------------------------------------------------------------------------*/
/*	21. =Smartresize Plugin
/*-----------------------------------------------------------------------------------*/

if( !jQuery().smartresize ) {

  (function($,sr){

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
  	// smartresize
  	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

  })(jQuery,'smartresize');

}

/*-----------------------------------------------------------------------------------*/
/*	22. =ClassIE Plugin
/*-----------------------------------------------------------------------------------*/
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

/*-----------------------------------------------------------------------------------*/
/*	23. =Grayscale IE10+
/*-----------------------------------------------------------------------------------*/

var grayscale=function(){var e={colorProps:["color","backgroundColor","borderBottomColor","borderTopColor","borderLeftColor","borderRightColor","backgroundImage"],externalImageHandler:{init:function(e,t){if(e.nodeName.toLowerCase()==="img"){}else{r(e).backgroundImageSRC=t;e.style.backgroundImage=""}},reset:function(e){if(e.nodeName.toLowerCase()==="img"){}else{e.style.backgroundImage="url("+(r(e).backgroundImageSRC||"")+")"}}}},t=function(){try{window.console.log.apply(console,arguments)}catch(e){}},n=function(e){return(new RegExp("https?://(?!"+window.location.hostname+")")).test(e)},r=function(){var e=[0],t="data"+ +(new Date);return function(n){var r=n[t],i=e.length;if(!r){r=n[t]=i;e[r]={}}return e[r]}}(),i=function(e,t,n){var s=document.createElement("canvas"),u=s.getContext("2d"),a=e.naturalHeight||e.offsetHeight||e.height,f=e.naturalWidth||e.offsetWidth||e.width,l;s.height=a;s.width=f;u.drawImage(e,0,0);try{l=u.getImageData(0,0,f,a)}catch(c){}if(t){i.preparing=true;var h=0;(function(){if(!i.preparing){return}if(h===a){u.putImageData(l,0,0,0,0,f,a);n?r(n).BGdataURL=s.toDataURL():r(e).dataURL=s.toDataURL()}for(var t=0;t<f;t++){var c=(h*f+t)*4;l.data[c]=l.data[c+1]=l.data[c+2]=o(l.data[c],l.data[c+1],l.data[c+2])}h++;setTimeout(arguments.callee,0)})();return}else{i.preparing=false}for(var h=0;h<a;h++){for(var p=0;p<f;p++){var d=(h*f+p)*4;l.data[d]=l.data[d+1]=l.data[d+2]=o(l.data[d],l.data[d+1],l.data[d+2])}}u.putImageData(l,0,0,0,0,f,a);return s},s=function(e,t){var n=document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(e,null)[t]:e.currentStyle[t];if(n&&/^#[A-F0-9]/i.test(n)){var r=n.match(/[A-F0-9]{2}/ig);n="rgb("+parseInt(r[0],16)+","+parseInt(r[1],16)+","+parseInt(r[2],16)+")"}return n},o=function(e,t,n){return parseInt(.2125*e+.7154*t+.0721*n,10)},u=function(e){var t=Array.prototype.slice.call(e.getElementsByTagName("*"));t.unshift(e);return t};var a=function(t){if(t&&t[0]&&t.length&&t[0].nodeName){var f=Array.prototype.slice.call(t),l=-1,c=f.length;while(++l<c){a.call(this,f[l])}return}t=t||document.documentElement;if(!document.createElement("canvas").getContext){t.style.filter="progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)";t.style.zoom=1;return}var h=u(t),p=-1,d=h.length;while(++p<d){var v=h[p];if(v.nodeName.toLowerCase()==="img"){var m=v.getAttribute("src");if(!m){continue}if(n(m)){e.externalImageHandler.init(v,m)}else{r(v).realSRC=m;try{v.src=r(v).dataURL||i(v).toDataURL()}catch(g){e.externalImageHandler.init(v,m)}}}else{for(var y=0,b=e.colorProps.length;y<b;y++){var w=e.colorProps[y],E=s(v,w);if(!E){continue}if(v.style[w]){r(v)[w]=E}if(E.substring(0,4)==="rgb("){var S=o.apply(null,E.match(/\d+/g));v.style[w]=E="rgb("+S+","+S+","+S+")";continue}if(E.indexOf("url(")>-1){var x=/\(['"]?(.+?)['"]?\)/,T=E.match(x)[1];if(n(T)){e.externalImageHandler.init(v,T);r(v).externalBG=true;continue}try{var N=r(v).BGdataURL||function(){var e=document.createElement("img");e.src=T;return i(e).toDataURL()}();v.style[w]=E.replace(x,function(e,t){return"("+N+")"})}catch(g){e.externalImageHandler.init(v,T)}}}}}};a.reset=function(t){if(t&&t[0]&&t.length&&t[0].nodeName){var i=Array.prototype.slice.call(t),s=-1,o=i.length;while(++s<o){a.reset.call(this,i[s])}return}t=t||document.documentElement;if(!document.createElement("canvas").getContext){t.style.filter="progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)";return}var f=u(t),l=-1,c=f.length;while(++l<c){var h=f[l];if(h.nodeName.toLowerCase()==="img"){var p=h.getAttribute("src");if(n(p)){e.externalImageHandler.reset(h,p)}h.src=r(h).realSRC||p}else{for(var d=0,v=e.colorProps.length;d<v;d++){if(r(h).externalBG){e.externalImageHandler.reset(h)}var m=e.colorProps[d];h.style[m]=r(h)[m]||""}}}};a.prepare=function(e){if(e&&e[0]&&e.length&&e[0].nodeName){var t=Array.prototype.slice.call(e),o=-1,f=t.length;while(++o<f){a.prepare.call(null,t[o])}return}e=e||document.documentElement;if(!document.createElement("canvas").getContext){return}var l=u(e),c=-1,h=l.length;while(++c<h){var p=l[c];if(r(p).skip){return}if(p.nodeName.toLowerCase()==="img"){if(p.getAttribute("src")&&!n(p.src)){i(p,true)}}else{var d=s(p,"backgroundImage");if(d.indexOf("url(")>-1){var v=/\(['"]?(.+?)['"]?\)/,m=d.match(v)[1];if(!n(m)){var g=document.createElement("img");g.src=m;i(g,true,p)}}}}};return a}()