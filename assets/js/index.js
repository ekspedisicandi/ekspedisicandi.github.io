/**
 * Main JS file for RAIN behaviours
 */

(function ($) {

	"use strict";

	function specialFloor( number ){
		var fraction = 100;
		return Math.floor(number * fraction) / fraction;
	}

	function getScrollbarPosition(){
		var scrollbarPos;
		var pageHeaderHeight = 1 * $('header#site-head').outerHeight();

		scrollbarPos = 1 * $(window).scrollTop();
		scrollbarPos = scrollbarPos + pageHeaderHeight;
		// 0.38 = golden ratio
		scrollbarPos = scrollbarPos + ($(window).height() * 0.38);
		return specialFloor( scrollbarPos );
	}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Header
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Simulates click, mainly to trigger CSS animations

	$('.menu_button').click(function(){
		$('.menu').toggleClass('active');
	});

	// Header - Vertical Centering

	$(window).resize(function(){

		if( ( $('.jqres').width() <= 900 ) ){
			$('.post-title, .menu-title').removeAttr('style');
			return;
		}
		
		// Header Height Calculation

		var pageHeaderHeight = $('#site-head').outerHeight();
		$('.header-left, .header-right').css('height', specialFloor( pageHeaderHeight ) );

		// First Post Padding

		$('.post-title').each(function(){
			$(this).css('font-size',  specialFloor($('.content').width()*0.12/10)+'rem');
			$(this).css('line-height',specialFloor($('.content').width()*0.12/10)+'rem');
		});

		// Menu Title font size

		$('.menu-title').each(function(){
			$(this).css('font-size',  specialFloor($('.content').width()*0.087/10)+'rem');
			$(this).css('line-height',specialFloor($('.content').width()*0.087/10)+'rem');
		});
	});

	// Menu highlight active post

	$(window).scroll( function(){
		var index = findActualPostIndex();
		//document.title = index;

		$('.menu li').removeClass('active-item');
		$('.menu li:eq(' + index + ')').addClass('active-item');
	});

	// Pagination cloning for menu

	$('.pagination').clone().appendTo('.menu');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Left part of page = title and background
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Post Title Manipulation - Re-sizing and centering

	if( 1 < $('.post').size() ) {
		$(window).scroll(function(){

			if( ( $('.jqres').width() <= 900 ) ){
				$('.post, .post-title-wrapper, .post-title').removeAttr('style');
				return;
			}

			var bgHeight = specialFloor( $('#site-bg-image').height() );
			var posToFade = 0;
			$('.post-title').each(function(){
				var this_posToFade = specialFloor( $(this).outerHeight() + ($('.content').width()*0.2) );
				if ( this_posToFade > posToFade ) {
					posToFade = this_posToFade;
				}
			});

			//document.title = posToFade;
			$('.post-title').each(function(){

				// SETTINGS FOR FADING AND STUFF

				var minPostOpacity = 0.2;

				// END SETTINGS	

				var titleHeight = specialFloor( $(this).outerHeight() );
				var pageHeaderHeight = specialFloor( $('header#site-head').outerHeight() );
				var offset = $(this).parents('.post:first').offset();
				var titleWrapper = $(this).parent();
				//console.log(offset);
				var offset_top = specialFloor( offset.top );
				var offset_bottom = specialFloor( 1 * offset.top + 1 * $(this).parents('.post:first').outerHeight() );
				offset_bottom = specialFloor( offset_bottom + 1 * parseInt($('.post:first').css('marginBottom'), 10) );

				var scrollbarPos = specialFloor( getScrollbarPosition() );

				var _marginTop = specialFloor( pageHeaderHeight - 0.5 * titleHeight );

				if ( ( offset_top + posToFade <= scrollbarPos ) && ( scrollbarPos + posToFade < offset_bottom ) ) {
					titleWrapper.css('opacity', 1);
					//document.title = posToFade;
					titleWrapper.css('visibility', 'visible');
					$(this).parents('.post:first').css('opacity', 1);
				} else if ( ( offset_top - posToFade <= scrollbarPos ) && ( scrollbarPos - posToFade < offset_bottom ) ) {
					var _fraction = 0.5;

					if( 1 * offset_bottom <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*offset_bottom - 1*scrollbarPos ) / posToFade ) );
						_marginTop = specialFloor( _marginTop - (1-_fraction) * posToFade );
						//document.title = document.title + '|A' + _fraction;
					}else if( 1 * offset_bottom - posToFade <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*offset_bottom - 1*scrollbarPos ) / posToFade ) );
						_marginTop = specialFloor( _marginTop - (1-_fraction) * posToFade );
						//document.title = document.title + '|B' + _fraction;
					}else if( 1 * offset_top <= 1 * scrollbarPos ){
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*scrollbarPos - 1*offset_top ) / posToFade ) );
						_marginTop = specialFloor( _marginTop + (1-_fraction) * posToFade );
						//document.title = document.title + '|C' + _fraction;
					}else{
						_fraction = specialFloor( 0.5 + 0.5 * ( ( 1*scrollbarPos - 1*offset_top ) / posToFade ) );
						_marginTop = specialFloor( _marginTop + (1-_fraction) * posToFade );
						//document.title = document.title + '|D' + _fraction;
					}

					titleWrapper.css('opacity', _fraction );
					titleWrapper.css('visibility', 'visible');
					$(this).parents('.post:first').css('opacity', specialFloor( minPostOpacity + (1-minPostOpacity)*_fraction ) );
				} else {
					titleWrapper.css('opacity', 0);
					titleWrapper.css('visibility', 'hidden');
					$(this).parents('.post:first').css('opacity', minPostOpacity);
				}
								
				$(this).parent().css('marginTop', _marginTop);
			});
		}).scroll();
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Footer navigation - prev / next
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function findActualPostIndex(){
		var actualPostIndex = -1;

		$('.post').each(function( index ){
			$(this).find('p').css('border','10 px solid Red');

			var offset = $(this).offset();
			var offset_top = 1 * offset.top;
			var offset_bottom = 1 * offset.top + 1 * $(this).outerHeight();
			offset_bottom = 1 * offset_bottom + 1 * parseInt($('.post:first').css('marginBottom'), 10);

			var scrollbarPos = getScrollbarPosition();

			if ( ( offset_top <= scrollbarPos ) && ( scrollbarPos < offset_bottom ) ) {
				actualPostIndex = index;
			}
		});
		return actualPostIndex;
	}

	function getPostScrollPosition( postIndex){
		var postToScroll;
		var pageHeaderHeight;
		var where;

		postToScroll = $('.post:eq(' + postIndex + ')');
		pageHeaderHeight = 1 * $('header#site-head').outerHeight();
		where = $(postToScroll).offset();
		where = where.top;
		where = where - pageHeaderHeight;
		return where;
	}

	function scrollToPosition( position ){
		jQuery('html, body').stop().animate({
			'scrollTop': position
		}, 618, 'swing' );
	}

	if( 0 < $('.prev-post,.next-post').size() ){

		///////////////////////
		// Go Down

	
		$('.next-post').click(function(){
			var moveToPostIndex;
			moveToPostIndex = findActualPostIndex() + 1;
			if( moveToPostIndex < $('.post').size() ){
				var newPos = getPostScrollPosition( moveToPostIndex );
				scrollToPosition( newPos );
			}else{
				scrollToPosition( $('.content').height() );
			}
		});

		$(document).keydown(function(e){
	
			if( ( $('.jqres').width() <= 900 ) ) ;
	
			if( 34 == e.keyCode ){
				// Page Down
				$('.next-post').click();
				return false;
			}
		});

		$('.next-post').mouseover(function(){
			var actualPostIndex = findActualPostIndex() + 1;
			var others;
			
			others = $('.cat-nav-post').not( '.cat-nav-post:eq(' + actualPostIndex + ')' );
			others.removeClass('come-from-bottom');
			others.removeClass('come-from-top');
			$('.cat-nav-post:eq(' + actualPostIndex + ')').addClass('come-from-bottom');
		});

		$('.next-post').mouseout(function(){
			$('.cat-nav-post').removeClass('come-from-bottom');
			$('.cat-nav-post').removeClass('come-from-top');
		});

		///////////////////////
		// Go Up

		$('.prev-post').click(function(){
			var moveToPostIndex;
			var newPos;

			moveToPostIndex = findActualPostIndex() - 1;
			if( moveToPostIndex >= 0 ){
				if( getPostScrollPosition( moveToPostIndex + 1 ) <= $(window).scrollTop() ){
					newPos = getPostScrollPosition( moveToPostIndex +1);
					scrollToPosition( newPos );
				}else{
					newPos = getPostScrollPosition( moveToPostIndex + 0 );
					scrollToPosition( newPos );
				}
			}else{
				scrollToPosition( 0 );
			}
		});

		$(document).keydown(function(e){
	
			if( ( $('.jqres').width() <= 900 ) ) ;
	
			if( 33 == e.keyCode ){
				// Page Up
				$('.prev-post').click();
				return false;
			}
		});

		$('.prev-post').mouseover(function(){
			var actualPostIndex = findActualPostIndex() - 1;
			var others;
			
			if( 0 > actualPostIndex ){
				actualPostIndex = 9999999;
			}

			others = $('.cat-nav-post').not( '.cat-nav-post:eq(' + actualPostIndex + ')' );
			others.removeClass('come-from-bottom');
			others.removeClass('come-from-top');
			$('.cat-nav-post:eq(' + actualPostIndex + ')').addClass('come-from-top');
		});

		$('.prev-post').mouseout(function(){
			$('.cat-nav-post').removeClass('come-from-bottom');
			$('.cat-nav-post').removeClass('come-from-top');
		});

		///////////////////////
		// Changes by scrolling

		$(window).scroll(function(){
			var actualPostIndex = findActualPostIndex();
			if( 0 >= actualPostIndex ){
				$('.prev-post').hide();
			}else{
				$('.prev-post').show();
			}
			
			if( $('.post').size() - 1 <= actualPostIndex ){
				$('.next-post').hide();
			}else{
				$('.next-post').show();
			}

			$('.prev-post:hover').mouseover();
			$('.next-post:hover').mouseover();
		});
	
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if ( 1 > $('script[src*="init_rainyday"]').size() ) {
		if ( '' != $('#ccontainer').attr('data-bg') ){
			$('#ccontainer').css('background-image', 'url('+$('#ccontainer').attr('data-bg')+')');
		}
		return;
	}

	$(window).load(function(){

		// On the home page, move the blog icon inside the header 
		// for better relative/absolute positioning.

		$('#site-bg-image').show();

		$(window).resize(function(){
			$(window).scroll();
		});

		$(window).resize();
		$(window).scroll();
	});
	

}(jQuery));