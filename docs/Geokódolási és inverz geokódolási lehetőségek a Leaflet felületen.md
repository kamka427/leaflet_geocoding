# Geokódolási és inverz geokódolási lehetőségek a Leaflet felületen
> Készítette: Neszlényi Kálmán Balázs - DPU51T \
> Térinformatika Gy., ELTE 2024 \
> Projekt és legfrissebb verzió elérhető a [GitHub](https://github.com/kamka427/leaflet_geocoding)on

## Tartalomjegyzék

- [Geokódolási és inverz geokódolási lehetőségek a Leaflet felületen](#geokódolási-és-inverz-geokódolási-lehetőségek-a-leaflet-felületen)
      - [Készítette: Neszlényi Kálmán Balázs](#készítette-neszlényi-kálmán-balázs)
  - [Tartalomjegyzék](#tartalomjegyzék)
  - [Bevezetés](#bevezetés)
  - [A dokumentum célja](#a-dokumentum-célja)
  - [A Leaflet és geokódolás általános bemutatása](#a-leaflet-és-geokódolás-általános-bemutatása)
    - [A Leaflet alapjai](#a-leaflet-alapjai)
    - [Geokódolás és inverz geokódolás szerepe](#geokódolás-és-inverz-geokódolás-szerepe)
      - [Geokódolási eszközök alkalmazási példái:](#geokódolási-eszközök-alkalmazási-példái)
  - [Szolgáltatások a geokódoláshoz](#szolgáltatások-a-geokódoláshoz)
    - [OpenStreetMap (OSM) / Nominatim](#openstreetmap-osm--nominatim)
      - [API Endpoint-ok](#api-endpoint-ok)
      - [Paraméterek](#paraméterek)
      - [Előkészületek](#előkészületek)
      - [Használati Példa: Geokódolás](#használati-példa-geokódolás)
      - [Használati Példa: Inverz Geokódolás](#használati-példa-inverz-geokódolás)
      - [Előnyök és Hátrányok](#előnyök-és-hátrányok)
    - [Azure Maps](#azure-maps)
      - [API Endpoint-ok](#api-endpoint-ok-1)
      - [Paraméterek](#paraméterek-1)
      - [Előkészületek](#előkészületek-1)
      - [Használati Példa: Geokódolás](#használati-példa-geokódolás-1)
      - [Használati Példa: Inverz Geokódolás](#használati-példa-inverz-geokódolás-1)
      - [Előnyök és Hátrányok](#előnyök-és-hátrányok-1)
    - [Esri ArcGIS Geocoder](#esri-arcgis-geocoder)
      - [API Endpoint-ok](#api-endpoint-ok-2)
      - [Paraméterek](#paraméterek-2)
      - [Előkészületek](#előkészületek-2)
      - [Használati Példa: Geokódolás](#használati-példa-geokódolás-2)
      - [Használati Példa: Inverz Geokódolás](#használati-példa-inverz-geokódolás-2)
      - [Előnyök és Hátrányok](#előnyök-és-hátrányok-2)
    - [Mapbox Geocoder](#mapbox-geocoder)
      - [API Endpoint-ok](#api-endpoint-ok-3)
      - [Paraméterek](#paraméterek-3)
      - [Előkészületek](#előkészületek-3)
      - [Használati Példa: Geokódolás](#használati-példa-geokódolás-3)
      - [Használati Példa: Inverz Geokódolás](#használati-példa-inverz-geokódolás-3)
      - [Előnyök és Hátrányok](#előnyök-és-hátrányok-3)
    - [Geokódolási Szolgáltatások Összehasonlítása](#geokódolási-szolgáltatások-összehasonlítása)
    - [Részletes Elemzés](#részletes-elemzés)
      - [OpenStreetMap / Nominatim](#openstreetmap--nominatim)
      - [Azure Maps](#azure-maps-1)
      - [Esri ArcGIS Geocoder](#esri-arcgis-geocoder-1)
      - [Mapbox Geocoder](#mapbox-geocoder-1)
    - [Ajánlások Projekttípusok Alapján](#ajánlások-projekttípusok-alapján)
  - [Ingatlanárak megjelenítése négy geokódolási API-val](#ingatlanárak-megjelenítése-négy-geokódolási-api-val)
    - [Példa Célja](#példa-célja)
    - [Kódrészlet](#kódrészlet)
    - [Miért az OSM volt a leglassabb?](#miért-az-osm-volt-a-leglassabb)
    - [Miért az OSM ismerte fel a legtöbb címet?](#miért-az-osm-ismerte-fel-a-legtöbb-címet)
    - [**Miért vannak különbségek az eredményekben?**](#miért-vannak-különbségek-az-eredményekben)
    - [**Záró gondolatok**](#záró-gondolatok)

---

## Bevezetés

A digitális térinformatikai alkalmazások egyre szélesebb körben használják a geokódolást és az inverz geokódolást különböző adatok térbeli elemzéséhez és vizualizációjához. A geokódolás segítségével címeket vagy helyleírásokat alakíthatunk át koordinátákká, míg az inverz geokódolás az ellenkező irányú folyamatot valósítja meg, azaz koordinátákhoz rendelt címeket ad vissza.

A **Leaflet** egy népszerű nyílt forráskódú JavaScript könyvtár, amely interaktív térképek készítését támogatja. Az egyszerű használat mellett számos kiegészítő plugin érhető el hozzá, amelyek révén a geokódolás és az inverz geokódolás könnyedén integrálható különböző adatforrások, például az OpenStreetMap (OSM), Bing Maps, Esri vagy Mapbox API-k segítségével.

---

## A dokumentum célja

Ebben a dokumentumban bemutatom a Leaflet térképi környezetben elérhető geokódolási és inverz geokódolási lehetőségeket. A bemutató során négy különböző megoldást vizsgálok:
- **OpenStreetMap (OSM)**,  
- **Bing Maps**,  
- **Esri World Geocoding Service**,  
- **Mapbox Geocoder**.

Mindegyik megoldás esetében bemutatom az alapvető működést, példákat nyújtok a használatukra, és röviden értékelem az előnyeiket és hátrányaikat. Ezenkívül egy saját példán keresztül demonstrálom, hogyan alkalmazhatók ezek az eszközök egy konkrét probléma megoldására.

---

## A Leaflet és geokódolás általános bemutatása

### A Leaflet alapjai

A **Leaflet** egy könnyen kezelhető, mégis erőteljes térképi könyvtár, amely különösen népszerű webfejlesztők körében. Legnagyobb előnye, hogy kis méretű, nyílt forráskódú, és egyszerűen bővíthető pluginekkel. Főbb funkciói közé tartozik:
- Interaktív térképek megjelenítése,  
- Rétegek kezelése (tile és overlay típusok),  
- Felhasználói interakciók, például marker-ek, popup-ok és események kezelése.

A Leaflet támogatja a különböző térképi szolgáltatók, például az OpenStreetMap, Google Maps és Bing Maps rétegeit, így rugalmasan integrálható szinte bármilyen térinformatikai projektbe.

---

### Geokódolás és inverz geokódolás szerepe

A geokódolás és inverz geokódolás kulcsfontosságú szerepet játszik a térinformatikai elemzésekben:
- **Geokódolás**: Segítségével egy cím vagy helyszín neve átalakítható földrajzi koordinátákká, amelyek felhasználhatók térképi vizualizációhoz vagy elemzéshez.
- **Inverz geokódolás**: Lehetővé teszi, hogy egy adott koordinátapárhoz tartozó címet vagy helyleírást visszakeressünk, például egy felhasználó aktuális helyzetének leírásához.

#### Geokódolási eszközök alkalmazási példái:
- Ingatlanok térképezése,  
- Logisztikai útvonaltervezés,  
- Felhasználók földrajzi elhelyezkedésének elemzése,  
- Környezeti adatok vizsgálata.

---

## Szolgáltatások a geokódoláshoz

A Leaflethez több különböző szolgáltatás is elérhető, amelyek lehetővé teszik a különböző geokódolást a felületen. Az alábbiakban a legnépszerűbb opciók találhatók:
- **OSM Geocoder (Leaflet Control Geocoder)**: Ingyenes és nyílt forráskódú megoldás.  
- **Azure Maps**: Microsoft által biztosított, nagy adatbázissal rendelkező megoldás. A Bing Maps utódja.  
- **Esri Geocoder**: Prémium szolgáltatás fejlett térinformatikai funkciókkal.  
- **Mapbox Geocoder**: Széles körben használt, prémium minőségű API.

A következő fejezetekben mindegyik megoldást részletesen ismertetem példákkal és kódokkal.

---

### OpenStreetMap (OSM) / Nominatim

Az **OpenStreetMap (OSM)** egy nyílt forráskódú térképszolgáltatás, amely a világ különböző régióit lefedő térinformatikai adatokat biztosít. A **Nominatim API** az OSM geokódolási eszköze, amely lehetővé teszi:
- **Geokódolást**: Címek koordinátává alakítását.  
- **Inverz geokódolást**: Koordináták címekké alakítását.

#### API Endpoint-ok
- **Geokódolás**: https://nominatim.openstreetmap.org/search?q={CÍM}&format=json&addressdetails=1&limit=1
- **Inverz geokódolás**: https://nominatim.openstreetmap.org/reverse?lat={LAT}&lon={LON}&format=json&addressdetails=1

#### Paraméterek
- **q**: A keresett cím.
- **lat**: A koordináták szélessége.
- **lon**: A koordináták hosszúsága.
- **format**: Az eredmény formátuma, például JSON.
- **addressdetails**: Részletes címadatok visszaadása.

#### Előkészületek

Nincs szükség API kulcsra, de érdemes megadni egy User-Agent fejlécet a kérések során, mivel a szolgáltatás korlátozhatja az ismeretlen forrásból érkező kéréseket.

#### Használati Példa: Geokódolás
```js
function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const result = data[0];
                console.log(`Koordináták: Szélesség ${result.lat}, Hosszúság ${result.lon}`);
                // További feldolgozás, pl. térképen marker elhelyezése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Geokódolási hiba:", error));
}

// Példa használat
geocode("Budapest, Kossuth Lajos tér 1");
```

#### Használati Példa: Inverz Geokódolás
```js
function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                console.log(`Cím: ${data.display_name}`);
                // További feldolgozás, pl. térképen popup megjelenítése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Inverz geokódolási hiba:", error));
}

// Példa használat
reverseGeocode(47.4979, 19.0402);
```

![OSM](<../images/Screenshot 2024-12-09 at 23.56.26.png>)


#### Előnyök és Hátrányok

**Előnyök**:
1. Ingyenes és nyílt forráskódú: Nincs szükség API kulcsra vagy regisztrációra.
2.	Egyszerű integráció: Közvetlenül hívható URL-en keresztül.
3.	Globális elérhetőség: Széleskörű lefedettség a világ különböző régióira.

**Hátrányok**:
1.	Korlátozott teljesítmény: Lassabb válaszidő és alacsonyabb stabilitás nagy terhelés mellett.
2.	Adatminőség eltérő lehet: Különböző régiókban az adatok pontossága változó.
3.	Rate limiting: A szolgáltatás korlátozhatja a kérések számát.

### Azure Maps

Az **Azure Maps** a Microsoft által biztosított, nagy teljesítményű térinformatikai platform, amely geokódolási és inverz geokódolási funkciókat kínál. Az Azure Maps API kiváló adatminőséget és globális lefedettséget biztosít, amely különösen hasznos logisztikai, várostervezési és üzleti alkalmazásokban.

#### API Endpoint-ok
- **Geokódolás**:  
  `https://atlas.microsoft.com/search/address/json?api-version=1.0&query={CÍM}&subscription-key={API_KEY}`
- **Inverz geokódolás**:  
  `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&query={LAT},{LON}&subscription-key={API_KEY}`

#### Paraméterek
- **query**: A keresett cím vagy koordináták (pl. `Budapest, Kossuth Lajos tér 1` vagy `47.4979,19.0402`).
- **api-version**: Az API verziója (általában `1.0`).
- **subscription-key**: Az Azure Maps API kulcs.
- **limit** *(opcionális)*: Az eredmények maximális száma.

#### Előkészületek

Az Azure Maps API használatához **Azure fiókra** van szükség, amelyben létre kell hozni egy Azure Maps erőforrást. A szolgáltatás regisztrálása után az **API kulcs** az erőforrás tulajdonságai között található.

#### Használati Példa: Geokódolás
```js
function geocodeAzure(address) {
    const apiKey = "YOUR_AZURE_MAPS_API_KEY"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&query=${encodeURIComponent(address)}&subscription-key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                console.log(`Koordináták: Szélesség ${result.position.lat}, Hosszúság ${result.position.lon}`);
                // További feldolgozás, pl. térképen marker elhelyezése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Geokódolási hiba:", error));
}

// Példa használat
geocodeAzure("Budapest, Kossuth Lajos tér 1");
```
#### Használati Példa: Inverz Geokódolás
```js
function reverseGeocodeAzure(lat, lon) {
    const apiKey = "YOUR_AZURE_MAPS_API_KEY"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&query=${lat},${lon}&subscription-key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0].address.freeformAddress;
                console.log(`Cím: ${address}`);
                // További feldolgozás, pl. térképen popup megjelenítése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Inverz geokódolási hiba:", error));
}

// Példa használat
reverseGeocodeAzure(47.4979, 19.0402);
```
![Azure](<../images/Screenshot 2024-12-09 at 23.53.04.png>)

#### Előnyök és Hátrányok

**Előnyök**:
1.	Pontos adatok: Kiváló adatminőség és globális lefedettség.
2.	Gyors és stabil szolgáltatás: Nagy teljesítmény és alacsony válaszidő.
3.	Kiegészítő funkciók: Integrálható más Azure szolgáltatásokkal (pl. térinformatikai elemzések, navigáció).

**Hátrányok**:
1.	API kulcs szükséges: Az API használatához regisztráció és kulcs generálása szükséges.
2.	Költségek: Az ingyenes csomag korlátozott API hívásokat tesz lehetővé; nagyobb igényeknél díjköteles.
3.	Komplex beállítások: Kezdők számára a beállítások és konfigurációk néha bonyolultak lehetnek.

### Esri ArcGIS Geocoder

Az **Esri ArcGIS Geocoder** a világ egyik legpontosabb és legmegbízhatóbb geokódolási szolgáltatása, amely a fejlett térinformatikai funkcióiról ismert ArcGIS platform részét képezi. Az Esri globális lefedettséget és részletes metaadatokat biztosít, amelyeket különösen ajánlanak várostervezés, üzleti alkalmazások és önkormányzati projektek számára.

#### API Endpoint-ok
- **Geokódolás**:  
  `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine={CÍM}&f=json&token={API_KEY}`
- **Inverz geokódolás**:  
  `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location={LON},{LAT}&f=json&token={API_KEY}`

#### Paraméterek
- **SingleLine**: A keresett cím egyetlen szövegként (pl. `Budapest, Kossuth Lajos tér 1`).  
- **location**: A koordinátapár (pl. `19.0402,47.4979`) inverz geokódoláshoz.  
- **f**: Az eredmény formátuma (általában `json`).  
- **token**: Az Esri API kulcs, amely az ArcGIS regisztrációval szerezhető meg.  

#### Előkészületek

Az Esri Geocoder használatához regisztráció szükséges az **ArcGIS Online** platformon, ahol API kulcsot (token) generálhatsz. Ezután az API-kulcsot minden lekérdezésnél meg kell adni a hitelesítéshez.

#### Használati Példa: Geokódolás
```javascript
function geocodeEsri(address) {
    const apiKey = "YOUR_ESRI_API_KEY"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(address)}&f=json&token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.candidates && data.candidates.length > 0) {
                const result = data.candidates[0];
                console.log(`Koordináták: Szélesség ${result.location.y}, Hosszúság ${result.location.x}`);
                // További feldolgozás, pl. térképen marker elhelyezése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Geokódolási hiba:", error));
}

// Példa használat
geocodeEsri("Budapest, Kossuth Lajos tér 1");
```
#### Használati Példa: Inverz Geokódolás
```js
function reverseGeocodeEsri(lat, lon) {
    const apiKey = "YOUR_ESRI_API_KEY"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lon},${lat}&f=json&token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                console.log(`Cím: ${data.address.Match_addr}`);
                // További feldolgozás, pl. térképen popup megjelenítése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Inverz geokódolási hiba:", error));
}

// Példa használat
reverseGeocodeEsri(47.4979, 19.0402);
```
![ESRI](<../images/Screenshot 2024-12-09 at 23.52.19.png>)

#### Előnyök és Hátrányok

**Előnyök**:
1.	Magas adatminőség: Pontos címek, részletes metaadatok és globális lefedettség.
2.	ArcGIS integráció: Könnyen használható az ArcGIS platformon belül más térinformatikai eszközökkel együtt.
3.	Rugalmas használat: Támogatja a fejlett szűrőket és testreszabható lekérdezéseket.

**Hátrányok**:
1.	API kulcs szükséges: Használatához regisztráció és token generálása szükséges.
2.	Költséges lehet: Az ingyenes csomag korlátozott; nagyobb projektek esetén díjköteles.
3.	Komplexitás: A haladó funkciók miatt a kezdők számára bonyolultabb lehet a használata.


### Mapbox Geocoder

A **Mapbox Geocoder** egy modern és gyors geokódolási szolgáltatás, amely pontos adatokat és fejlett funkciókat kínál a térinformatikai alkalmazások számára. A Mapbox API kombinálja az OpenStreetMap adatbázisát és saját adatforrásait, hogy globálisan elérhető, prémium minőségű megoldásokat nyújtson.

#### API Endpoint-ok
- **Geokódolás**:  
  `https://api.mapbox.com/geocoding/v5/mapbox.places/{CÍM}.json?access_token={API_KEY}`
- **Inverz geokódolás**:  
  `https://api.mapbox.com/geocoding/v5/mapbox.places/{LON},{LAT}.json?access_token={API_KEY}`

#### Paraméterek
- **CÍM**: A keresett cím (pl. `Budapest, Kossuth Lajos tér 1`).  
- **LON, LAT**: A koordinátapár (pl. `19.0402,47.4979`) inverz geokódoláshoz.  
- **access_token**: A Mapbox API kulcs.  
- **limit** *(opcionális)*: Az eredmények maximális száma (alapértelmezett: 5).  
- **types** *(opcionális)*: Keresési típusok, például `address`, `poi`.

#### Előkészületek

A Mapbox Geocoder használatához regisztráció szükséges a [Mapbox weboldalán](https://www.mapbox.com/), ahol létre kell hozni egy projektet, és generálni egy **access_token**-t. Ezután minden API-híváshoz meg kell adni ezt a kulcsot.

#### Használati Példa: Geokódolás
```javascript
function geocodeMapbox(address) {
    const apiKey = "YOUR_MAPBOX_ACCESS_TOKEN"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const result = data.features[0];
                console.log(`Koordináták: Szélesség ${result.center[1]}, Hosszúság ${result.center[0]}`);
                // További feldolgozás, pl. térképen marker elhelyezése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Geokódolási hiba:", error));
}

// Példa használat
geocodeMapbox("Budapest, Kossuth Lajos tér 1");
```
#### Használati Példa: Inverz Geokódolás
```js
function reverseGeocodeMapbox(lat, lon) {
    const apiKey = "YOUR_MAPBOX_ACCESS_TOKEN"; // Helyettesítsd a saját API kulcsoddal
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const address = data.features[0].place_name;
                console.log(`Cím: ${address}`);
                // További feldolgozás, pl. térképen popup megjelenítése
            } else {
                console.log("Cím nem található.");
            }
        })
        .catch(error => console.error("Inverz geokódolási hiba:", error));
}

// Példa használat
reverseGeocodeMapbox(47.4979, 19.0402);
```

![MapBox](<../images/Screenshot 2024-12-09 at 23.53.59.png>)

#### Előnyök és Hátrányok

**Előnyök**:
1.	Gyors és pontos adatok: Nagy adatminőség és alacsony válaszidő.
2.	Rugalmas használat: Testreszabható lekérdezések és széles körű keresési típusok.
3.	További funkciók: Autocomplete, POI (points of interest) keresés, és fejlett térképvizualizáció.

**Hátrányok**:
1.	API kulcs szükséges: Az API használatához regisztráció és kulcs generálása szükséges.
2.	Költségek: Az ingyenes csomag korlátozott; nagyobb projektek esetén díjköteles.
3.	Adatminőség régiófüggő: Az OpenStreetMap adatain alapuló helyeken eltérő lehet az adatminőség.

### Geokódolási Szolgáltatások Összehasonlítása

Az alábbi táblázatban összehasonlítjuk az OpenStreetMap/Nominatim, Azure Maps, Esri ArcGIS Geocoder és Mapbox Geocoder szolgáltatásait a legfontosabb szempontok alapján.

| Tulajdonság                 | OpenStreetMap / Nominatim | Azure Maps                   | Esri ArcGIS Geocoder             | Mapbox Geocoder           |
| --------------------------- | ------------------------- | ---------------------------- | -------------------------------- | ------------------------- |
| **Ár**                      | Ingyenes                  | Fizetős (ingyenes keret)     | Fizetős (ingyenes keret)         | Fizetős (ingyenes keret)  |
| **API kulcs szükséges**     | Nem                       | Igen                         | Igen                             | Igen                      |
| **Adatminőség**             | Régiófüggő                | Nagyon pontos                | Kiváló                           | Jó, de régiófüggő         |
| **Globális lefedettség**    | Jó                        | Kiváló                       | Kiváló                           | Jó                        |
| **Sebesség**                | Lassabb                   | Gyors                        | Gyors                            | Gyors                     |
| **Funkciók**                | Alap geokódolás           | Fejlett navigáció, elemzések | Fejlett térinformatikai funkciók | Autocomplete, POI keresés |
| **Rugalmas használat**      | Közepes                   | Magas                        | Magas                            | Magas                     |
| **Dokumentáció**            | Alapvető                  | Kiváló                       | Kiváló                           | Kiváló                    |
| **Ingyenes csomag limitek** | Napi 1-2 ezer kérés       | 50 000 kérés/hó              | Limitált                         | 50 000 kérés/hó           |

---

### Részletes Elemzés

#### OpenStreetMap / Nominatim
- **Előnyök**:
  - Teljesen ingyenes és nyílt forráskódú.
  - Kiváló kisebb, nem kereskedelmi célú projektekhez.
- **Hátrányok**:
  - Lassú válaszidők és alacsony teljesítmény nagy terhelés esetén.
  - Adatminőség régiófüggő, különösen kevésbé lakott területeken.

#### Azure Maps
- **Előnyök**:
  - Nagy pontosságú adatok globális lefedettséggel.
  - Kiválóan integrálható az Azure ökoszisztémába.
  - Támogatja a navigációt, térinformatikai elemzéseket és útvonaltervezést.
- **Hátrányok**:
  - API kulcs szükséges.
  - Kezdők számára a beállítások bonyolultak lehetnek.

#### Esri ArcGIS Geocoder
- **Előnyök**:
  - Rendkívül pontos címek és részletes metaadatok.
  - Tökéletesen integrálható az ArcGIS platformon belül.
  - Haladó térinformatikai funkciókat kínál.
- **Hátrányok**:
  - Drága lehet nagyobb projektekhez.
  - API kulcs nélkül nem használható.

#### Mapbox Geocoder
- **Előnyök**:
  - Gyors és modern API, amely támogatja az autocomplete és POI funkciókat.
  - Jó választás interaktív térképalkalmazásokhoz.
- **Hátrányok**:
  - API kulcs szükséges, és az ingyenes csomag korlátozott.
  - Az adatminőség helyenként változó, az OpenStreetMap adatain alapul.

---

### Árösszehasonlítás

A geokódolási szolgáltatások kiválasztásánál az árképzés kulcsfontosságú tényező. Az alábbiakban összehasonlítjuk az **Azure Maps**, az **Esri ArcGIS** és a **Mapbox** geokódolási API-k árait és ingyenes csomagjait.

#### Azure Maps

- **Ingyenes csomag**: Havonta 5,000 ingyenes geokódolási kérés.
- **Árazás**: Az ingyenes keret túllépése után $4.50 per 1,000 kérés, legfeljebb 500,000 kérésig.
- **Korlátozások**: Geokódolás esetén 500 kérés/másodperc, inverz geokódolásnál 250 kérés/másodperc.

#### Esri ArcGIS

- **Ingyenes csomag**: Havonta 20,000 ingyenes geokódolási kérés.
- **Árazás**: Az ingyenes keret túllépése után $0.50 per 1,000 kérés.
- **További költségek**: Batch geokódolás eredményeinek tárolása esetén $4 per 1,000 kérés.

#### Mapbox

- **Ingyenes csomag**: Havonta 100,000 ingyenes geokódolási kérés.
- **Árazás**: Az ingyenes keret túllépése után $5 per 1,000 kérés, 100,000 kérésig; ezt követően csökken az ár.
- **Megjegyzés**: A Mapbox rugalmas árképzést kínál, beleértve a pay-as-you-go és volumen alapú kedvezményeket is.

#### Összegzés

Az árképzés és az ingyenes csomagok tekintetében a szolgáltatások eltérő előnyöket kínálnak. Az **Esri ArcGIS** alacsonyabb költséget biztosít a nagyobb volumenű geokódolási igényekhez, míg a **Mapbox** magasabb ingyenes keretet kínál, ami ideális lehet kisebb projektekhez. Az **Azure Maps** közepes árkategóriát képvisel, de magasabb kérés/másodperc korlátot engedélyez, ami fontos lehet nagy teljesítményű alkalmazásoknál.

A legmegfelelőbb szolgáltatás kiválasztása a projekt specifikus igényeitől, a várt kérésmennyiségtől és a költségvetéstől függ. Érdemes alaposan megvizsgálni mindegyik szolgáltatás részletes árképzését és feltételeit a legjobb döntés meghozatalához.

---

### Ajánlások Projekttípusok Alapján

| Projekttípus                                 | Ajánlott Szolgáltatás     |
| -------------------------------------------- | ------------------------- |
| **Kisebb, nem kereskedelmi projekt**         | OpenStreetMap / Nominatim |
| **Üzleti alkalmazások**                      | Azure Maps, Esri ArcGIS   |
| **Gyors interaktív térképek**                | Mapbox Geocoder           |
| **Pontosságot igénylő feladatok**            | Esri ArcGIS Geocoder      |
| **Azure környezethez illesztett megoldások** | Azure Maps                |

---

## Ingatlanárak megjelenítése négy geokódolási API-val

Az alábbi példában négy különböző geokódolási API-t használunk (OSM/Nominatim, Azure Maps, Esri ArcGIS, Mapbox), hogy ingatlanok címét koordinátákká alakítsuk, és az árakkal együtt megjelenítsük egy interaktív térképen. A cél az API-k összehasonlítása a geokódolás pontossága, sebessége és egyszerűsége alapján.

---

### Példa Célja

- **Adatok**: Budapest különböző címei és az ingatlanok árai.
- **Funkciók**:
  - Címek geokódolása (cím → koordináták).
  - Markerek elhelyezése a térképen.
  - Pop-up ablakban az ingatlan címe és ára jelenik meg.
- **API-k**: OpenStreetMap/Nominatim, Azure Maps, Esri ArcGIS Geocoder, Mapbox Geocoder.

---

### Kódrészlet

Az alábbi kód négy különböző térképet hoz létre a Leaflet könyvtár segítségével, és mindegyik API-t használja az ingatlanok címének geokódolására.  

```html
<body>
    <h1>Ingatlanárak API-k Összehasonlítása</h1>
    <h2>OSM, Azure Maps, ArcGIS, Mapbox</h2>
    <div id="osm-map" class="map-container"></div>
    <div id="azure-map" class="map-container"></div>
    <div id="esri-map" class="map-container"></div>
    <div id="mapbox-map" class="map-container"></div>

    <script>
        const properties = [
            { address: "Budapest, Kossuth Lajos tér 1", price: "120,000,000 Ft" },
            { address: "Budapest, Andrássy út 60", price: "95,000,000 Ft" }
        ];

        // Térképek létrehozása
        const osmMap = L.map('osm-map').setView([47.4979, 19.0402], 13);
        const azureMap = L.map('azure-map').setView([47.4979, 19.0402], 13);
        const esriMap = L.map('esri-map').setView([47.4979, 19.0402], 13);
        const mapboxMap = L.map('mapbox-map').setView([47.4979, 19.0402], 13);

        // Térképi rétegek hozzáadása
        const tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        L.tileLayer(tileLayer).addTo(osmMap);
        L.tileLayer(tileLayer).addTo(azureMap);
        L.tileLayer(tileLayer).addTo(esriMap);
        L.tileLayer(tileLayer).addTo(mapboxMap);

        // Példa geokódolás OSM-mel
        function geocodeOSM(property) {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(property.address)}&format=json&limit=1`;
            return fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        return {
                            lat: parseFloat(data[0].lat),
                            lon: parseFloat(data[0].lon),
                            popupText: `<strong>${property.address}</strong><br>Ár: ${property.price}`
                        };
                    }
                });
        }

        properties.forEach(property => {
            geocodeOSM(property).then(result => {
                if (result) {
                    L.marker([result.lat, result.lon]).addTo(osmMap).bindPopup(`OSM: ${result.popupText}`);
                }
            });
        });
    </script>
</body>
```

![Ingatlanárak összehasonlítása](../imgages/Ingatlanok.png)

---

### Miért az OSM volt a leglassabb?

Az OpenStreetMap (OSM) Nominatim API az ingyenességén és nyílt forráskódú természetén alapul, ami néhány jelentős technikai és infrastrukturális kihívást eredményez:

**1. Korlátozott szerverkapacitás:**
- Az OSM infrastruktúrája közösségi alapon működik, és nem rendelkezik olyan robusztus, globális adatközpontokkal, mint a nagyobb kereskedelmi szolgáltatók (pl. Azure, Esri, Mapbox).
- Az ingyenes hozzáférés miatt a szerverek terheltebbek, különösen csúcsidőben.

**2. Rate Limiting (Lekérdezési korlátok):**
- Az OSM korlátozza az API-hívások számát adott időszakon belül, hogy fenntartható maradjon a szolgáltatás minden felhasználó számára.
- Az alacsonyabb prioritású hívások (pl. nagyobb volumenű kérések) lassabb válaszidőt eredményeznek.

**3. Adatok feldolgozási sebessége:**
- Az OSM nem optimalizált nagy teljesítményű geokódolási lekérdezésekre, szemben a kereskedelmi API-kkal, amelyek dedikált algoritmusokat és gyorsítótárakat alkalmaznak a sebesség növelésére.

### Miért az OSM ismerte fel a legtöbb címet?

Az OpenStreetMap (OSM) Nominatim API számos címet sikeresen felismert, amit az alábbi okok magyaráznak:

**1. Széleskörű közösségi adatok**
- Az OSM adatbázisa **közösségi alapú**, ami azt jelenti, hogy világszerte felhasználók milliói frissítik és bővítik.
- Magyarországon, különösen Budapesten, az OSM közössége aktív, így a város részletes térinformatikai adatokkal rendelkezik.
- Ez gyakran pontosabb eredményeket eredményez, mint amit a kereskedelmi API-k kínálnak.

**2. Ingyenes és nyitott hozzáférés**
- Az OSM adatai nyílt forráskódúak és szabadon elérhetők, ami elősegíti a címek széles körű lefedettségét.
- Az OSM adatai számos forrásból származhatnak, így sokféle információt tartalmazhat.


**3. Alapértelmezett helymeghatározás**
- Ha egy cím nem található pontosan, az OSM hajlamos **általánosabb helyeket** visszaadni (pl. utca központja, városközpont).
- Ez a megközelítés több találatot eredményezhet, még akkor is, ha nem mindig 100%-ban pontos a geokódolás.


**4. Lokális optimalizáció**
- Az OSM egyes régiókra optimalizált, különösen olyan helyeken, ahol a közösség aktívan dolgozik az adatok frissítésén.
- Budapest részletes térinformatikai adatokkal rendelkezik, ami miatt az OSM gyakran pontosabb, mint a kereskedelmi API-k.

### **Miért vannak különbségek az eredményekben?**

1. **Adatok pontossága és részletessége**:
   - Az OSM széles körben felismeri a címeket, de a kereskedelmi API-k (pl. Azure, Esri) adatai gyakran **strukturáltabbak** és **pontosabbak**, különösen kevésbé lakott régiókban.

2. **Helymeghatározási algoritmusok**:
   - Az OSM egyszerűbb címfeldolgozási logikát használ, amely nagyobb "engedékenységgel" próbál helyeket találni.
   - Ez néha hamis pozitív találatokat eredményezhet, de gyakran több találatot ad, mint a kereskedelmi API-k.

3. **Keresési logika és prioritások**:
   - A kereskedelmi API-k (Azure, Mapbox) szigorúbb címértelmezési logikát alkalmaznak, ami kevesebb, de pontosabb találatot eredményezhet.

4. **Frissítések és közösségi elkötelezettség**:
   - Az OSM adatai folyamatosan frissülnek a közösség által, míg a kereskedelmi API-k hivatalos forrásokból dolgoznak.
   - Magyarországon az OSM közösség aktivitása kiemelkedő, ami jelentős előnyt biztosít.

---

### **Záró gondolatok**

A geokódolási API-k kiválasztása elsősorban az adott projekt céljaitól, méretétől és pénzügyi kereteitől függ. A dokumentumban bemutatott megoldások mindegyike egyedi előnyöket kínál:
- Az OSM/Nominatim ingyenes alternatívája jó kiindulási alap, de figyelembe kell venni a sebességgel és stabilitással kapcsolatos korlátokat.
- A kereskedelmi API-k (Azure, Esri, Mapbox) megbízhatóbbak és skálázhatóbbak, de költséggekel járnak.

Ez a dokumentum alapot nyújtott a négy API közötti különbségek megértéséhez, és segíthet abban, hogy az adott projekt igényeinek megfelelő megoldást válasszunk. A példák és az összehasonlítások alapján a geokódolási API-k hatékony eszközként szolgálhatnak az interaktív térképi alkalmazásokban, legyen szó ingatlanok megjelenítéséről, logisztikai elemzésekről vagy más térinformatikai célokról.
