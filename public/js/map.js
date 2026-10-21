
mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
  container: "map",
  //Choose from Mapbox's core styles or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates,//Starting position [lng,lat]
  zoom: 9,//starting zoom
});


  // Outer element - GL JS controls this
    const el = document.createElement('div');
    el.className = 'airbnb-marker';

    // Inner element - we control this for shape and rotation
    const inner = document.createElement('div');
    inner.className = 'airbnb-marker-inner';

    inner.innerHTML = `
        <div class="icon-wrapper">
            <i class="fa-solid fa-house home-icon"></i>
            <i class="fa-solid fa-compass compass-icon"></i>
        </div>
    `;

    el.appendChild(inner); // puts inner div INSIDE outer div

  

new mapboxgl.Marker({  element: el })
  .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25}).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after Booking</p>`
    )

  )
  .addTo(map);




