$('#geodrop-submit-button').click(function(data) {
	var text = $('#geodrop-text').val();
	
	if (text.length > 0) {
		
		navigator.geolocation.getCurrentPosition(
			position => {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				
				console.log('text', text);
				console.log('lat', lat);
				console.log('lng', lng);
				
				$.ajax({
					url: 'http://localhost:3000/api/v1/geodrop',
					method: 'post',
					contentType: 'application/json',
					data: JSON.stringify({lat: lat, lng: lng, text: text})
				}).done(function(res) {
					console.log('result', res);
					location.href=('/');
				});
			},
			error => {
				console.log('Error occurred. Error code: ' + error.code);
				// error.code can be:
				//   0: unknown error
				//   1: permission denied
				//   2: location unavailable (error response from location provider)
				//   3: timed out			
			}
		);
		
	} else {
		// Materialize.toast(message, displayLength, className, completeCallback);
		Materialize.toast('No message entered!', 4000, 'red lighten-1') // 4000 is the duration of the toast
	}
});
