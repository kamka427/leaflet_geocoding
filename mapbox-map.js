class MapboxMap extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<div id="mb-map" style="width: 100%; height: 400px; border: 1px solid #ccc;"></div>`;
      this.initializeMap();
    }
  
    initializeMap() {
      const mapboxAccessToken = 'pk.eyJ1Ijoia2Fta2E0MjciLCJhIjoiY200aGFsNjM1MDR5NTJyczRpdHZvYTQ4bCJ9.DItIMTrJxVtcx7EQcCkXCw'; // Replace with your Mapbox access token
      const mapElement = this.querySelector('#mb-map');
  
      // Initialize Leaflet map
      const map = L.map(mapElement).setView([47.4979, 19.0402], 13); // Centered on Budapest
  
      // Add OpenStreetMap base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
  
      // Add Mapbox geocoder control
      const mb_geocoder = L.Control.Geocoder.mapbox({
        apiKey: mapboxAccessToken
      });
      L.Control.geocoder({
        geocoder: mb_geocoder
      }).addTo(map);
  
      // Reverse geocoding on map click
      map.on('click', (e) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.latlng.lng},${e.latlng.lat}.json?access_token=${mapboxAccessToken}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.features.length > 0) {
              const address = data.features[0].place_name;
              L.marker([e.latlng.lat, e.latlng.lng])
                .addTo(map)
                .bindPopup(`Cím: ${address}`)
                .openPopup();
            } else {
              alert('Nem található cím ehhez a helyhez.');
            }
          })
          .catch((error) => console.error('Inverz geokódolási hiba:', error));
      });
  
      // Adjust map size when the slide becomes active in Reveal.js
      Reveal.addEventListener('slidechanged', (event) => {
        if (event.currentSlide.querySelector('#mb-map')) {
          setTimeout(() => map.invalidateSize(), 100); // Ensure the map renders correctly
        }
      });
    }
  }
  
  customElements.define('mapbox-map', MapboxMap);
  