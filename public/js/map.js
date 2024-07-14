mapboxgl.accessToken = mapaccesstoken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // style : "mapbox://styles/mapbox/satellite-streets-v12" , 
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 15, // starting zoom
});

//  Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<p>Exact location provided after booking </p>"
    )
  )
  .addTo(map);
