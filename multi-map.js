class MultiMap extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
          <div id="osm-map_" style="width: 48%; height: 300px; border: 1px solid #ccc;"></div>
          <div id="azure-map_" style="width: 48%; height: 300px; border: 1px solid #ccc;"></div>
          <div id="esri-map_" style="width: 48%; height: 300px; border: 1px solid #ccc;"></div>
          <div id="mapbox-map_" style="width: 48%; height: 300px; border: 1px solid #ccc;"></div>
        </div>
      `;

        this.initializeMaps();
    }

    initializeMaps() {
        const properties = [
            { address: "Budapest, Kossuth Lajos tér 1", price: "120,000,000 Ft" },
            { address: "Budapest, Andrássy út 60", price: "95,000,000 Ft" },
            { address: "Budapest, Deák Ferenc tér 1", price: "150,000,000 Ft" },
            { address: "Budapest, Bajcsy-Zsilinszky út 78", price: "80,000,000 Ft" },
        ];

        const initialCenter = [47.4979, 19.0402];
        const zoomLevel = 13;

        // API keys
        const esriToken =
            "AAPTxy8BH1VEsoebNVZXo8HurBC2LDLytHo4sRKWB_D6DsSaCBLZrm5NCO0ATDp9LkWZ3PBk277ofjV-7rxOvZIRZuAB8slvsjfVNazQcievUjpFPHQFit2QBxgW6Edv0m1ed5Ipxs7A9hkc_W-uSHk-v5Ks2yHGmLX-btcE6SINwSu2YLLZJima0-cF-6wm7nkyj8P6b9Uej_uTmF1UmwbyiGt9rS9XumjqF-vYR2XEkAY.AT1_Q4SvWY5w";
        const azureMapsKey =
            "CYQw7omTAZcgm1piZ7UJstUgO3yKhHGIl773ltm2WGtKjb5hq10gJQQJ99ALAC5RqLJ5BCW0AAAgAZMP1uUu";
        const mapboxToken =
            "pk.eyJ1Ijoia2Fta2E0MjciLCJhIjoiY200aGFsNjM1MDR5NTJyczRpdHZvYTQ4bCJ9.DItIMTrJxVtcx7EQcCkXCw";

        // Initialize maps
        const osmMap = L.map("osm-map_").setView(initialCenter, zoomLevel);
        const azureMap = L.map("azure-map_").setView(initialCenter, zoomLevel);
        const esriMap = L.map("esri-map_").setView(initialCenter, zoomLevel);
        const mapboxMap = L.map("mapbox-map_").setView(initialCenter, zoomLevel);

        [osmMap, azureMap, esriMap, mapboxMap].forEach((map) => {
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
            }).addTo(map);
        });

        // Geocode functions
        const geocodeOSM = (property) =>
            fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    property.address
                )}&format=json&limit=1`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.length > 0) {
                        return {
                            lat: parseFloat(data[0].lat),
                            lon: parseFloat(data[0].lon),
                            popupText: `<strong>${property.address}</strong><br>Ár: ${property.price}`,
                        };
                    }
                });

        const geocodeAzureMaps = (property) =>
            fetch(
                `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${azureMapsKey}&query=${encodeURIComponent(
                    property.address
                )}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.results && data.results.length > 0) {
                        return {
                            lat: data.results[0].position.lat,
                            lon: data.results[0].position.lon,
                            popupText: `<strong>${property.address}</strong><br>Ár: ${property.price}`,
                        };
                    }
                });

        const geocodeEsri = (property) =>
            fetch(
                `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(
                    property.address
                )}&f=json&token=${esriToken}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.candidates && data.candidates.length > 0) {
                        return {
                            lat: data.candidates[0].location.y,
                            lon: data.candidates[0].location.x,
                            popupText: `<strong>${property.address}</strong><br>Ár: ${property.price}`,
                        };
                    }
                });

        const geocodeMapbox = (property) =>
            fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    property.address
                )}.json?access_token=${mapboxToken}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.features && data.features.length > 0) {
                        return {
                            lat: data.features[0].center[1],
                            lon: data.features[0].center[0],
                            popupText: `<strong>${property.address}</strong><br>Ár: ${property.price}`,
                        };
                    }
                });

        // Plot properties on each map
        properties.forEach((property) => {
            geocodeOSM(property).then((result) => {
                if (result) {
                    L.marker([result.lat, result.lon])
                        .addTo(osmMap)
                        .bindPopup(`OSM: ${result.popupText}`);
                }
            });

            geocodeAzureMaps(property).then((result) => {
                if (result) {
                    L.marker([result.lat, result.lon])
                        .addTo(azureMap)
                        .bindPopup(`Azure Maps: ${result.popupText}`);
                }
            });

            geocodeEsri(property).then((result) => {
                if (result) {
                    L.marker([result.lat, result.lon])
                        .addTo(esriMap)
                        .bindPopup(`Esri: ${result.popupText}`);
                }
            });

            geocodeMapbox(property).then((result) => {
                if (result) {
                    L.marker([result.lat, result.lon])
                        .addTo(mapboxMap)
                        .bindPopup(`Mapbox: ${result.popupText}`);
                }
            });
        });

        // Adjust Map Size When Slide Changes
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#osm-map_')) {
                setTimeout(() => osmMap.invalidateSize(), 100);
            }
        });
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#azure-map_')) {
                setTimeout(() => azureMap.invalidateSize(), 100);
            }
        });
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#esri-map_')) {
                setTimeout(() => esriMap.invalidateSize(), 100);
            }
        });
        Reveal.addEventListener('slidechanged', (event) => {
            if (event.currentSlide.querySelector('#mapbox-map_')) {
                setTimeout(() => mapboxMap.invalidateSize(), 100);
            }
        });
    }


}

customElements.define("multi-map", MultiMap);
