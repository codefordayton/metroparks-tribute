const CFD_SPREADSHEET = 'https://docs.google.com/spreadsheets/d/1rOgUf2f6PwxUKVUZ9RgmO6Ulhh5PquNuFvNROovvd1w/export?format=csv';
const CFD_MAP_CENTER = [39.715654, -84.191239];
const CFD_MAP_ZOOM = 8;

let map = null;
let cfdData = [];
let cfdMarkers = [];
let noResultsDiv = null;

window.onload = function() {
    cfdInitMap();
    cfdInit();
};

function cfdInitMap() {
    if (map) {
        return;
    }
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded. The tribute map is disabled.');
        return;
    }
    map = L.map('insivia-frmp-shelter-map').setView(CFD_MAP_CENTER, CFD_MAP_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function cfdInit() {
    cfdFetchTributeData();

    jQuery('.data-filter').change(function() {
        cfdUpdateInfo({
            park: jQuery('#shelter-filter-parks').val(),
            type: jQuery('#shelter-filter-types').val()
        });
    });
}

function cfdFetchTributeData() {
    Papa.parse(CFD_SPREADSHEET, {
        download: true,
        header: true,
        skipEmptyLines: 'greedy',
        complete: function(results) {
            console.log('Successfully fetched ' + results.data.length + ' tribute items from the spreadsheet.');
            cfdShowInfo(results.data);
        },
        error: function(error) {
            console.error('Failed to fetch tribute data from the spreadsheet:', error);
        }
    });
}

function cfdUpdateInfo(dataFilters) {
    const filters = Object.assign({}, dataFilters);

    if (map) {
        const bounds = L.latLngBounds();
        for (let i = 0; i < cfdMarkers.length; i++) {
            const item = cfdData[cfdMarkers[i].elementIndex];
            if ((filters.park && filters.park !== item.MetroPark) ||
                (filters.type && filters.type !== item.Type)) {
                cfdMarkers[i].remove();
            }
            else {
                cfdMarkers[i].addTo(map);
                bounds.extend(cfdMarkers[i].getLatLng());
            }
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds);
            if (noResultsDiv) {
                noResultsDiv.remove();
                noResultsDiv = null;
            }
        }
        else {
            map.setView(CFD_MAP_CENTER, CFD_MAP_ZOOM);
            if (!noResultsDiv) {
                noResultsDiv = jQuery('<div id="no-results">No results match the selected filters.</div>').appendTo('#insivia-frmp-shelter-map');
            }
        }
    }

    jQuery('.cfd-result-row').addClass('hidden-row');
    jQuery('.cfd-result-row' + (filters.park ? '[data-park="' + filters.park + '"]' : '') + (filters.type ? '[data-type="' + filters.type + '"]' : '')).removeClass('hidden-row');
}

function cfdShowInfo(data) {
    const uniqueParks = [];
    const uniqueTypes = [];
    const bounds = map ? L.latLngBounds() : null;

    data.forEach(function(elem) {
        if (!elem) {
            return;
        }

        cfdData.push(elem);

        const lat = parseFloat(elem.Latitude);
        const lon = parseFloat(elem.Longitude);
        const purchaseUrl = 'tribute-checkout?item=' + elem.MetroPark + elem.Type + elem['Location Description'] + '&price=' + elem.Cost;

        if (map && lat && lon) {
            const marker = L.marker([lat, lon]);
            marker.elementIndex = cfdData.length - 1;

            let imgHtml = '';
            if (elem['Photo link'] !== '') {
                const fileId = elem['Photo link'].slice(elem['Photo link'].indexOf('=') + 1);
                const assetUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;
                imgHtml = '<a href="' + assetUrl + '" data-lightbox="image-1" data-title="' + elem['Location Description'] + '"><img src="' + assetUrl + '" width="64" height="48"></a>';
            }

            const purchaseHtml = '<a class="blue-btn btn reserve-now" href="' + purchaseUrl + '">Purchase Now</a>';

            const contentString =
                '<div class="marker-content">' +
                    '<h1>' + elem.Type + '</h1>' +
                    '<span>' + elem.Cost + '</span><br>' +
                    '<span><strong>' + elem.MetroPark + '</strong></span><br>' +
                    '<span>' + elem['Location Description'] + '</span><br>' +
                    '<span><strong>Status:</strong> ' + elem.Status + '</span><br>' +
                    '<div>' + imgHtml + '</div>' +
                    '<div>' + purchaseHtml + '</div>' +
                '</div>';

            marker.bindPopup(contentString).addTo(map);
            cfdMarkers.push(marker);
            bounds.extend({lat: lat, lng: lon});
        }

        if (elem.MetroPark && uniqueParks.indexOf(elem.MetroPark) === -1) {
            uniqueParks.push(elem.MetroPark);
            jQuery('#shelter-filter-parks').append('<option value="' + elem.MetroPark + '">' + elem.MetroPark + '</option>');
        }

        if (elem.Type && uniqueTypes.indexOf(elem.Type) === -1) {
            uniqueTypes.push(elem.Type);
            jQuery('#shelter-filter-types').append('<option value="' + elem.Type + '">' + elem.Type + '</option>');
        }

        const template = jQuery('#cfd-tribute-result-template').html();
        const row = jQuery(template);
        row.find('.insivia-frmp-list-item-type').text(elem.Type);
        row.find('.insivia-frmp-list-item-location').text('at ' + elem.MetroPark);
        row.find('.insivia-frmp-list-item-cost').text(elem.Cost);
        row.find('.insivia-frmp-list-item-location-description').html('<strong>Location:</strong> ' + elem['Location Description']);
        row.find('.insivia-frmp-list-item-location-status').html('<strong>Status:</strong> ' + elem.Status);
        row.find('.insivia-frmp-list-item-reserve-now-wrapper').html('<a class="blue-btn btn reserve-now" href="' + purchaseUrl + '">Purchase Now</a>');
        if (elem['Photo link'] !== '') {
            const fileId = elem['Photo link'].slice(elem['Photo link'].indexOf('=') + 1);
            const assetUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;
            row.find('.insivia-frmp-gallery-link').html('<a href="' + assetUrl + '" data-lightbox="image-1" data-title="' + elem['Location Description'] + '"><img src="' + assetUrl + '" width="64" height="48"></a>');
        } else {
            row.find('.insivia-frmp-gallery-link').remove();
        }
        row.attr('data-type', elem.Type);
        row.attr('data-park', elem.MetroPark);
        if (elem.Status !== 'Taken') {
            jQuery('#tribute-searchresults').append(row);
        }
    });

    if (map && bounds && bounds.isValid()) {
        map.fitBounds(bounds);
    }
}
