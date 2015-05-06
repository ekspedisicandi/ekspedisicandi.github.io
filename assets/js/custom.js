// Tooltip from CSS Globe written by Alen Grakalic (http://cssglobe.com)
this.tooltip = function(){xOffset = -10;yOffset = 10;jQuery.noConflict();jQuery(".tooltip").hover(function(e){this.t = this.title;this.title = "";jQuery("body").append("<p class='itooltip'>"+ this.t +"</p>");jQuery(".itooltip").css("top",(e.pageY - xOffset) + "px").css("left",(e.pageX + yOffset) + "px").fadeIn(500);},function(){this.title = this.t; jQuery(".itooltip").remove();});jQuery("a.tooltip").mousemove(function(e){jQuery(".itooltip").css("top",(e.pageY - xOffset) + "px").css("left",(e.pageX + yOffset) + "px");});};
//END TOOLTIP

jQuery.noConflict(); jQuery(document).ready(function(){

	tooltip();
	
	//LOADING ANIMATION
	jQuery('#loading').activity({segments: 12, width:5.5, space: 6, length: 13, color: '#fff'});
	jQuery(window).load(function(){
		jQuery('#loading').activity(false).fadeOut(500);
		jQuery('#header').fadeIn(500);
	});

	//VARIABLES
	var mainBox = jQuery('#main'),
		pageBox = jQuery(".pageContent"),
		//iPad,iPhone,iPod...
		deviceAgent = navigator.userAgent.toLowerCase(),
		iPadiPhone = deviceAgent.match(/(iphone|ipod|ipad)/);

	//ACCORDION TOGGLES	
	jQuery('.toggleButton').click(function(){
		jQuery(".toggleButton").not(this).removeClass('opened').next().slideUp(400);
		jQuery(".toggleButton").not(this).children('span').html("+");
		jQuery(this).toggleClass('opened').next().slideToggle(400);
		jQuery('.opened').children('span').html("&times;");
		jQuery(this).not('.opened').children('span').html("+");
		jQuery("html,body").animate({scrollTop:0},400);
		jQuery('body.page .entry').slideToggle(400);
	}).hover(function(){
		jQuery(this).stop(true,true).animate({paddingLeft:"10px",backgroundColor:'#99b3cc', color:'#000'},300);
	},function(){
		jQuery(this).stop(true,true).animate({paddingLeft:"8px",backgroundColor:'#333',color:'#fff'},300);
	});
    
    //CLOSE MAIN DIV
    jQuery("#closeBox").live('click', function(){
    	mainBox.fadeOut(400);
    	pageBox.animate({top:"0px"},600);
    	return false;
    }); 
    
    //OPEN MAIN DIV
    pageBox.live('click', function(){
    	jQuery(this).animate({top:"40px"},600);
    	mainBox.fadeIn(400);
    	return false;
    }); 
    
    //WIDGETS TOGGLE
	jQuery('.widgetsToggle').live('click', function(){
		jQuery('#sidebar').slideToggle(400);
		jQuery('.activeInfo').toggleClass('smallInfo');
		jQuery('.widgetsToggle').toggle();
		return false;
	});
	
	//MAP VARS
	var gMap = jQuery('#gMap'),
		containerHeight = jQuery(window).height(),
		marker = jQuery('.marker');
	
	//RESIZE VAR AND FUNCTION
	jQuery(window).resize(function() {
		var containerHeight = jQuery(window).height();
		gMap.css({height:containerHeight});
	});
	
	//GMAP STUFF
	gMap.css({height:containerHeight, width:"100%"});
	
        //NEXT MARKER 
        jQuery('#nextMarker').live('click', function(){
        	var activeMarker = jQuery('.activeMarker');
        	if(activeMarker.is(':not(:last-child)')){
        		activeMarker.removeClass('activeMarker').next('.marker').addClass('activeMarker').mouseover();
        	} else {
        		activeMarker.removeClass('activeMarker');
        		jQuery('.marker:first-child').addClass('activeMarker').mouseover();
        	}
        });
        //PREV MARKER
        jQuery('#prevMarker').live('click', function(){
        	var activeMarker = jQuery('.activeMarker');
        	if(activeMarker.is(':not(:first-child)')){
        		activeMarker.removeClass('activeMarker').prev('.marker').addClass('activeMarker').mouseover();
        	} else {
        		activeMarker.removeClass('activeMarker');
        		jQuery('.marker:last-child').addClass('activeMarker').mouseover();
        	}      
        });
       	//HOVER
        marker.live('mouseover', function(){
        	jQuery('.activeInfo').removeClass('activeInfo').hide();
        	jQuery(this).siblings('.marker').removeClass('activeMarker');
        	jQuery(this).addClass('activeMarker').children('.markerInfo').addClass('activeInfo').stop(true, true).show();
        	jQuery("#target").show();
        });
        //TARGET HOVER
        jQuery("#target").live('mouseover',function(){
        	jQuery(this).hide();
        });
              
    //MAP TYPE
    jQuery(".roadmap").live('click',function(){
    	jQuery("#gMap").gmap3({action: 'setOptions', args:[{mapTypeId:'roadmap'}]}); //hybrid, satellite, roadmap, terrain
    	jQuery(this).removeClass('roadmap').addClass('satellite');
    	jQuery("#mapStyle").toggleClass('satellite');
    });
    jQuery(".satellite").live('click',function(){
    	jQuery("#gMap").gmap3({action: 'setOptions', args:[{mapTypeId:'satellite'}]}); //hybrid, satellite, roadmap, terrain
    	jQuery(this).removeClass('satellite').addClass('roadmap');
    	jQuery("#mapStyle").toggleClass('satellite');
    });
    jQuery("#mapType").live('mouseover', function(){
       jQuery("#mapStyleContainer").stop(true,true).fadeIn(200);
    });
    jQuery("#mapType").live('mouseout', function(){
		jQuery("#mapStyleContainer").stop(true,true).fadeOut(100);
    });
	
	//REMOVE TITLE ATTRIBUTE
	jQuery("#dropmenu a, .attachment-small").removeAttr("title");
	
	//MENU
	jQuery("#dropmenu ul").css("display", "none"); // Opera Fix
	jQuery("#dropmenu li").hover(function(){
		jQuery(this).find('ul:first').stop(true,true).slideDown(100);
		},function(){
		jQuery(this).find('ul:first').hide();
	});
	jQuery("#dropmenu ul").parent().children("a").append("<span>&nbsp;&nbsp;+</span>");
	
	jQuery("#dropmenu ul li a").hover(function(){
		jQuery(this).stop(true,true).animate({paddingLeft:"20px"},300);
	},function(){
		jQuery(this).stop(true,true).animate({paddingLeft:"15px"},300);
	});
	
	//TOP AREA SPACING STUFF
	var headerHeight = jQuery("#header").height(),
		headerSpacing = headerHeight + 35;
	jQuery("#dropmenu > li > a, #description").css({lineHeight:headerHeight+"px"});
	jQuery("#dropmenu > li > ul").css({top:headerHeight+"px"});
	jQuery("#content").css({paddingTop:headerSpacing+"px"});
	
	//IF iPad
	if (iPadiPhone) {
		function windowSizes(){
			var windowHeight = jQuery(window).height(),
				footerSpacing = 75,
				mainHeight = windowHeight - headerSpacing - footerSpacing - 40;
			if(mainBox.outerHeight() > mainHeight) {	
				jQuery(mainBox).css({height:mainHeight,overflow:"auto"});
			}
		}
		
		windowSizes();
		
		jQuery(window).resize(function() {
			windowSizes();
		});
		
		jQuery('.toggleButton').click(function(){
			windowSizes();
		});
		
		jQuery('body').addClass('iPad');
				
	//IF NOT iPad
	} else {
		//ADD HANDLE AND MAKE DRAGGABLE
		mainBox.draggable({ handle:"#handle",opacity: 0.8}).resizable();
		
		mainBox.prepend("<div id='moveNotice'></div>");
		
		jQuery("#handle").hover(function(){		
			jQuery("#moveNotice").stop(true,true).fadeIn(200);
		},function(){
			jQuery("#moveNotice").stop(true,true).fadeOut(200);
		});
	}
	
	//FORM STUFF...
	jQuery("#contactform #submit_btn").click(function() {  
		
	var normalborder = "1px solid #3a3a3a",
		normalbackground = "#333",
		normalcolor = "#fff",
		errorborder = "1px solid red",
		errorbackground = "#ffd3c9",
		errorcolor = "#333";  		
	    
	    jQuery("#contactform .input, #contactform textarea").css({border:normalborder, background:normalbackground, color:normalcolor});
	    		
		var name = jQuery("#contactform input#name");
		if (name.val() == "") {
			name.focus().css({border:errorborder, background:errorbackground, color:errorcolor});
			return false;
		}
		var email = jQuery("#contactform input#email");
		if (email.val() == "") {
	      	email.focus().css({border:errorborder, background:errorbackground, color:errorcolor});
	     	return false;
		}		
		var message = jQuery("#contactform textarea#message");
		if (message.val() == "") {
	      	message.focus().css({border:errorborder, background:errorbackground, color:errorcolor});
	     	return false;
		}
	});
		
	//PRETTY PHOTO
	jQuery("a[href$='jpg'],a[href$='jpeg'],a[href$='png'],a[href$='gif']").attr({rel: "prettyPhoto[pp_gal]"});
	jQuery("a[rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'normal', // fast/slow/normal 
		opacity: 0.35, // Value betwee 0 and 1 
		show_title: false, // true/false 
		allow_resize: true, // true/false 
		overlay_gallery: false,
		counter_separator_label: ' of ', // The separator for the gallery counter 1 "of" 2 
		//theme: 'light_rounded', // light_rounded / dark_rounded / light_square / dark_square 
		hideflash: true, // Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto 
		modal: false // If set to true, only the close button will close the window 
	});
});