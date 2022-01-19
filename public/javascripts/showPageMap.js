mapboxgl.accessToken = mapToken;
const { coordinates } = campground.geometry;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h6>${campground.title}</h6><p>${campground.location}<p>`
    )
  )
  .addTo(map);
