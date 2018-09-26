var arr_Latitude = []
var arr_Longitude = []
var map;
function initMap() {
	var myLatLng = { lat: 43.659899, lng: -79.388492 };
	// Create a map object and specify the DOM element
	// for display.
	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 12
	});

	// Create a marker and set its position.
	var fdafads = new google.maps.Marker({
		map: map,
		position: myLatLng,
		title: 'My Location'
	});
}

fetch("http://localhost:4001/DentalCare")
	.then(res => res.json()
		.then((res => {
			console.log(res);
			for (var i = 0; i < 21; i++) {
				arr_Longitude.push(res[i].Lat)
				arr_Latitude.push(res[i].Long)
				appendResponse(res[i].Name, res[i].PCode, res[i].Contact);
			}
		})
		))
	.then(res => {
		console.log(arr_Latitude);

		for (let i = 0; i < arr_Latitude.length; i++) {
			console.log(`position: { lat: ${arr_Latitude[i]}, lng: ${arr_Longitude[i]} }`)
			var marker = new google.maps.Marker({
				map: map,
				position: { lat: arr_Latitude[i], lng: arr_Longitude[i] },
				title: `Location ${i}`
			});
		}
	});





function appendResponse(name, pcode, contact) {
	let results_table = document.querySelector('#results_table');
	var node = document.createElement("tr");
	node.innerHTML = `
					<td>${name}
						<br>
					</td>
					<td>
						<p>Toronto, ON ${pcode}</p>
						<div>
							<div>${contact}</div>
							<div></div>
						</div>
						<div>
							<br>
							<p>
								<strong>Clinic Hours</strong>:</p>
							<p>Monday and Tuesday – 8 am to 4 pm</p>
							<p>Wednesday – &nbsp;10 am to 6 pm</p>
							<p>Thursday and Friday – 8 am to 4 pm</p>
						</div>
						<div></div>
					</td>
                    `;
	results_table.appendChild(node);
}
