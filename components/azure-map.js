class AzureMap extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div id="azure-map" style="width: 100%; height: 400px; border: 1px solid #ccc;"></div>`;
        this.initializeMap();
    }

    initializeMap() {
        const azureMapElement = this.querySelector('#azure-map');
        const azureMapsKey = 'CYQw7omTAZcgm1piZ7UJstUgO3yKhHGIl773ltm2WGtKjb5hq10gJQQJ99ALAC5RqLJ5BCW0AAAgAZMP1uUu'; // Replace with your Azure Maps key

        // Initialize Leaflet map
        const map = L.map(azureMapElement).setView([47.4979, 19.0402], 13); // Centered on Budapest

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add Azure geocoding control
        L.Control.geocoder({
            geocoder: L.Control.Geocoder.azure({ apiKey: azureMapsKey }),
        }).addTo(map);

        // Reverse geocoding on map click
        map.on('click', (e) => {
            const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=${azureMapsKey}&query=${e.latlng.lat},${e.latlng.lng}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.addresses && data.addresses.length > 0) {
                        const address = data.addresses[0].address.freeformAddress;
                        L.marker([e.latlng.lat, e.latlng.lng])
                            .addTo(map)
                            .bindPopup(address)
                            .openPopup();
                    } else {
                        alert('No address found for this location.');
                    }
                })
                .catch((error) => console.error('Reverse geocoding error:', error));
        });

        // Adjust map size when the slide becomes active in Reveal.js
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#azure-map')) {
                setTimeout(() => map.invalidateSize(), 100); // Ensure map renders correctly
            }
        });
    }
}

customElements.define('azure-map', AzureMap);
