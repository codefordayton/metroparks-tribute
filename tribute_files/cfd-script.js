var $ = jQuery.noConflict();
(function($, root, undefined) {
  $(function() {
    'use strict';

    function google_map(api, type, typeOfMap, target, url) {

      if(!target) return;

      //(url) ? url = url : url = '';

      //if(url == '') {
      //  (type == 'camping') ? url = baseUrl + api + '/camping/?access_token=' + accessToken : url = baseUrl + api + '?access_token=' + accessToken;
      //}

      //typeOfMap = landing, popup

      switch(typeOfMap) {
        case 'landing':
          window.map = new google.maps.Map(target, {
            center: { lat: 39.715654, lng: -84.191239 },
            zoom: 10,
            scrollwheel: false
          });


          // $.getJSON(url, function(json) {
          //
          //   for(var i = 0; i <= json.facilities.length; ++i) {
          //     if(json.facilities[i]) {
          //       if( json.facilities[i].latitude && json.facilities[i].longitude ) {
          //
          //         var img;
          //
          //         (type == 'camping') ? img = '/wp-content/plugins/insivia-frmp/_assets/images/camping-marker.png' : img = '/wp-content/plugins/insivia-frmp/_assets/images/shelter-marker.png';
          //
          //         var facilityID = json.facilities[i].id;
          //         var marker = new google.maps.Marker({
          //           position: new google.maps.LatLng(json.facilities[i].latitude, json.facilities[i].longitude),
          //           map: map,
          //           icon: img,
          //           title: json.facilities[i].name,
          //           id: facilityID,
          //         });
          //         marker.addListener('click', function() {
          //
          //           if( $('#marker-ghost') ) {
          //
          //             (type == 'camping') ? $('body').append('<span id="marker-ghost" data-id="'+$(this)[0].id+'" data-api="facilities" data-type="camp"></span>') : $('body').append('<span id="marker-ghost" data-id="'+$(this)[0].id+'" data-api="facilities" data-type="facility"></span>');
          //
          //             generate_faux_page( $('#marker-ghost') );
          //           }
          //         });
          //       } else {
          //         console.error( json.facilities[i].name + 'is missing: lat: '+json.facilities[i].latitude + ' long:' + json.facilities[i].longitude );
          //       }
          //     }
          //   }
          // });

          break;
        // case 'popup':
        //   var address = (target.getAttribute('data-address')) ? target.getAttribute('data-address') : '2581 S Patterson Blvd, Dayton, OH 45409',
        //       mapOptions = {
        //         zoom: 14,
        //         disableDefaultUI: true,
        //         scrollwheel: false,
        //         navigationControl: false,
        //         mapTypeControl: false,
        //         scaleControl: false,
        //         draggable: false,
        //         panCOntrol: false,
        //         disableDoubleClickZoom: true,
        //         mapTypeControlOptions: {
        //           mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        //         }
        //       },
        //       geocoder = new google.maps.Geocoder();
        //   geocoder.geocode({
        //     'address': address
        //   }, function(results, status) {
        //     if (status == google.maps.GeocoderStatus.OK) {
        //
        //       mapOptions.center = results[0].geometry.location;
        //       var map = new google.maps.Map(target, mapOptions);
        //
        //       var marker = new google.maps.Marker({
        //         position: results[0].geometry.location,
        //         map: map
        //       });
        //
        //     } else {
        //       console.error('The address could not be found for the following reason: ' + status);
        //     }
        //   });
        //
        //   break;
      }

    }

    function api_call(url, typeOfCall) {
      //url += facilitiesAPI+'/?access_token='+accessToken;
      google_map('', '', 'landing', document.getElementById('insivia-frmp-tribute-map'));


    }

    function init_api_integration() {
      if( $('#insivia-frmp-tribute-map').length  ) api_call('', 'tributes');
    }

    $(document).ready(function() {
      init_api_integration();
    });

  });

})(jQuery, this);
