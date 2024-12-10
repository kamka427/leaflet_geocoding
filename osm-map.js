class OsmMap extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div id="osm-map" style="width: 100%; height: 400px; border: 1px solid #ccc;"></div>`;
        this.initializeMap();
    }

    initializeMap() {
        const map = L.map(this.querySelector('#osm-map')).setView([47.4979, 19.0402], 13);

        // Add OSM Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Add Geocoder
        L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);

        // Reverse Geocoding on Map Click
        map.on('click', async (e) => {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`;
            try {
                const response = await fetch(url, { mode: 'no-cors' });
                if (!response.ok) throw new Error('Network response was not OK', response);
                const data = await response.json();

                // Add Marker with Popup
                L.marker(e.latlng)
                    .bindPopup(data.display_name || 'No address found')
                    .addTo(map);
            } catch (error) {
                console.error('Error fetching geocode data:', error);
            }
        });

        // Adjust Map Size When Slide Changes
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#osm-map')) {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
    }
}

customElements.define('osm-map', OsmMap);
