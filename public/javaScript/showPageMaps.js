
mapboxgl.accessToken = accessToken;
// console.log(camp.geoData.coordinates)
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: camp.geoData.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
const marker1 = new mapboxgl.Marker()
.setLngLat(camp.geoData.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${camp.title}</h3><p>${camp.location}</p>`
        )
)
.addTo(map);
