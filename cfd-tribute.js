// Add cfd tribute initialization function to onload
window.onload = function() {
    cfdInit();
};

var cfdTributeMap;
var CFD_SPREADSHEET = 'https://docs.google.com/spreadsheets/d/1tA1G_0xZfZLkvDK92QOjQ8JC59XtfiMpWUyWdvZiVE8/pubhtml';

// Called on page load
function cfdInit() {
    Tabletop.init({
        key: CFD_SPREADSHEET,
        callback: cfdShowInfo,
        simpleSheet: true
    });
}

function cfdInitMap() {
    cfdTributeMap = new google.maps.Map(document.getElementById('insivia-frmp-shelter-map'), {
        center: { lat: 39.715654, lng: -84.191239 },
        zoom: 8
    });
}

function cfdShowInfo(data, tabletop) {
    console.log('Loaded ' + data.length + ' tribute items...');

    let bounds = new google.maps.LatLngBounds();
    data.forEach(function(elem) {
        if (elem) {
			let lat = parseFloat(elem.Latitude);
			let lon = parseFloat(elem.Longitude);

			if (lat && lon) {
				var marker = new google.maps.Marker({
                    position: {lat: lat, lng: lon},
                    map: cfdTributeMap,
                    title: elem.MetroPark + " " + elem.Type + ': ' + elem['Location Description']
                });

                var contentString =
                    '<div class="marker-content">' +
                        '<h1>' + elem.Type + '</h1>' +
                        '<span>' + elem.Cost + '</span><br>' +
                        '<span><strong>' + elem.MetroPark + '</strong></span><br>' +
                        '<span>' + elem['Location Description'] + '</span><br>' +
                        '<span><strong>Status:</strong> ' + elem.Status + '</span>' +
                    '</div>';

                marker.infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function() {
                    if (marker.infowindow.map) {
                        marker.infowindow.close();
                    } else {
                        marker.infowindow.open(cfdTributeMap, marker);
                    }
                });

                bounds.extend({lat: lat, lng: lon});
			}
		}

        var template = jQuery('#cfd-tribute-result-template').html();
        var row = jQuery(template);
        row.find('.insivia-frmp-list-item-type').text(elem.Type);
        row.find('.insivia-frmp-list-item-location').text('at ' + elem.MetroPark);
        row.find('.insivia-frmp-list-item-cost').text(elem.Cost);
        row.find('.insivia-frmp-list-item-location-description').html('<strong>Location:</strong> ' + elem['Location Description']);
        row.find('.insivia-frmp-list-item-location-status').html('<strong>Status:</strong> ' + elem.Status);
        jQuery('#tribute-searchresults').append(row);

    });

    if (!bounds.isEmpty()) {
        cfdTributeMap.fitBounds(bounds);
    }
}
