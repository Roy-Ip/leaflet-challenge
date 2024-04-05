// Initialize the map
let map = L.map('map', {
  center: [0, 100],
  zoom: 3
});



// Add the OpenStreetMap tiles as the base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// Define a function to calculate the radius based on earthquake magnitude
function calculateRadius(magnitude) {
  return Math.max(1, Math.min(magnitude * 4, 30));
}

// Define a function to determine the color based on earthquake depth
function getColor(depth) {
  if (depth < 10) return '#F9E79F'; 
  else if (depth < 30) return '#F1C40F'; 
  else if (depth < 50) return '#F39C12';
  else if (depth < 70) return '#DC7633';
  else if (depth < 90) return '#C0392B';
  else return '#7B241C';
}



// Define the legend control
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Depth of Earthquake</h4>';
  div.innerHTML += '<div class="legend-item"><i style="background: #F9E79F"></i><span class="legend-text">-10 to 10 km</span></div>';
  div.innerHTML += '<div class="legend-item"><i style="background: #F1C40F"></i><span class="legend-text">10 to 30 km</span></div>';
  div.innerHTML += '<div class="legend-item"><i style="background: #F39C12"></i><span class="legend-text">30 to 50 km</span></div>';
  div.innerHTML += '<div class="legend-item"><i style="background: #DC7633"></i><span class="legend-text">50 to 70 km</span></div>';
  div.innerHTML += '<div class="legend-item"><i style="background: #C0392B"></i><span class="legend-text">70 to 90 km</span></div>';
  div.innerHTML += '<div class="legend-item"><i style="background: #7B241C"></i><span class="legend-text">90 km or above</span></div>';

  // Style the legend container
  div.style.padding = '10px';
  div.style.backgroundColor = '#fff';
  div.style.border = '1px solid #ccc';
  div.style.borderRadius = '5px';

  // Style the legend items
  var legendItems = div.getElementsByClassName('legend-item');
  for (var i = 0; i < legendItems.length; i++) {
    legendItems[i].style.display = 'flex';
    legendItems[i].style.alignItems = 'center';
  }

  // Style the color boxes
  var colorBoxes = div.querySelectorAll('.legend-item i');
  for (var j = 0; j < colorBoxes.length; j++) {
    colorBoxes[j].style.width = '20px';
    colorBoxes[j].style.height = '20px';
    colorBoxes[j].style.marginRight = '5px';
    colorBoxes[j].style.display = 'inline-block';
  }

  // Style the legend text
  var legendTexts = div.querySelectorAll('.legend-item .legend-text');
  for (var k = 0; k < legendTexts.length; k++) {
    legendTexts[k].style.marginRight = '10px'; // Adjust the margin as needed
  }

  return div;
};

legend.addTo(map);



// Load the earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      let location = feature.properties.place;
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let radius = calculateRadius(magnitude);
      let color = getColor(depth);
      
      let geojsonMarkerOptions = {
        radius: radius,
        fillColor: color,
        color: '#000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      }
      return L.circleMarker(latlng, geojsonMarkerOptions)
        .bindPopup(`<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
    }
  }).addTo(map);
});
