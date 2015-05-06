/** Javascript to load the videos on demand **/

	// check for touchable device
	var isTouch =  false;
	if( jQuery('html').hasClass('touch') ){
		isTouch = true;
	}

	var video_viewport = jQuery(window).width();

	jQuery(window).smartresize(function(){
		video_viewport = jQuery(window).width();
	}).smartresize();

	// set the global video play to false
	window.videoplay = false;

	// store some variables for further use
	var $_main          = jQuery('#main'),
		$_page            = jQuery('#page'),
		$_primary         = jQuery('#primary'),
		$_myloading       = jQuery('#my-loading'),
		$_thmbs           = jQuery('#thumbnails'),
		$_sbgimage        = jQuery("#superbgimage"),
		$_sbgplayer       = jQuery("#superbgimageplayer"),
		$_supbgimg        = $_sbgplayer.size() > 0,
		$_fullplayer      = jQuery('#fullsizeVideo'),
		$_fullvid         = $_fullplayer.size() > 0,
		$_fullsizetimer   = jQuery('#fullsizeTimer'),
		$_fsg_button      = jQuery('#fsg_playbutton'),
		$_fullsize        = jQuery('#fullsize'),
		$_scanlines       = jQuery('#scanlines'),
		$_togthumbs       = jQuery('#toggleThumbs'),
		$_fsg_arrows	  = jQuery('.fsg-arrows'),
		clickevent        = 'click',
		fadeInterval      = 250;

	// catch the data-object attr from #thumbnails and parse the json
	var dataObject_Attr = $_thmbs.attr('data-object');
	var dataObject = jQuery.parseJSON(dataObject_Attr);

	// create the json Object handled by the getScript call
	var json = {
		post_type: window.videoUrl.type,
		postID:	window.videoUrl.postID,
		embedded_code: window.videoUrl.embedded_code,
		playerID: 'superbgimageplayer',
		poster_url: window.videoUrl.poster_url
	}

	if($_fullvid) {
  	json.playerID = 'fullsizeVideo';
	}

	var selfhosted = {};
	if(window.videoUrl.type == 'selfhosted') {
		selfhosted = {
			stretch_video: 	window.videoUrl.stretch_video,
			url_m4v: 	window.videoUrl.url_m4v,
			url_ogv: 	window.videoUrl.url_ogv,
			url_webm: window.videoUrl.url_webm
		}
	}

	// some options have to be changed on mobile devices
	if(isTouch === true){
		clickevent = 'touchend'; // change click event for play button to touchstart
		dataObject.fullsize_autoplay_video = 'false'; // disable autoplay on mobile devices, they do not work
	}

	// toggle player
	jQuery.fn.toggleWithVisibility = function(trigger){

		var container = jQuery(this);

		if( trigger == 'hide' && container.css('visibility') == 'visible' ) {
			jQuery(this).css({
				'height': '0',
				'visibility': 'hidden'
			});
		}

		if( trigger == 'show' && container.css('visibility') == 'hidden' ) {
			container.css({
				'height': '100%',
				'visibility': 'visible'
			});
		}

	}

  // function to toggle the video play button in a full size gallery
  jQuery.fn.togglePlayButton = function(toggle){

    if( toggle === 'show' ) {

      if( !Modernizr.csstransitions ){
        jQuery(this).fadeIn(fadeInterval);
  		}else{
  		  jQuery(this).removeClass('fsg-playbutton-hide');
  		}

		}

    if( toggle === 'hide' ) {

      if( !Modernizr.csstransitions ){
        jQuery(this).fadeOut(fadeInterval);
  		}else{
  		  jQuery(this).addClass('fsg-playbutton-hide');
  		}

		}

  }

  jQuery.fn.hideScanlines = function(css_class){
    // hide the scanlines
	  if( !Modernizr.csstransitions ){
	    $_scanlines.stop(false, true).fadeOut(fadeInterval);
		}else{
			$_scanlines.addClass(css_class);
		}
  }

	// on video end event function
	function onVideoEndTrigger(){

		window.videoplay = false;

		// hide the player container
		var playerContainer = $_sbgplayer;

		// hide the playbutton
		$_fsg_button.togglePlayButton('hide');

		playerContainer.addClass('video-hide');

		if($_supbgimg) {

			if($_thmbs.size() > 0 ) {

				if( !Modernizr.csstransitions ){

					$_thmbs.fadeIn(fadeInterval);

				}else{

					$_thmbs.removeClass('opacity-hide');

				}

				if( dataObject.homepage_show_thumbnails == 'true' && $_togthumbs.has('slide-up') ){
					if(dataObject.video_show_elements == 'true'){

						if(video_viewport >= 768 ){
							$_thmbs.toggleThumbnails('show', true);
						}

					}else{

						$_thmbs.hideAllElements('show', true);
					}

					}else{
						$_thmbs.hideAllElements('show', false);
				};

			};

			if( !Modernizr.csstransitions ){
				$_main.fadeIn(fadeInterval);
			}else{
				$_main.removeClass('opacity-hide');
			}

			// hide the scanlines
			$_scanlines.hideScanlines('opacity-hide');

			// show the page container when pausing video
			if(video_viewport <= 767 ){
				$_page.show();
			}

			$_fullsize.livequery(function(){

				if( $_fullsize.find('a[rel]').length > 1 && dataObject.fullsize_autoplay_slideshow == 'true' ){

					jQuery(this).nextSlide();

				} else if ( dataObject.fullsize_autoplay_slideshow == 'false' ){

					if( !Modernizr.csstransitions ){
						jQuery('#superbgimage').css({zIndex: 5}).stop(false, true).fadeIn(fadeInterval);
					}else{
						jQuery('#superbgimage').css({zIndex: 5}).removeClass('opacity-hide');
					}

					$_fsg_button.togglePlayButton('show');
					playerContainer.removeClass('video-hide');

				}else{
					jQuery(this).nextSlide();
				}

			})

		}

		if($_fullvid) {
			$_fullplayer.hideAllElements('show');
		}

	}

	// on video play event function
	function onVideoPlayTrigger(){

		var playerContainer = $_sbgplayer;
		window.videoplay = true;

	// hide active superbgimage	and show the player iframe
    if( !Modernizr.csstransitions ){
    	$_sbgimage.stop(false, true).fadeOut(fadeInterval);
    	$_fsg_arrows.stop(false, true).fadeOut(fadeInterval);
	}else{
		$_sbgimage.addClass('opacity-hide');
		$_fsg_arrows.addClass('fsg-arrows-opacity');
	}

	if ($_supbgimg) {

		// stop timer and slideshow and change controls
		$_fullsizetimer.stopTimer();
		$_fullsize.stopSlideShow();

		// hide the scanlines
		$_scanlines.hideScanlines('opacity-hide');

		if( isTouch ) {
			jQuery('#superbgplayer').removeClass('no-pointer-events');
		}

		// Hide the play button and some page elements
		if($_togthumbs.has('slide-down') ){
			// hide or show all page elements on video play
			if( typeof dataObject.video_show_elements != 'undefined' && dataObject.video_show_elements == 'true'){
			}else{
				$_thmbs.hideAllElements('hide');
			}
		};

		if( !Modernizr.csstransitions ){
			$_main.fadeOut(fadeInterval);
		}else{
			$_main.addClass('opacity-hide');
		}

		// hide the page container - make the video visible on mobile devices
		if(video_viewport <= 767 ){
			$_page.hide();
		}else{
			$_page.show();
		}

	}

		if(typeof videoPauseTrigger != 'undefined'){
			clearTimeout(videoPauseTrigger);
		}

		// hide thumbnails on fullsize video
		if($_fullvid) {

      if( !Modernizr.csstransitions ){
  			$_primary.fadeOut(fadeInterval);
  		}else{
  		  $_primary.addClass('opacity-hide');
  		}

			playerContainer = $_fullplayer;

			if($_thmbs.size() > 0 ) {
				if( typeof dataObject.video_show_elements != 'undefined' && dataObject.video_show_elements == 'true'){
					$_thmbs.toggleThumbnails('hide', false);
				}else{
					$_thmbs.hideAllElements('hide');
				}
			}else{
				$_fullplayer.hideAllElements('hide');
			}
    }

    // hide the play/pause button
    $_fsg_button.togglePlayButton('hide');

	}

	// function for video play click trigger
	function onVideoClickTrigger(){
    $_fsg_button.togglePlayButton('hide');
		$_fullsize.stopSlideShow();
	}

	// on video pause event function
	function onVideoPauseTrigger(){

		window.videoplay = false;

		var playerContainer = $_sbgplayer;

		if($_supbgimg){

  			if($_thmbs.size() > 0 ) {

          if( !Modernizr.csstransitions ){
            $_thmbs.fadeIn(fadeInterval);
      		}else{
      		  $_thmbs.removeClass('opacity-hide');
      		}

          if( isTouch ) {

            $_thmbs.hideAllElements('show', false, true);
            $_thmbs.toggleThumbnails('hide', false, false);

          }else{

    				if( dataObject.homepage_show_thumbnails == 'true' && $_togthumbs.hasClass('slide-up') ){

    					if(dataObject.video_show_elements == 'true'){
    						if(video_viewport >= 768 ){
    							$_thmbs.toggleThumbnails('show', true, true);
    						}
    					}else{
    						$_thmbs.hideAllElements('show', true);
    					}

    				}else{
      				$_thmbs.hideAllElements('show', true);
    				};

          }

  			};

		if( !Modernizr.csstransitions ){
			$_main.fadeIn(fadeInterval);
			$_fsg_arrows.fadeIn(fadeInterval);
		}else{
			$_main.removeClass('opacity-hide');
			$_fsg_arrows.removeClass('fsg-arrows-opacity');
		}

		// hide the scanlines
		$_scanlines.hideScanlines('opacity-hide');

		// show the page container when pausing video
		if(video_viewport <= 767 ){
			$_page.show();
		}

	};

		if($_fullvid) {

			playerContainer = $_fullplayer;

      if( !Modernizr.csstransitions ){
        $_primary.fadeIn(fadeInterval);
  		}else{
  		  $_primary.removeClass('opacity-hide');
  		}

			if($_thmbs.size() > 0 ) {

        if( !Modernizr.csstransitions ){
          $_thmbs.fadeIn(fadeInterval);
    		}else{
    		  $_thmbs.removeClass('opacity-hide');
    		}

				if( typeof dataObject.video_show_elements != 'undefined' && dataObject.video_show_elements == 'true'){
					$_thmbs.toggleThumbnails('show', true, true);
				}else{
					$_thmbs.hideAllElements('show');
				}
			}else{
				$_fullplayer.hideAllElements('show');
			}

		}

		/* show active superbgimage	and hide the player iframe */
		if( isTouch ){

	      	jQuery('#superbgplayer').addClass('no-pointer-events');

			if( !Modernizr.csstransitions ){
				jQuery('#superbgimage').css({zIndex: 5}).stop(false, true).fadeIn(fadeInterval);
			}else{
				jQuery('#superbgimage').css({zIndex: 5}).removeClass('opacity-hide');
			}

		}

	}

	function prepareVideoComponents(triggerClass, container){

		if( isTouch === true ){

			$_scanlines.hideScanlines('opacity-hide');

			if( !Modernizr.csstransitions ){
				jQuery('#superbgimage').fadeOut(fadeInterval);
			}else{
				jQuery('#superbgimage').addClass('opacity-hide');
			}

			jQuery('#superbgplayer, #superbgplayer iframe').removeClass('no-pointer-events');

			$_fsg_button.togglePlayButton('hide');
			$_thmbs.toggleThumbnails('hide', false, false);

		}else{

			/* block pointer events on pages */
			if($_supbgimg) {
				jQuery('#primary').addClass('no-pointer-events');
			}

		}

		if($_supbgimg) {

			jQuery('#fullsize a' + "[rel='" + jQuery.superbg_imgActual + "']").livequery(function(){
				/* add class trigger */
				jQuery('#'+json.playerID).addClass(triggerClass);
			})

			if(dataObject.fullsize_autoplay_video == 'false'){

				if( jQuery.fn.superbgimage.options.slideshow == 1 ){
					$_fullsizetimer.startTimer( jQuery.fn.superbgimage.options.slide_interval );
					$fullsize.startSlideShow();
				}else{
					$_fullsize.stopSlideShow();
				}

			}

		}else{

			$_fullsize.stopSlideShow();
			 jQuery('#'+json.playerID).addClass(triggerClass);

		}

		/* hide scanlines if video is */
		if(dataObject.fullsize_autoplay_video == 'true' || isTouch === true || json.post_type !== 'selfhosted' ){

			/* hide the scanlines */
			$_scanlines.hideScanlines('opacity-hide');

		}

		/* Show play pause button if video is no autoplay */
		if ( dataObject.fullsize_autoplay_video == 'false' && isTouch !== true  ) {
			$_fsg_button.togglePlayButton('show');
		}

		jQuery('#sidebar, #welcomeTeaser').click(function(event){
			//event.stopPropagation();
		})

	    // unblock UI after video is loaded
	    jQuery.unblockUI();

	}

	// -----------------------------------------------
	// THE YOUTUBE CALLBACKS
	// -----------------------------------------------

	if (json.post_type === 'youtube_embed') {

    $player_container = jQuery("#youtubeplayer");

    // destroy the current video element
    $player_container.tubeplayer('destroy');

    // hide / show some page elements
    jQuery('#'+json.playerID).removeClass('vimeoplayer_init jwplayer_init');
		jQuery('#vimeoplayer, #selfhostedplayer').addClass('video-hide').html();
		jQuery('#superbgimageplayer, #youtubeplayer').removeClass('video-hide');

    // set the default afterReady callback for the tubeplayer
    jQuery.tubeplayer.defaults.afterReady = function($player){

		// prepare the video components
		prepareVideoComponents('ytplayer_init', 'iframe')

		// add click action to play button and body
		var $_clickObject = $_fsg_button;
		$_clickObject.unbind(clickevent).on(clickevent,function(event){
			onVideoClickTrigger();
			$player_container.tubeplayer("play");
			return false;
		});

      // we are on desktops, perform some tasks
      if( !isTouch ) {

        // autoplay on desktops if set
  			if( dataObject.fullsize_autoplay_video == 'true' && !isTouch ){
  			  $player_container.tubeplayer("play");
  			}

			}
		}

		// play video in highres if set
		if(dataObject.fullsize_yt_hd == 'true'){
			jQuery.tubeplayer.defaults.preferredQuality = 'hd720';
		}

    $player_container.tubeplayer({
      width: "100%", // the width of the player
      height: "100%", // the height of the player
      allowFullScreen: "true", // true by default, allow user to go full screen
      initialVideo: json.embedded_code,
      modestbranding: false,
      showControls: true,
      annotations: false,

      onPlayerPlaying: function(){ // after the play method is called
        onVideoPlayTrigger();
      },

      onPlayerPaused: function(){ // when the player returns a state of paused

        $_fsg_button.togglePlayButton('show');

      	if(typeof videoPauseTrigger != 'undefined'){
      		clearTimeout(videoPauseTrigger);
      	}
      	// if paused clear activity trigger
      	videoPauseTrigger = setTimeout( "onVideoPauseTrigger()", 250);

      },

      onPlayerBuffering: function(){ // when the player returns a state of buffering

      },

      onPlayerEnded: function() { // when the player returns a state of ended
        onVideoEndTrigger();
      }

    });

	}

	// resize video containers
	if($_supbgimg) jQuery('#superbgplayer, #superbgimageplayer').removeClass('video-hide'); // its a full size gallery
	if($_fullvid) jQuery('#fullsizeVideoHolder, #fullsizeVideo').removeClass('video-hide'); // its a single full size video template

		// -----------------------------------------------
		// THE VIMEO PLAYER CALLBACKS
		// -----------------------------------------------

		if (json.post_type === 'vimeo_embed') {

			jQuery('#youtubeplayer, #selfhostedplayer').addClass('video-hide').html('');
			jQuery('#superbgimageplayer, #vimeoplayer').removeClass('video-hide');
			jQuery('#'+json.playerID).removeClass('ytplayer_init jwplayer_init');

			jQuery('#vimeoplayer')
				.html('<iframe id="vimeoPlayer_Frame" src="http://player.vimeo.com/video/'+json.embedded_code+'?quality=hd&api=1&player_id=vimeoPlayer_Frame&portrait=0&title=0" width="100%" height="100%" frameborder="0"></iframe>');

			var vimeoplayer;

			// function for pause event
			function vimeoPlayerPause(){

  			$_fsg_button.togglePlayButton('show');

				if(typeof videoPauseTrigger != 'undefined'){
					clearTimeout(videoPauseTrigger);
				}
				videoPauseTrigger = setTimeout( "onVideoPauseTrigger()", 250);
			}


			function vimeoPlayerPlay(){
				onVideoPlayTrigger();
			}

			function vimeoplayerReady(playerID) {

				var $_clickObject = $_fsg_button;

				$_clickObject.on(clickevent,function(event){

					if(event.target==this){
						onVideoClickTrigger();
						$f(playerID).api('play');
						return false;
					}

				});

				var prepare = prepareVideoComponents('vimeoplayer_init','object');
			}

			jQuery('body').livequery(function(){

				// Enable the API on each Vimeo video
				jQuery('iframe#vimeoPlayer_Frame').each(function(){
					$f(this).addEvent('ready', ready);
				});

				function ready(playerID){

					vimeoplayerReady(playerID);

					// add the event listeners
					function setupEventListeners() {

						// player is playing
						function onPlay() {
							$f(playerID).addEvent('play',
							function(data) {
								vimeoPlayerPlay();
							});
						}

						// player is paused
						function onPause() {
							$f(playerID).addEvent('pause',
							function(data) {
								vimeoPlayerPause();
								// is selfhosted video or vimeo video on touch device
							});
						}

						// player has finished playback
						function onFinish() {
							$f(playerID).addEvent('finish',
							function(data) {
								onVideoEndTrigger();
							});
						}
						onPlay();
						onPause();
						onFinish();
					}

					setupEventListeners();

					if(dataObject.fullsize_autoplay_video == 'true'){
						// Fire an API method
						// http://vimeo.com/api/docs/player-js#reference

						Froogaloop(playerID).api('play');
					}

				}

			})

		}

		if (json.post_type === 'selfhosted') {

			jQuery('#vimeoplayer, #youtubeplayer').addClass('video-hide').html('');
			jQuery('#'+json.playerID).removeClass('vimeoplayer_init ytplayer_init');

			var fileObj = [ { file: selfhosted.url_m4v }, { file: selfhosted.url_ogv }, { file: selfhosted.url_webm } ]  // create file levels object

			if(isTouch===true){
				var stretch_video = 'uniform';
			}else{
				var stretch_video = json.stretch_video;
			}

			// get the player
			jwPlayer = jwplayer('selfhostedplayer').setup({

				skin: dataObject.directory_uri+"/css/"+dataObject.color_main+"/jwplayer/invictus/invictus.xml",

				flashplayer: dataObject.directory_uri+"/js/jwplayer/player.swf",
				modes: [
					{ type: "html5" },
					{ type: "flash", src: dataObject.directory_uri+"/js/jwplayer/player.swf" }
				],

				image: json.poster_url,
				autoplay: dataObject.fullsize_autoplay_video,

				levels: fileObj,
				stretching: selfhosted.stretch_video,
				fullscreen: false,
				repeat: "none",
				height: 100 + "%",
				width: 100 + "%",
				events: {
					onReady: function(){

						jQuery('#superbgimageplayer, #selfhostedplayer').removeClass('video-hide');

						if( dataObject.fullsize_autoplay_video == 'false' ) {

							var $_clickObject = $_fsg_button.add($_main);
							$_clickObject.add($_page).unbind(clickevent).on(clickevent,function(event){

								if(event.target==this){
									onVideoClickTrigger();
									jwPlayer.play();
									return false;
								}

							});

						}

						// prepare the video components
						prepareVideoComponents('jwplayer_init', false);

					},

					onPlay: function(event){
						// init the play trigger
						onVideoPlayTrigger();
					},

					onPause: function(event){
						// init the pause trigger
						$_fsg_button.togglePlayButton('hide');
						onVideoPauseTrigger();
					},

					onComplete: function(event){
						jwPlayer.stop();
						onVideoEndTrigger();
					}

				},
				"controlbar.position": 'over'
			})
		}
