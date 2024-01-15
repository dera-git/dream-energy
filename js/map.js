let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("id-map"), {
    center: new google.maps.LatLng(48.8589466, 2.2769949),
    zoom: 7,
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
  
  const contentString = `<div class="kl-map-tooltip">
  	<div class="kl-font-primary kl-fs-12">
  		<div class="fw-bold">Pellentesque ornare sem laciniavestibulum.</div>
		<div>97 Rue Marcel Sembat, 59810 Lesquin</div>
	</div>
	<div class="kl-fs-8 d-flex flex-wrap justify-content-between mt-2">
  		<span>
  			<img class="me-1" src="./images/icon-T2.svg" alt="icon" />
			T2
		</span>
		<span class="kl-fw-medium">
			22 kW
		</span>
		<span>
  			<img class="me-1" src="./images/icon-ccs2.svg" alt="icon" />
			CCS2
		</span>
		<span class="kl-fw-medium">
			160 kW
		</span>
	</div>
	<a href="#" class="kl-btn kl-btn-sm kl-btn-black mt-1 py-2 kl-fs-12 kl-min-h-0">J’y vais</a>
  </div>`;
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
	maxWidth: 221,
  });
  
  const iconBase = "images/";
  const icons = {
    pin: {
      icon: iconBase + "pin.png",
    },
    pinTwo: {
      icon: iconBase + "pin-2.png",
    },
  };
  const features = [
    {
      position: new google.maps.LatLng(48.8589466, 2.2769949),
      type: "pin",
    },
    {
      position: new google.maps.LatLng(48.8213728, 2.2781833),
      type: "pin",
    },
    {
      position: new google.maps.LatLng(48.9128403, 2.3710512),
      type: "pin",
    },
    {
      position: new google.maps.LatLng(48.7957996, 2.2167864),
      type: "pin",
    },
    {
      position: new google.maps.LatLng(48.8963798, 2.1326852),
      type: "pinTwo",
    },
    {
      position: new google.maps.LatLng(48.8125246, 2.3697275),
      type: "pinTwo",
    },
    {
      position: new google.maps.LatLng(43.2805098, 5.2405627),
      type: "pinTwo",
    },
    {
      position: new google.maps.LatLng(46.5847271, 0.3014169),
      type: "pin",
    },
  ];

 
  for (let i = 0; i < features.length; i++) {
    const marker = new google.maps.Marker({
      position: features[i].position,
      icon: icons[features[i].type].icon,
      map: map,
    });
	
	  marker.addListener("click", () => {
		infowindow.open({
		  anchor: marker,
		  map,
		  shouldFocus: false,
		});
	  });
	  
  }
  
}

window.initMap = initMap;