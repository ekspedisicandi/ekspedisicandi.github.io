function initialize() {
    
    var spartanburg = new google.maps.LatLng(-7.797224000000000000,110.368796999999970000); 
    
    var mapOptions = {
        zoom: 14,
        center: spartanburg
    }

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
    // Black background layers
    var exisitingTrailsBackground = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ExistingBackground_Trails.kmz',
      suppressInfoWindows : true,
      preserveViewport : true,
      zIndex : 0
    });
  
    var exisitingBikewaysBackground = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ExistingBackground_Bikeways.kmz',
      suppressInfoWindows : true,
      preserveViewport : true,
      zIndex : 0
    });

    // Existing Layers
    var existingTrailsLayer = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ExistingTrails_030714.kmz',
      preserveViewport : true,
      zIndex : 1
    });

    var existingBikewaysLayer = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ExistingBikeways_030714.kmz',
      preserveViewport : true,
      zIndex : 1
    });

    // Proposed Layers
    var proposedTrailsLayer = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ProposedTrails_031314_Dash.kmz',
      preserveViewport : true,
      zIndex : 2
    });

    var proposedBikewaysLayer = new google.maps.KmlLayer({
      url : 'http://diccfish.com/ProposedBikeways_031314_Dash.kmz',
      preserveViewport : true,
      zIndex : 2
    });

    // Add all trails to map
    exisitingTrailsBackground.setMap(map);
    exisitingBikewaysBackground.setMap(map);
    existingTrailsLayer.setMap(map);  
    existingBikewaysLayer.setMap(map);   
    proposedTrailsLayer.setMap(map);   
    proposedBikewaysLayer.setMap(map); 
  
    // Legend Controls
    var existingTrailsCheckbox = document.getElementById( 'existing-trails' ),
        existingBikewaysCheckbox = document.getElementById( 'existing-bikeways' ),
        proposedTrailsCheckbox = document.getElementById( 'proposed-trails' ),
        proposedBikewaysCheckbox = document.getElementById( 'proposed-bikeways' );
  
    jQuery( 'input[type="checkbox"]' ).on( 'click', function() { 
  
      if ( existingTrailsCheckbox.checked ) {
        existingTrailsLayer.setMap(map);
        exisitingTrailsBackground.setMap(map);
      } else {
        existingTrailsLayer.setMap(null);
        exisitingTrailsBackground.setMap(null);
      } 
  
      if ( existingBikewaysCheckbox.checked ) {
        existingBikewaysLayer.setMap(map); 
        exisitingBikewaysBackground.setMap(map);
      } else {
        existingBikewaysLayer.setMap(null); 
        exisitingBikewaysBackground.setMap(null);
      } 
  
      if ( proposedTrailsCheckbox.checked ) {
        proposedTrailsLayer.setMap(map); 
      } else {
        proposedTrailsLayer.setMap(null); 
      } 
  
      if ( proposedBikewaysCheckbox.checked ) {
        proposedBikewaysLayer.setMap(map); 
      } else {
        proposedBikewaysLayer.setMap(null); 
      } 
    
    });
}

google.maps.event.addDomListener(window, 'load', initialize);