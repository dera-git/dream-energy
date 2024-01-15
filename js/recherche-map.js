(function($) {
    "use strict";

	let proxy;

	if (location.protocol !== 'https:') {
		proxy = 'https://cors-anywhere.herokuapp.com/';
	} else {
		proxy = '';
	}

	//api url
	const api_url = 'https://mobility-main.dev.dream-energy-mobility.fr/api';

    //get locations
    const locations = getData("/locations");

	//get location projects
    const locations_projects = getData("/locations/projects");

	let allLocations = [...locations, ...locations_projects];

	//console.log("allLocations", allLocations);

	let markers = [];
	let map;

	function initMap() {
		map = new google.maps.Map(document.getElementById("id-map"), {
			center: new google.maps.LatLng(48.8589466, 2.2769949),
			zoom: 6,
			mapTypeControl: false,
			styles: [
			{
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#f5f5f5"
				}
				]
			},
			{
				"elementType": "labels.icon",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#616161"
				}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
				{
					"color": "#f5f5f5"
				}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "geometry",
				"stylers": [
				{
					"visibility": "simplified"
				}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "geometry.fill",
				"stylers": [
				{
					"color": "#ffffff"
				}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#bdbdbd"
				}
				]
			},
			{
				"featureType": "landscape",
				"stylers": [
				{
					"color": "#f2f8f8"
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#eeeeee"
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#757575"
				}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#e5e5e5"
				}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#ffffff"
				}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#757575"
				}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#dadada"
				}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#616161"
				}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#e5e5e5"
				}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#eeeeee"
				}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#C3D5DE"
				}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			}
			]
		});

		/*Search station*/
		const inputSearch = document.getElementById("id-search-station");
		const searchBox = new google.maps.places.SearchBox(inputSearch);

		map.addListener("bounds_changed", () => {
			searchBox.setBounds(map.getBounds());
		});
		
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			searchBox.set('map', null);

			var places = searchBox.getPlaces();

			var bounds = new google.maps.LatLngBounds();
			var i, place;
			for (i = 0; place = places[i]; i++) {
			(function(place) {
				var Themarker = new google.maps.Marker({
				position: place.geometry.location
				});
				Themarker.bindTo('map', searchBox, 'map');
				google.maps.event.addListener(Themarker, 'map_changed', function() {
				if (!this.getMap()) {
					this.unbindAll();
				}
				});
				bounds.extend(place.geometry.location);


			}(place));

			}
			map.fitBounds(bounds);
			searchBox.set('map', map);
			map.setZoom(Math.min(map.getZoom(),12));

		});
			
		/*End search station*/
		
		const iconBase = "images/";
		const icons = {
			pin: {
			icon: iconBase + "pin.png",
			},
			pinTwo: {
			icon: iconBase + "pin-2.png",
			},
		};

		let features = [];

		if(allLocations) {
			const len = allLocations.length;
			let pinType = "";
			for (var i = 0; i < len; i++) {
				(allLocations[i].key) ? pinType = "pin" : pinType = "pinTwo";
				features.push({
					position: new google.maps.LatLng(allLocations[i].latitude, allLocations[i].longitude),
					type: pinType
				});
			}
		}

		let marker;
		
		for (let i = 0; i < features.length; i++) {
			marker = new google.maps.Marker({
				position: features[i].position,
				icon: icons[features[i].type].icon,
				map: map,
			});
			
			google.maps.event.addListener(marker, 'click', (function (mark) {
				function reInitMarkerIcon() {			
					for (let j = 0; j < markers.length; j++) {
						if(allLocations[j].key) {
							markers[j].setIcon(iconBase + "pin.png");
						} else {
							markers[j].setIcon(iconBase + "pin-2.png");
						}
					}
				}

				return function () {
					reInitMarkerIcon();

					mark.setIcon(iconBase + "pin-active.png");

					document.getElementById("id-wrapper-map-sidebar").innerHTML = renderSidebarMap(allLocations[i]);

					slickify_tips();

					setTimeout(function(){
						document.querySelector('.kl-map-sidebar-infos').classList.add('show');

						document.querySelector('.kl-btn-close-map-sidebar').addEventListener('click', function(){
							document.querySelector('.kl-map-sidebar-infos').classList.remove('show');
							reInitMarkerIcon();
						})
					}, 400)
				};
			})(marker));
			markers.push(marker);
		}	
	}

	function getData(endpoint) {
		let json = null;
		$.ajax({
			'cache': false,
			'async': false,
			'global': false,
			'url': proxy + api_url + endpoint,
			'dataType': "json",
			'success': function (data) {
				json = data;
			},
			'error': function (request) {
				//console.clear()
				console.log(request.status)
			}
		});
		return json;
	}

	function renderSidebarMap(location) {
		let renderImgLocation, renderConnectors, renderAccessDetails;
		if(location.key) {
			renderImgLocation = `<img src="${api_url}/locations/${location.key}/picture.jpg" alt="${location.key}">`
			
			const locationsHasDetails = getData("/locations/"+ location.key+ "/access-details?language=fr");

			if(locationsHasDetails) {
				console.log(locationsHasDetails);
				renderAccessDetails = `
					<div class="kl-kl-map-sidebar-sixth-info">
						<h3>Comment accéder à la station</h3>
						<div class="pe-2">
							<p>${locationsHasDetails.head}</p>
							<div class="kl-itineraire-img me-1">
								<img src="${locationsHasDetails.pictureUrl}" alt="${location.key}">
							</div>
							<div>
								${locationsHasDetails.body}
							</div>
						</div>
					</div>
				`
			} else {
				renderAccessDetails = ""
			}

		} else {
			renderImgLocation = "";
			renderAccessDetails= "";
		}

		if(location.connectors) {
			renderConnectors = `
				<div class="kl-kl-map-sidebar-second-info mb-5">
					<h3>Les connecteurs adaptés</h3>
					<div class="pt-4 px-3">
						${location.connectors.map(i => {
							let connectorIcon, connectorType, connectorStatus, connectorStatusColor, maxPower; 

							switch(i.connectorType) {
								case "CHADEMO":
									connectorIcon = "./images/recherche_station/icon-chademo.svg"
									connectorType = "CHAdeMO"
									break;
								case "IEC_62196_T2_COMBO":
									connectorIcon = "./images/recherche_station/icon-ccs2.svg"
									connectorType = "CCS2"
									break;
								default: 
									connectorIcon = "./images/recherche_station/icon-type2.svg"
									connectorType = "T2"
							}

							if (i.connectorStatus == "AVAILABLE") { 
								connectorStatus = "Libre"
								connectorStatusColor = "kl-color-green-tertiary"
							} else { 
								connectorStatus = "Occupé"
								connectorStatusColor = "kl-color-red-primary"
							}

							maxPower = i.maxPower / 1000

							return (
								`<div class="row align-items-center mb-4 kl-fs-13">
									<div class="col-4 pe-0">
										<img class="me-1" src="${connectorIcon}" alt="icon" />
										<span>${connectorType}</span>
									</div>
									<div class="col-4 text-center">
										<strong>${maxPower} kW</strong>
									</div>
									<div class="col-4 text-end">
										<strong class="${connectorStatusColor}">${connectorStatus}</strong>
									</div>
								</div>`
							)
						}).join('')}
					</div>
				</div>
			`
		} else {
			renderConnectors = ""
		}
		
		return (
            `<div class="kl-map-sidebar-infos kl-hide-scrollbar">
				<button class="btn p-0 kl-btn-close-map-sidebar">
					<svg xmlns="http://www.w3.org/2000/svg" width="10.414" height="10.414" viewBox="0 0 10.414 10.414">
						<g id="Groupe_1746" data-name="Groupe 1746" transform="translate(0.707 0.707)">
						<path id="Tracé_14427" data-name="Tracé 14427" d="M10.5,19.5l9-9" transform="translate(-10.5 -10.5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
						<path id="Tracé_14428" data-name="Tracé 14428" d="M19.5,19.5l-9-9" transform="translate(-10.5 -10.5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
						</g>
					</svg>
				</button>
				<div class="kl-map-sidebar-img">
					${renderImgLocation}
					<a href="#" class="kl-btn-route kl-btn kl-btn-black kl-fs-0 kl-px-15">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
							<path id="route" d="M13.25,10.5h-3a1.25,1.25,0,1,1,0-2.5H13s3-3.344,3-5a3,3,0,1,0-6,0c0,.93.945,2.4,1.778,3.5H10.25a2.75,2.75,0,1,0,0,5.5h3a1.25,1.25,0,0,1,0,2.5H4.222C5.056,13.4,6,11.931,6,11a3,3,0,1,0-6,0c0,1.656,3,5,3,5H13.25a2.75,2.75,0,0,0,0-5.5ZM11.5,3a1.5,1.5,0,0,1,3,0A7.727,7.727,0,0,1,13,5.633,7.75,7.75,0,0,1,11.5,3ZM3,13.631A7.705,7.705,0,0,1,1.5,11a1.5,1.5,0,0,1,3,0A7.762,7.762,0,0,1,3,13.631Z" fill="#fff"/>
						</svg>
					</a>
				</div>
				<div class="kl-map-sidebar-infos-body">
					<div class="kl-kl-map-sidebar-first-info mb-5">
						<h3>${location.name}</h3>
						<div class="mb-2">${location.address} - ${location.zipCode} ${location.city}</div>
						<ul class="list-unstyled kl-fs-13">
							<li>
								<svg class="kl-icon-list-item" xmlns="http://www.w3.org/2000/svg" width="12" height="11.952" viewBox="0 0 12 11.952">
									<path id="location-arrow" d="M11.621,32.377A1.293,1.293,0,0,0,10.689,32a1.276,1.276,0,0,0-.486.1L.8,35.953a1.286,1.286,0,0,0,.487,2.476H5.546v4.261a1.268,1.268,0,0,0,1.286,1.262,1.287,1.287,0,0,0,1.19-.8l3.88-9.381A1.281,1.281,0,0,0,11.621,32.377Zm-.932.909L6.856,42.714V37.143H1.285Z" transform="translate(0.001 -32)"/>
								</svg>                                  
								<span>15,2 km</span>
							</li>
							<li>
								<svg class="kl-icon-list-item" xmlns="http://www.w3.org/2000/svg" width="12" height="10.5" viewBox="0 0 12 10.5">
									<path id="leaf" d="M11.416,32.187A.315.315,0,0,0,11.125,32a.331.331,0,0,0-.288.168A3.092,3.092,0,0,1,8.12,33.695a3.385,3.385,0,0,1-.783-.092A4.064,4.064,0,0,0,6.4,33.5,4.1,4.1,0,0,0,2.32,38.233a7.264,7.264,0,0,0-2.289,3.6.562.562,0,0,0,.439.661.635.635,0,0,0,.112.012.565.565,0,0,0,.551-.449,5.779,5.779,0,0,1,1.545-2.646,4.111,4.111,0,0,0,5.234,2.052,6.429,6.429,0,0,0,4.108-6.33A7.388,7.388,0,0,0,11.416,32.187ZM7.558,40.37l-.031.01-.03.012a2.977,2.977,0,0,1-3.91-1.762,8.489,8.489,0,0,1,4.151-1.4.563.563,0,0,0-.1-1.121,9.758,9.758,0,0,0-4.245,1.318,3,3,0,0,1,2.984-2.82,2.963,2.963,0,0,1,.681.072A4.51,4.51,0,0,0,8.1,34.8a4.285,4.285,0,0,0,2.66-.9,5.387,5.387,0,0,1,.137,1.225A5.3,5.3,0,0,1,7.558,40.37Z" transform="translate(-0.02 -32)"/>
								</svg>                                  
								<span>Economisez 75g de CO2 avec cette borne</span>
							</li>
							<li class="kl-color-green-primary">
								<svg class="kl-icon-list-item" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
									<path id="clock" d="M6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.875A4.875,4.875,0,1,1,10.875,6,4.88,4.88,0,0,1,6,10.875ZM8.393,6.731,6.563,5.674V2.813a.563.563,0,0,0-1.125,0V6a.562.562,0,0,0,.281.487L7.83,7.706a.763.763,0,0,0,.28.075.563.563,0,0,0,.284-1.05Z" fill="#00766f"/>
								</svg>                                  
								<span>Station ouverte</span>
							</li>
							<li class="kl-color-green-primary">
								<svg class="kl-icon-list-item" xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15">
									<g id="Groupe_2128" data-name="Groupe 2128" transform="translate(1648 9556)">
									<path id="plug" d="M7.313.563a.563.563,0,0,0-1.125,0V2.625H7.313Zm-4.5,0a.563.563,0,0,0-1.125,0V2.625H2.813ZM8.438,3.375H.541A.553.553,0,0,0,0,3.916.592.592,0,0,0,.541,4.5H.75V6A3.742,3.742,0,0,0,3.938,9.694v1.743a.563.563,0,0,0,1.125.022V9.715A3.781,3.781,0,0,0,8.25,6V4.5h.188a.563.563,0,0,0,0-1.125ZM7.125,6a2.625,2.625,0,0,1-5.25,0V4.5h5.25Z" transform="translate(-1648 -9553)" fill="#00766f"/>
									<circle id="Ellipse_341" data-name="Ellipse 341" cx="2.5" cy="2.5" r="2.5" transform="translate(-1640 -9556)" fill="#a9f571"/>
									</g>
								</svg>                                                                   
								<span>3/5 places disponibles</span>
							</li>
						</ul>
					</div>
					${renderConnectors}
					<div class="kl-kl-map-sidebar-third-info mb-5">
						<h3>Tarifs</h3>
						<div class="row gx-2 kl-fs-13 text-center">
							<div class="col-6">
								<div class="kl-bg-blue-light kl-border-radius-18 px-2 pt-4 pb-2 h-100">
									<div class="px-3"><strong>Sans abonnement</strong></div>
									<div class="mt-4">La première heure<br> 0,56€ / kWh</div>
									<div class="mt-4">Après 1 heure<br> 0,56€ / kWh</div>
								</div>
							</div>
							<div class="col-6">
								<div class="kl-bg-green-light kl-border-radius-18 px-2 pt-4 pb-2 h-100">
									<div class="px-3"><strong>Avec abonnement</strong></div>
									<div class="mt-4">La première heure<br> 0,46€ / kWh</div>
									<div class="mt-4">Après 1 heure<br>0,46€ / kWh</div>
									<a href="#" class="kl-btn-abonnement kl-btn kl-btn-black">
										Je m’abonne
										<svg class="ms-1" xmlns="http://www.w3.org/2000/svg" width="8.596" height="16" viewBox="0 0 8.596 16">
											<path id="chevron-right" d="M73.506,40.278l6.81,7.107a.89.89,0,0,1,0,1.234l-6.81,7.107a.892.892,0,1,1-1.288-1.234l6.248-6.524-6.247-6.457a.891.891,0,1,1,1.286-1.234Z" transform="translate(-71.969 -40.002)" fill="#fff"/>
										</svg>                                              
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="kl-kl-map-sidebar-fourth-info mb-4">
						<h3>Nos bons plans à proximité</h3>
						<div class="kl-slick-tips">
							<div class="kl-slick-tips-item">
								<div class="kl-card-tips">
									<div class="kl-card-tips-img">
										<img src="./images/recherche_station/optical-center.png" alt="image">
										<div class="kl-card-tips-name">Optical center</div>
									</div>
									<div class="kl-card-tips-body">
										<strong class="d-block">-40% sur tout le magasin</strong>
										<div>Vente privée</div>
									</div>
								</div>
							</div>
							<div class="kl-slick-tips-item">
								<div class="kl-card-tips">
									<div class="kl-card-tips-img">
										<img src="./images/recherche_station/picard.png" alt="image">
										<div class="kl-card-tips-name">Picard</div>
									</div>
									<div class="kl-card-tips-body">
										<strong class="d-block">-40% sur tout le magasin</strong>
										<div>Vente privée</div>
									</div>
								</div>
							</div>
							<div class="kl-slick-tips-item">
								<div class="kl-card-tips">
									<div class="kl-card-tips-img">
										<img src="./images/recherche_station/optical-center.png" alt="image">
										<div class="kl-card-tips-name">Optical center</div>
									</div>
									<div class="kl-card-tips-body">
										<strong class="d-block">-40% sur tout le magasin</strong>
										<div>Vente privée</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="kl-kl-map-sidebar-fifth-info mb-5">
						<h3>Les services à proximité</h3>
						<div class="row kl-gx-16 text-center">
							<div class="col-4">
								<div class="kl-box-services">
									<img src="./images/recherche_station/icon-mug-hot.svg" alt="icon">
								</div>
								<strong class="d-block">Café</strong>
								<span>70m</span>
							</div>
							<div class="col-4">
								<div class="kl-box-services">
									<img src="./images/recherche_station/icon-restroom-simple.svg" alt="icon">
								</div>
								<strong class="d-block">Toilettes</strong>
								<span>120m</span>
							</div>
							<div class="col-4">
								<div class="kl-box-services">
									<img src="./images/recherche_station/icon-fork-knife.svg" alt="icon">
								</div>
								<strong class="d-block">Restaurant</strong>
								<span>700m</span>
							</div>
						</div>
					</div>
					${renderAccessDetails}
				</div>
			</div>`
		)
	}

	function slickify_tips() {
        $('.kl-slick-tips')
		.not(".slick-initialized")
		.slick({
            infinite: false,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
        });
	}

	window.initMap = initMap;

})(jQuery);