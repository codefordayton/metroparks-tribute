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

function replaceValues(location) {
    return [
        '<li id="shelter-adirondackparking-lot-shelter-list-item" class="insivia-frmp-list-item">',
        '<span class="insivia-frmp-list-item-content insivia-frmp-row">',
        '<span class="insivia-frmp-list-item-content-left">',
        '<p class="insivia-frmp-list-item-name">', location.Type, '<span class="insivia-frmp-list-item-location"> at ', location.MetroPark, '</span>',
        '</p>',
        '<p class="insivia-frmp-list-item-address-wrapper">',
        '<span class="insivia-frmp-list-item-address"></span>',
        '</p>',
        '<span class="insivia-frmp-gallery-link">',
        '<a href="/gallery786131" data-api="facilities" data-id="786131" data-type="facility">View gallery</a>',
        '</span>',
        '</span>',
        '<span class="insivia-frmp-list-item-content-middle">',
        '<span class="insivia-frmp-list-item-list-content-top">',
        '<p class="insivia-frmp-list-item-capacity"><strong>Cost:</strong> ',
        location.Cost, '<span class="insivia-frmp-list-item-capacity-value"></span>',
        '</p>',
        '</span>',
        '<span class="insivia-frmp-list-item-amenities">',
        '<p><strong>Location Description</strong></p>',
        '<!-- <ul class="insivia-frmp-list-item-amenities-list insivia-frmp-row">',
        '<li class="insivia-frmp-list-item-amenity carry-in-water" data-name="Carry in Water" title="Carry in Water"></li>',
        '<li class="insivia-frmp-list-item-amenity grills" data-name="Grills" title="Grills"></li>',
        '<li class="insivia-frmp-list-item-amenity nature-trails" data-name="Nature trails" title="Nature trails"></li>',
        '<li class="insivia-frmp-list-item-amenity picnic-tables" data-name="Picnic Tables" title="Picnic Tables"></li>',
        '</ul> -->',
        '<p>Location Status: ', location.Status, '</p>',
        '</span>',
        '</span>',
        '<span class="insivia-frmp-list-item-content-right">',
        '<!-- <p class="insivia-frmp-list-item-view-details-wrapper">',
        '<a href="786131" class="blue-btn btn interactive-map-listing-btn view-details popup-btn" data-api="facilities" data-id="786131" data-type="facility">View details</a>',
        '</p> -->',
        '<p class="insivia-frmp-list-item-reserve-now-wrapper">',
        '<a class="blue-btn btn reserve-now" data-id="786131">Purchase Now</a>',
        '</p>',
        '</span>',
        '</span>',
        '</li>'
    ].join('');
}

function cfdShowInfo(data, tabletop) {
    console.log(JSON.stringify(data));
    data.forEach(function(elem) {
        if (elem) {
			let lat = parseFloat(elem.Latitude);
			let lon = parseFloat(elem.Longitude);

			if (lat && lon) {
				var marker = new google.maps.Marker({
                    position: {lat: lat, lng: lon},
                    map: cfdTributeMap,
                    title: elem.MetroPark + " " + elem.Type + ': ' + item['Location Description']
                });
			}

            $('#tribute-searchresults').append(replaceValues(elem));
		}
    });
}
