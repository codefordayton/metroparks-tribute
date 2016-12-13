function interactiveParkMap () {

  var allMarkers = jQuery('#interactive-park-map').find('.marker'); 
  //var geocoder = new google.maps.Geocoder();

  var map = new google.maps.Map(document.getElementById('interactive-park-map'), {
    zoom: 10, 
   //center    : new google.maps.LatLng(40.037724, -82.431503),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    streetViewControl: true,
  });

  map.markers = [];
  var mainLocation;
  var infowindow = new google.maps.InfoWindow();

  allMarkers.each(function(){

          var locationLat = jQuery(this).attr('data-lat');
          var locationLng = jQuery(this).attr('data-long');
          var latlng = new google.maps.LatLng( locationLat, locationLng );
          var address = jQuery(this).attr('data-address');
          var title = jQuery(this).attr('data-title');

          console.log(latlng);

            var marker = new google.maps.Marker({
                //position: results[0].geometry.location,
                position  : latlng,
                map: map, 
                title: address,
                icon: templateUrl + '/assets/imgs/interactive-map-leaf.png' 
            }); 

            var directions = "https://www.google.com/maps?saddr=My+Location&daddr=" + address;
            var directionsLink = '<a href="' + directions + '" class="infowindow-directions" target="_blank">Directions > </a>'
            var contentString = '<p class="infowindow-title">' + title + '</p>' + '<p class="infowindow-address">' + address + '</p>' + directionsLink;
           
           if(!jQuery(this).hasClass('no-marker')){
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
              });
            }

            // add to array
            map.markers.push( marker );
    });

 // center_map(map);

  if( map.markers.length < 1){
    var latLng = new google.maps.LatLng(39.7796012, -84.2723693);
    map.setCenter(latLng);
  } else {
    center_map( map );
  }

}

//
//
//
// Center Map Function 
//
function center_map( map ) {

  // vars
  var bounds = new google.maps.LatLngBounds();

  // loop through all markers and create bounds
  jQuery.each( map.markers, function( i, marker ){

    var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

    bounds.extend( latlng );

  });

  // only 1 marker?
  if( map.markers.length == 1 )
  {
    // set center of map
      map.setCenter( bounds.getCenter() );
      map.setZoom( 10 );
  }
  else
  {
    // fit to bounds
    map.fitBounds( bounds );
  }

}

    /*if(jQuery('.marker').length === 0){
    var noMarkers = '<div class="marker no-marker" data-address="Cleveland, Ohio"></div>'; 
    jQuery('#interactive-park-map').append(noMarkers); 
  }*/
    

    /*var latlng = new google.maps.LatLng( jQuery(this).attr('data-lat'), jQuery(this).attr('data-lng') );
    var locationLat = jQuery(this).attr('data-lat');
    var locationLng = jQuery(this).attr('data-lat');

    mainLocation = latlng; */

    /*if (geocoder) {
      var address = jQuery(this).attr('data-address');
      var title = jQuery(this).attr('id');

      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
          map.setCenter(results[0].geometry.location);*/
