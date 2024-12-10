class EsriMap extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<div id="esri-map" style="width: 100%; height: 400px; border: 1px solid #ccc;"></div>`;
      this.initializeMap();
    }
  
    initializeMap() {
      const esriMapElement = this.querySelector('#esri-map');
      const esriApiKey = 'AAPTxy8BH1VEsoebNVZXo8HurBC2LDLytHo4sRKWB_D6DsSaCBLZrm5NCO0ATDp9LkWZ3PBk277ofjV-7rxOvZIRZuAB8slvsjfVNazQcievUjpFPHQFit2QBxgW6Edv0m1ed5Ipxs7A9hkc_W-uSHk-v5Ks2yHGmLX-btcE6SINwSu2YLLZJima0-cF-6wm7nkyj8P6b9Uej_uTmF1UmwbyiGt9rS9XumjqF-vYR2XEkAY.AT1_Q4SvWY5w'; // Replace with your ESRI API key
  
      // Initialize Leaflet map
      const map = L.map(esriMapElement).setView([47.4979, 19.0402], 13); // Centered on Budapest
  
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
  
      // Add ESRI Geocoding Search Control
      const searchControl = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider({
            apikey: esriApiKey
          })
        ]
      }).addTo(map);
  
      const results = L.layerGroup().addTo(map);
  
      // Handle search results
      searchControl.on('results', (data) => {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(
            L.marker(data.results[i].latlng)
              .bindPopup(data.results[i].properties.Place_addr)
              .openPopup()
          );
        }
      });
  
      // Add reverse geocoding on map click
      map.on('click', (e) => {
        L.esri.Geocoding.reverseGeocode({
          apikey: esriApiKey
        })
          .latlng(e.latlng)
          .run((error, result) => {
            if (error) {
              console.error('Reverse geocoding error:', error);
              return;
            }
            results.addLayer(
              L.marker(result.latlng)
                .bindPopup(result.address.Match_addr)
                .openPopup()
            );
          });
      });
  
      // Adjust map size when the slide becomes active in Reveal.js
      Reveal.addEventListener('slidechanged', (event) => {
        if (event.currentSlide.querySelector('#esri-map')) {
          setTimeout(() => map.invalidateSize(), 100); // Ensure the map renders correctly
        }
      });
    }
  }
  
  customElements.define('esri-map', EsriMap);
  