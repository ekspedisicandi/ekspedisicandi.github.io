/**
 * --------------------------------------------------------------------
 * jQuery-Plugin SuperBGimage - Scaling Fullscreen Backgrounds and Slideshow using jQuery
 * Version: 1.0, 29.08.2009
 *
 * by Andreas Eberhard, andreas.eberhard@gmail.com
 *                      http://dev.andreaseberhard.de/projects/superbgimage/
 *
 * Copyright (c) 2009 Andreas Eberhard
 * licensed under a Creative Commons Attribution 3.0
 *
 *  Inspired by
 *	  Supersized - Fullscreen Slideshow jQuery Plugin
 *    http://buildinternet.com/project/supersized/
 *	  By Sam Dunn (www.buildinternet.com // www.onemightyroar.com)
 * --------------------------------------------------------------------
 * License:
 * http://creativecommons.org/licenses/by/3.0/
 * http://creativecommons.org/licenses/by/3.0/deed.de
 *
 * You are free:
 *       * to Share - to copy, distribute and transmit the work
 *       * to Remix - to adapt the work
 *
 * Under the following conditions:
 *       * Attribution. You must attribute the work in the manner specified
 *         by the author or licensor (but not in any way that suggests that
 *         they endorse you or your use of the work).
 * --------------------------------------------------------------------
 * Changelog:
 *    29.08.2009 initial Version 1.0
 * --------------------------------------------------------------------
 */

(function($) {

	jQuery.fn.superbgimage = function(loadingoptions) {

		// plugin-options
		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options, loadingoptions);

		// check for touchable device
		var isTouch =  false;
		if( jQuery('html').hasClass('touch') ){
			isTouch = true
		}

		jQuery.superbg_inAnimation = false;
		jQuery.superbg_slideshowActive = false;
		jQuery.superbg_imgIndex = 1;
		jQuery.superbg_imgActual = 1;
		jQuery.superbg_imgLast = -1;
		jQuery.superbg_imgSlide = 0;
		jQuery.superbg_interval = 0;
		jQuery.superbg_preload = 0;
		jQuery.superbg_direction = 0;
		jQuery.superbg_max_randomtrans = 7;
		jQuery.superbg_lasttrans = -1;
		jQuery.superbg_isIE6 = false;
		jQuery.superbg_firstLoaded = false;

		// save the id of the thumbnails/links
		jQuery.superbg_saveId = jQuery(this).attr('id');

		// prepend new/existing div with id from options to body
		if (jQuery('#' + options.id).length === 0) {
			jQuery('body').prepend('<div id="' + options.id + '" style="display:none;"></div>');
		} else {
			jQuery('body').prepend(jQuery('#' + options.id));
		}

		// set required css options
		jQuery('#' + options.id).css('display', 'none');
		// set required css options for fullscreen mode
		if (options.inlineMode === 0) {
			//jQuery('#' + options.id).css('position', 'fixed').css('width', '100%').css('height', '100%').css('top', 0).css('left', 0);
		}

		// reload true? remove all images
		if (options.reload) {
			jQuery('#' + options.id + ' img').remove();
		}

		// hide all images, set position absolute
		jQuery('#' + options.id + ' img').hide().css('position', 'absolute');

		// add rel-attribute with index to all existing images
		jQuery('#' + options.id).children('img').each(function() {
			jQuery(this).attr('rel', jQuery.superbg_imgIndex++);
			// clear title-attribute
			if (!options.showtitle) {
				jQuery(this).attr('title', '');
			}
		});

		// add rel-attribute with index to all links
		jQuery(this).children('a').each(function() {
			// add click-event to links, add class for preload
			jQuery(this).attr('rel', jQuery.superbg_imgIndex++).on(options.clickevent,function() {
				jQuery(this).superbgShowImage();
				return false;
			}).addClass('preload');
		});

		// fix total counter
		jQuery.superbg_imgIndex--;

		// bind load-event to show 1st image on document load
		jQuery(window).on('load', function() {
    		jQuery(this).superbgLoad();
		});

		// bind resize-event to resize actual image
		jQuery(window).on('resize', function() {
    		jQuery(this).superbgResize();
		});

		// fix for IE6
		jQuery.superbg_isIE6 = /msie|MSIE 6/.test(navigator.userAgent);
		if (jQuery.superbg_isIE6 && (options.inlineMode === 0)) {
			jQuery('#' + options.id).css('position', 'absolute').width(jQuery(window).width()).height(jQuery(window).height());
			jQuery(window).bind('scroll', function() {
				jQuery(this).superbgScrollIE6();
			});
		}

		// reload true? show new image-set
		if (options.reload) {
			jQuery(this).superbgLoad();
		}

		return this;

	};

	// fix for IE6, handle scrolling-event
	jQuery.fn.superbgScrollIE6 = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// set top of the container
		jQuery('#' + options.id).css('top', document.documentElement.scrollTop + 'px');

	};

	// handle load-event, show 1st image
	jQuery.fn.superbgLoad = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// show container only if images/links exist
		if ( (jQuery('#' + options.id).children('img').length > 0) || (jQuery('#' + jQuery.superbg_saveId).children('a').length > 0) ) {
			jQuery('#' + options.id).show();
		}

		// 1st image to display set in options?
		if ((typeof options.showimage != 'undefined') && (options.showimage >= 0)) {
			jQuery.superbg_imgActual = options.showimage;
		}

		// display random image?
		if (options.randomimage === 1) {
			jQuery.superbg_imgActual = (1 + parseInt(Math.random() * (jQuery.superbg_imgIndex - 1 + 1), 10));
		}

		// display 1st image
		jQuery(this).superbgShowImage(jQuery.superbg_imgActual);

	};

	// timer-function for preloading images
	jQuery.fn.superbgimagePreload = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// clear timer
		clearInterval(jQuery.superbg_preload);

		// preload only if first image is loaded and linked images exist
		if (!jQuery.superbg_firstLoaded && (jQuery('#' + jQuery.superbg_saveId).children('a').length > 0)) {
			jQuery.superbg_preload = setInterval("jQuery(this).superbgimagePreload()", 111);
			return;
		}

		// get first image that is not loaded
		jQuery('#' + jQuery.superbg_saveId).children('a.preload:first').each(function() {

			// get image index and title
			var imgrel = jQuery(this).attr('rel');
			var imgtitle = jQuery(this).attr('title');

			// preload image, set rel and title, prepend image to container, remove preload class
			var img = new Image();

      // add the image source
      $( img ).attr('src', jQuery(this).attr('data-' + options.devicePixelRatio + 'x'));

			jQuery( img ).imagesLoaded(function() {

				jQuery(this).css('position', 'absolute').hide();
				if (jQuery('#' + options.id).children('img' + "[rel='" + imgrel + "']").length === 0) {
					jQuery(this).attr('rel', imgrel);
					if (options.showtitle === 1) {
						jQuery(this).attr('title', imgtitle);
					}
					jQuery('#' + options.id).prepend(this);
				}

			}).error(function() {


			})

			// set timer to preload next image
			jQuery.superbg_preload = setInterval("jQuery(this).superbgimagePreload()", 111);


		}).removeClass('preload');

	};

	// start slideshow
	jQuery.fn.startSlideShow = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// save active image
		jQuery.superbg_imgSlide = jQuery.superbg_imgActual;

		// clear previous timer
		if (jQuery.superbg_interval !== 0) {
			clearInterval(jQuery.superbg_interval);
		}

		// set timer and switch
		jQuery.superbg_interval = setInterval("jQuery(this).nextSlide()", options.slide_interval);
		jQuery.superbg_slideshowActive = true;

		return false;

	};

	// stop slideshow
	jQuery.fn.stopSlideShow = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// clear timer, set switch
		clearInterval(jQuery.superbg_interval);
		jQuery.superbg_slideshowActive = false;

		return false;

	};

	// next slide
	jQuery.fn.nextSlide = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// animation is running?
		if (jQuery.superbg_inAnimation) return false;

		// clear timer when slideshow is active
		if (jQuery.superbg_slideshowActive) {
			clearInterval(jQuery.superbg_preload);
		}

		// direction for transition 90+91
		jQuery.superbg_direction = 0;

		// index to next slide
		jQuery.superbg_imgSlide++;
		if (jQuery.superbg_imgSlide > jQuery.superbg_imgIndex) {
			jQuery.superbg_imgSlide = 1;
		}

		// display random images? index to random slide
		if (options.randomimage === 1) {
			jQuery.superbg_imgSlide = (1 + parseInt(Math.random() * (jQuery.superbg_imgIndex - 1 + 1), 10));
			while (jQuery.superbg_imgSlide === jQuery.superbg_imgLast) {
				jQuery.superbg_imgSlide = (1 + parseInt(Math.random() * (jQuery.superbg_imgIndex - 1 + 1), 10));
			}
		}

		// set actual index
		$.superbg_imgActual = jQuery.superbg_imgSlide;

		// show image
		return jQuery(this).superbgShowImage( jQuery.superbg_imgActual );

	};

	// previous slide
	jQuery.fn.prevSlide = function() {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// animation is running?
		if (jQuery.superbg_inAnimation) return false;

		// direction for transition 90+91
		jQuery.superbg_direction = 1;

		// index to previous slide
		jQuery.superbg_imgSlide--;
		if (jQuery.superbg_imgSlide < 1) {
			jQuery.superbg_imgSlide = jQuery.superbg_imgIndex;
		}

		// display random images? index to random slide
		if (options.randomimage === 1) {
			jQuery.superbg_imgSlide = (1 + parseInt(Math.random() * (jQuery.superbg_imgIndex - 1 + 1), 10));
			while (jQuery.superbg_imgSlide === jQuery.superbg_imgLast) {
				jQuery.superbg_imgSlide = (1 + parseInt(Math.random() * (jQuery.superbg_imgIndex - 1 + 1), 10));
			}
		}

		// set actual index
		jQuery.superbg_imgActual = jQuery.superbg_imgSlide;

		// show image
		return jQuery(this).superbgShowImage(jQuery.superbg_imgActual);

	};

	// handle resize-event, resize active image
	jQuery.fn.superbgResize = function() {

		var options = jQuery.extend( jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options );

		// get active image
		var thisimg = jQuery('#' + options.id + ' img.activeslide');

		// calculate size and position
		var dimensions    = jQuery(this).superbgCalcSize( jQuery(thisimg).width(), jQuery(thisimg).height() ),
    		newwidth      = dimensions[0],
    		newheight     = dimensions[1]
    		newleft       = dimensions[2],
    		newtop        = dimensions[3],
        topAnim       = 0;

		// fix for IE6
		if (jQuery.superbg_isIE6 && (options.inlineMode === 0)) {
			jQuery('#' + options.id).width(newwidth).height(newheight);
			jQuery(thisimg).width(newwidth);
			jQuery(thisimg).height(newheight);
		}

		// set new top when option vertical_center is on, otherwise set to 0
		if (options.vertical_center === 1){
      topAnim = newtop;
		} else {
      topAnim = 0;
    }

	// set new left position, width & height
	jQuery(thisimg).stop().animate({
	  'width'  : newwidth + 'px',
	  'height' : newheight + 'px',
	  'left'   : newleft + 'px',
	  'top'    : topAnim
	}, 250);


	};

	// calculate image size, top and left position
	jQuery.fn.superbgCalcSize = function(imgw, imgh) {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

    // console.log(imgw + ' : ' + imgh);

		// get browser dimensions
		var browserwidth = jQuery('#' + options.id).width();
		var browserheight = jQuery('#' + options.id).height();

		// use container dimensions when inlinemode is on
		if (options.inlineMode === 1) {
			browserwidth = jQuery('#' + options.id).width();
			browserheight = jQuery('#' + options.id).height();
		}

		// calculate ratio
		var ratio = imgh / imgw;
		var browser_ratio = browserheight / browserwidth;

		if( browser_ratio > ratio ){

			if( jQuery('body.fit-images').size() ){

				newwidth = browserwidth;
				newheight = Math.round( browserwidth * ratio );

			}else{

				if( ratio <= 0.5 ) {
					newwidth  = Math.round( browserheight / ratio );
					newheight  = browserheight;
				}else{
					newheight = browserheight;
					newwidth  = Math.round( browserheight / ratio );
				}

			}

		}else{

			if( jQuery('body.fit-images').size() ){

				// allways fit images to browser dimensons
				var j = browserheight / imgh;
				newwidth  = Math.round( imgw * j );
				newheight = browserheight;

				if( ratio <= 0.5 ) {
					newheight = browserheight;
					newwidth  = Math.round( browserheight / ratio );
				}

			}else{

				if( ratio > 1 || ratio == 1){

					// portrait and squared images
					var j = browserheight/ imgh;
					newwidth  = Math.round(imgw*j);
					newheight = browserheight;

				}else{

					// landscape images
					newheight = Math.round( browserwidth * ratio );
					newwidth = browserwidth;

				}

			}
		}

		// calculate new left and top position
		var newleft = Math.round((browserwidth - newwidth) / 2);
		var newtop = Math.round((browserheight - newheight) / 2);

		var rcarr = [newwidth, newheight, newleft, newtop];
		return rcarr;

	};

	// show image, call callback onHide
	jQuery.fn.superbgShowImage = function(img) {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		// get image-index from rel-attribute of the link
		jQuery.superbg_imgActual = jQuery(this).attr('rel');
		if (typeof img !== 'undefined') {
			jQuery.superbg_imgActual = img;
		}

		// exit when already active image
		if (jQuery('#' + options.id + ' img.activeslide').attr('rel') === jQuery.superbg_imgActual) {
			return false;
		}

		// exit when animation is running, otherwise set switch
		if (jQuery.superbg_inAnimation) {
			return false;
		} else {
			jQuery.superbg_inAnimation = true;
		}

		// get source and title from link
		var imgsrc = ''; var imgtitle = '';
		if (jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']").length === 0) {
			imgsrc = jQuery('#' + jQuery.superbg_saveId + ' a' + "[rel='" + jQuery.superbg_imgActual + "']").attr('href');
			imgtitle = jQuery('#' + jQuery.superbg_saveId + ' a' + "[rel='" + jQuery.superbg_imgActual + "']").attr('title');
		// otherwise get source from image
		} else {
			imgsrc = jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']").attr('href');
		}

		// callback function onHide
		if ((typeof options.onHide === 'function') && (options.onHide !== null) && (jQuery.superbg_imgLast >= 0)) {

			options.onHide(jQuery.superbg_imgLast);
		}

		// load the image, do selected transition
		jQuery('#' + options.id + ' img.activeslide').superbgLoadImage(imgsrc, imgtitle);

		// set class activeslide for the actual link
		jQuery('#' + jQuery.superbg_saveId + ' a').removeClass('activeslide');

		var active_link = jQuery('#' + jQuery.superbg_saveId).children('a' + "[rel='" + jQuery.superbg_imgActual + "']");
		active_link.addClass('activeslide');

		// save image-index
		jQuery.superbg_imgSlide = jQuery.superbg_imgActual;
		jQuery.superbg_imgLast = jQuery.superbg_imgActual;

		return false;

	};

	// load image, show the image and perform the transition
	jQuery.fn.superbgLoadImage = function(imgsrc, imgtitle) {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		if( jQuery('#' + jQuery.superbg_saveId +' a.item').size() > 1){
			//jQuery('#my-loading').fadeIn(150);
		}

		// load image, add image to container
		if (jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']").length === 0) {

			var img = $('<img>').attr('src', imgsrc); // add the image source

			img.imagesLoaded(function() {

				jQuery(this).css('position', 'absolute').hide();
				if (jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']").length === 0) {
					jQuery(this).attr('rel', jQuery.superbg_imgActual);
					if (options.showtitle === 1) {
						jQuery(this).attr('title', imgtitle);
					}
					jQuery('#' + options.id).prepend(this);
				}

				var thisimg = jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']");
  				var dimensions = jQuery(this).superbgCalcSize(img.width(), img.height());

				// perform the transition
				jQuery(this).superbgTransition(thisimg, dimensions);
				// first image loaded?
				if (!jQuery.superbg_firstLoaded) {
					// start slideshow?
					if (options.slideshow === 1 && jQuery('#' +jQuery.superbg_saveId +' a.item').size() > 1 ) {
						jQuery(this).startSlideShow();
					}
					// preload files when images are linked
					if ((options.preload === 1) && (jQuery('#' + jQuery.superbg_saveId).children('a').length > 0)) {
						jQuery.superbg_preload = setInterval("jQuery(this).superbgimagePreload()", 250);
					}
				}

				jQuery.superbg_firstLoaded = true;


			}).error(function() {

				jQuery.superbg_inAnimation = false;

			});

		// image already loaded
		} else {

			var thisimg = jQuery('#' + options.id).children('img' + "[rel='" + jQuery.superbg_imgActual + "']");
			var dimensions = jQuery(this).superbgCalcSize( jQuery(thisimg).width(), jQuery(thisimg).height() );

			// perform the transition
			jQuery(this).superbgTransition(thisimg, dimensions);
			if (!jQuery.superbg_firstLoaded) {
				// start slideshow?
				if (options.slideshow === 1) {
					jQuery(this).startSlideShow();
				}
				// preload files when images are linked
				if ((options.preload === 1) && (jQuery('#' + jQuery.superbg_saveId).children('a').length > 0)) {
					jQuery.superbg_preload = setInterval("jQuery(this).superbgimagePreload()", 250);
				}
				jQuery.superbg_firstLoaded = true;
			}
		}

	};

	// perform the transition
	jQuery.fn.superbgTransition = function(thisimg, dimensions) {

		var options = jQuery.extend(jQuery.fn.superbgimage.defaults, jQuery.fn.superbgimage.options);

		var newwidth = dimensions[0];
		var newheight = dimensions[1];
		var newleft = dimensions[2];
		var newtop = dimensions[3];

		// set new width, height and left position
		jQuery(thisimg).css('width', newwidth + 'px').css('height', newheight + 'px').css('left', newleft + 'px');

		// callbacks onClick, onMouseenter, onMouseleave, onMousemove
		if ((typeof options.onClick === 'function') && (options.onClick !== null)) {
			jQuery(thisimg).unbind(options.clickevent).on(options.clickevent,function() { options.onClick(jQuery.superbg_imgActual); });
		}
		if ((typeof options.onMouseenter === 'function') && (options.onMouseenter !== null)) {
			jQuery(thisimg).unbind('mouseenter').mouseenter(function() { options.onMouseenter(jQuery.superbg_imgActual); });
		}
		if ((typeof options.onMouseleave === 'function') && (options.onMouseleave !== null)) {
			jQuery(thisimg).unbind('mouseleave').mouseleave(function() { options.onMouseleave(jQuery.superbg_imgActual); });
		}
		if ((typeof options.onMousemove === 'function') && (options.onMousemove !== null)) {
			jQuery(thisimg).unbind('mousemove').mousemove(function(e) { options.onMousemove(jQuery.superbg_imgActual, e); });
		}

		// random transition
		if (options.randomtransition === 1) {
			var randomtrans = (0 + parseInt(Math.random() * (jQuery.superbg_max_randomtrans - 0 + 1), 10));
			while (randomtrans === jQuery.superbg_lasttrans) {
				randomtrans = (0 + parseInt(Math.random() * (jQuery.superbg_max_randomtrans - 0 + 1), 10));
			}
			options.transition = randomtrans;
		}

		// set new top when option vertical_center is on, otherwise set to 0
		if (options.vertical_center === 1){
			jQuery(thisimg).css('top', newtop + 'px');
		} else {
			jQuery(thisimg).css('top', '0px');
		}

		// switch for transitionout
		var akt_transitionout = options.transitionout;
		// no transitionout for blind effect
		if ((options.transition === 6) || (options.transition === 7)) {
			akt_transitionout = 0;
		}

		// prepare last active slide for transition out/hide
		if (akt_transitionout === 1) {
			jQuery('#' + options.id + ' img.activeslide').removeClass('activeslide').addClass('lastslide').css('z-index', 0);
		} else {
			jQuery('#' + options.id + ' img.activeslide').removeClass('activeslide').addClass('lastslideno').css('z-index', 0);
		}

		// set z-index on new active image
		jQuery(thisimg).css('z-index', 1);

		// be sure transition is numeric
		options.transition = parseInt(options.transition, 10);
		jQuery.superbg_lasttrans = options.transition;

		// no transition
		var theEffect = ''; var theDir = '';
		if (options.transition === 0) {
			jQuery(thisimg).show(1, function() {
				if ((typeof options.onShow === 'function') && (options.onShow !== null)) options.onShow(jQuery.superbg_imgActual);
				jQuery.superbg_inAnimation = false;
				if (jQuery.superbg_slideshowActive) {
					jQuery('#' + options.id).startSlideShow();
				}
			}).addClass('activeslide');
		// transition fadeIn
		} else if (options.transition === 1) {
			jQuery(thisimg).fadeIn(options.speed, function() {
				if ((typeof options.onShow === 'function') && (options.onShow !== null)) options.onShow(jQuery.superbg_imgActual);
				jQuery('#' + options.id + ' img.lastslideno').hide(1, null).removeClass('lastslideno');
				jQuery.superbg_inAnimation = false;
				if (jQuery.superbg_slideshowActive) {
					jQuery('#' + options.id).startSlideShow();
				}
			}).addClass('activeslide');
		// other transitions slide and blind
		} else {
			if (options.transition === 2) { theEffect = 'slide'; theDir = 'up'; }
			if (options.transition === 3) { theEffect = 'slide'; theDir = 'right'; }
			if (options.transition === 4) { theEffect = 'slide'; theDir = 'down'; }
			if (options.transition === 5) { theEffect = 'slide'; theDir = 'left'; }
			if (options.transition === 6) { theEffect = 'blind'; theDir = 'horizontal'; }
			if (options.transition === 7) { theEffect = 'blind'; theDir = 'vertical'; }
			if (options.transition === 90) {
				theEffect = 'slide'; theDir = 'left';
				if (jQuery.superbg_direction === 1) {
					theDir = 'right';
				}
			}
			if (options.transition === 91) {
				theEffect = 'slide'; theDir = 'down';
				if (jQuery.superbg_direction === 1) {
					theDir = 'up';
				}
			}
			// perform transition slide/blind, add class activeslide
			jQuery(thisimg).show(theEffect, { direction: theDir }, options.speed, function() {
				if ((typeof options.onShow === 'function') && (options.onShow !== null)) options.onShow(jQuery.superbg_imgActual);
				jQuery('#' + options.id + ' img.lastslideno').hide(1, null).removeClass('lastslideno');
				jQuery.superbg_inAnimation = false;
				if (jQuery.superbg_slideshowActive) {
					jQuery('#' + options.id).startSlideShow();
				}
			}).addClass('activeslide');
		}

		// perform transition out
		if (akt_transitionout === 1) {
			// add some time to out speed
			var outspeed = options.speed;
			if (options.speed == 'slow') {
				outspeed = 600 + 200;
			} else if (options.speed == 'normal') {
				outspeed = 400 + 200;
			} else if (options.speed == 'fast') {
				outspeed = 400 + 200;
			} else {
				outspeed = options.speed + 200;
			}

			// no transition
			if (options.transition === 0) {
				jQuery('#' + options.id + ' img.lastslide').hide(1, null).removeClass('lastslide');
			// transition fadeIn
			} else if (options.transition == 1) {
				jQuery('#' + options.id + ' img.lastslide').fadeOut(outspeed).removeClass('lastslide');
			// other transitions slide and blind
			} else {
				if (options.transition === 2) { theEffect = 'slide'; theDir = 'down'; }
				if (options.transition === 3) { theEffect = 'slide'; theDir = 'left'; }
				if (options.transition === 4) { theEffect = 'slide'; theDir = 'up'; }
				if (options.transition === 5) { theEffect = 'slide'; theDir = 'right'; }
				if (options.transition === 6) { theEffect = ''; theDir = ''; }
				if (options.transition === 7) { theEffect = ''; theDir = ''; }
				if (options.transition === 90) {
					theEffect = 'slide'; theDir = 'right';
					if (jQuery.superbg_direction === 1) {
						theDir = 'left';
					}
				}
				if (options.transition === 91) {
					theEffect = 'slide'; theDir = 'up';
					if (jQuery.superbg_direction === 1) {
						theDir = 'down';
					}
				}
				// perform transition slide/blind, add class activeslide
				jQuery('#' + options.id + ' img.lastslide').hide(theEffect, { direction: theDir }, outspeed).removeClass('lastslide');
			}
		// no transition out
		} else {
			jQuery('#' + options.id + ' img.lastslide').hide(1, null).removeClass('lastslide');
		}

	};

  var dpr = 1;
  if(window.devicePixelRatio !== undefined) {
     dpr = window.devicePixelRatio;
  }

	// default options
	jQuery.fn.superbgimage.defaults = {
		id: 'superbgimage', // id for the containter
		player_id: 'superbgimageplayer', // id for player container
		z_index: 5, // z-index for the container
		inlineMode: 0, // 0-resize to browser size, 1-do not resize to browser-size
		showimage: 1, // number of first image to display
		vertical_center: 1, // 0-align top, 1-center vertical
		transition: 1, // 0-none, 1-fade, 2-slide down, 3-slide left, 4-slide top, 5-slide right, 6-blind horizontal, 7-blind vertical, 90-slide right/left, 91-slide top/down
		transitionout: 1, // 0-no transition for previous image, 1-transition for previous image
		randomtransition: 0, // 0-none, 1-use random transition (0-7)
		showtitle: 0, // 0-none, 1-show title
		slideshow: 0, // 0-none, 1-autostart slideshow
		slide_interval: 5000, // interval for the slideshow
		randomimage: 0, // 0-none, 1-random image
		speed: 'slow', // animation speed
		preload: 1, // 0-none, 1-preload images
		clickevent: 'click',
		onShow: null, // function-callback show image
		onClick: null, // function-callback click image
		onHide: null, // function-callback hide image
		onMouseenter: null, // function-callback mouseenter
		onMouseleave: null, // function-callback mouseleave
		onMousemove: null,
		devicePixelRatio: dpr // function-callback mousemove
	};

})(jQuery);