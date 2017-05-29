$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();
});


function initMap() {
	navigator.geolocation.getCurrentPosition(
		position => {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			
			var center = {lat: lat, lng: lng}; // create the map
			var map = new google.maps.Map(document.getElementById('map'), {
			  zoom: 20,
			  center: center,
			  disableDefaultUI: true
			});
			
			$.ajax({ // create all the markers
				url: 'http://localhost:3000/api/v1/geodrop/location/' + lat + ',' + lng,
				method: 'get',
			}).done(function(res) {
				console.log('result', res);
				var marker = [];
				res.map(r=> {
					marker[r.id] = new google.maps.Marker({
						position: { lat: r.lat, lng: r.lng },
						//icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',
						icon: 'http://coderx.io/drop/img/flag.png',
						map: map
					});
					
					marker[r.id].addListener('click', function() {
						$.ajax({
							url: 'http://localhost:3000/api/v1/geodrop/location/36.1912198,-86.7296563',
							method: 'get',
						}).done(function(res) {
							$.ajax({ // is this marker close enough?
								url: 'http://localhost:3000/api/v1/geodrop/location/' + lat + ',' + lng + '/id/' + r.id,
								method: 'get',
							}).done(function(res) {
								var message = (res.length > 0 ? res[0].text : 'Not close enough!');
								$('#message').text(message);
								$('#message-modal').modal('open');
								console.log(message);
							});
						});
					});
				});
			});
		},
		error => { // error getting geolocation
			console.log('Error occurred. Error code: ' + error.code);
			// error.code can be:
			//   0: unknown error
			//   1: permission denied
			//   2: location unavailable (error response from location provider)
			//   3: timed out			
		}
	);
}


$('#center-map-button').click(function(){
 if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		 map.panTo(initialLocation);
     });
 }
});