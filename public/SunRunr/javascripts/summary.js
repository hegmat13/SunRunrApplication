//var divToChange = $("#ifFailure");

var deviceId = "1f002a000e504b5350313120"; 
var divToChange = $(".dataDiv");   

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function createData() {
  console.log("connecter"); 
  var data = {
    Date: Date.now(),
    uv: ((500 + Math.random() * 40).toFixed(6)).toString(),
    lon: "100",
    lat: "100",
    GPS_speed: ((4.8 + Math.random()*.4).toFixed(2)).toString(),
    deviceId: "1f002a000e504b5350313120",
    apikey: "E0fqeTlyWMnyJzppbN6IRTrJW8DWfg2g"
  }

  // try {
    $.ajax({
    url: '/photon/hit',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json'
    })
      .done(registerSuccess)
      .fail(registerError); 
  // } 
  // catch (ex) {
  //   window.location = "./index.html";
  // }
}

function registerSuccess(data, textStatus, jqXHR) {
  // window.location = "./homepage.html";  // TODO: Uncomment below
  if (data.status == "OK") {  
    console.log("success"); 
  // window.location = "./homepage.html";
  
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error1: " + data.message + "</span>");
    divToChange.show();
  }
}

function registerError(jqXHR, textStatus, errorThrown) {
  window.location = "./index.html";  // TODO: Uncomment below
  if (jqXHR.status == 404) {
    divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
  divToChange.show();
  }
  else {
    response = JSON.parse(jqXHR.responseText); 
    divToChange.html("<span class='red-text text-darken-2'>Error2: " + response.message + "</span>");
    divToChange.show();
  }
}

function loadDeviceData() {
  // let devID = $('#regDevice').val();

  //if (!isValidID()) return;

  // $.ajax({
  //   url: '/devices/data',
  //   type: 'POST',
  //   contentType: 'application/json',
  //   data: JSON.stringify({deviceId : deviceId}),
  //   dataType: 'json'
  // })

  $.ajax({
    url: '/users/data',
    type: 'GET',
    headers: { 'x-auth': window.localStorage.getItem("authToken") },
    dataType: 'json'
  })
    .done(loadSuccess)
    .fail(loadError);
}

function loadSuccess(data, textStatus, jqXHR) { // TODO: Needs to change
  
  console.log(data); 
  if (data.success) {
    let addHTML = '<p>Recorded posts from device:</p>';

    $('.formToRemove').addClass('hide');
    let uvtotal = 0.000000; 
    let totalduration = 0.000000;
    let totalCal = 0.000000; 
    let activityList = [];

    for (let list of data.data) { //each list is one device ID's list of hwData
    let activity = [];
      let totDist = 0;
      let totSpeed = 0;
      let uvtot = 0;
      for (let i in list) { // getting all hits of a device
        let hit = list[i];
        let prevHit = list[i-1];
        if (i != 0) {
          if (hit.publishTime > (prevHit.publishTime + 900000)) { //15 minutes seperates 2 activities
            let date = Date(activity[0].publishTime).toString().substr(4, 11);
            
            let avgSpeed = totSpeed/activity.length;
            if (avgSpeed <= 3.1) { //avg walking speed
              let type = "Walking";
              let calories = 80 * totDist; //80 cal per mile walking
            }
            else if (avgSpeed <= 8.3) { //avg running speed
              let type = "Running";
              let calories = 100 * totDist; //100 cal per mile
            }
            else { //biking
              let type = "Biking";
              let calories = 48 * totDist; //48 cal per mile
            }
            let duration = (activity[activity.length - 1] - activity[0])/60000; //time in minutes of activity
            uvAvg = uvtot/activity.length;

            activityList.push({data: activity, date: date, dist: totDist, time: activity[0].publishTime, uv: uvAvg, speed: avgSpeed, type: type, calories: calories, duration: duration}); //sorts activities by most recent
            
            activity = [];

            totDist = 0;
            totSpeed = 0;
            uvtot = 0;

            totSpeed += hit.GPS_Speed * 1.15078; // to mph
            activity.push(hit);
            uvtot += parseInt(hit.uv);
            continue;
          }
        }
        else {
          totSpeed += hit.GPS_Speed * 1.15078; // to mph
          activity.push(hit);
          uvtot += parseInt(hit.uv);
          continue;
        }
        totDist += distance(prevHit.lat, prevHit.lon, hit.lat, hit.lon, 'M'); //to miles
        totSpeed += hit.GPS_Speed * 1.15078;
        uvtot += parseInt(hit.uv);
      }
    }
    
    let i = 0;
    for (let activity of activityList) {
      if ((Date.now() - activity.time) < 604800000) { //activities from within a week from current date
        totalduration += activity.dist;
        totalCal += activity.calories;
        uvtotal += activity.uv;
        i += 1;
      }
    }

    $("#uv").html(uvtotal/i); 
    $("#duration").html(totalduration); 
    $('#calories').html(totalCal);
 
  }
  else {
    console.log(data.errors)
  }
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
  
function loadError(jqXHR, textStatus, errorThrown) { // TODO: Needs to change
  if (jqXHR.statusCode == 404) {
    divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
    divToChange.show();
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error2: " + jqXHR.responseJSON.message + "</span>");
    divToChange.show();
  }
}

function isValidID() {
  let isValid = true;
  let deviceId = $('#regDevice').val();
  let failHTML = '';

  let deviceIdRe = /^[0-9a-f]{24}$/;

	if (!deviceIdRe.test(deviceId)) {
		$('#regDevice').addClass('error');
    failHTML += ("<p><span class='red-text text-darken-2'>Please enter valid Device ID that contains only hexadecimal characters.</span></p>");
		isValid = false;
	}
	else {
		$('#regDevice').removeClass('error');
	}
	
	if (deviceId.length != 24) {
    $('#regDevice').addClass('error');
    failHTML += ("<p><span class='red-text text-darken-2'>Device ID must be exactly 24 characters.</span></p>");
    isValid = false;
  }
  else {
    $('#regDevice').removeClass('error');
  }
    
	if (isValid == false) {
		divToChange.html(failHTML);
    divToChange.show();
	}
	
  return isValid;
}

$(function() {  
  // if (!window.localStorage.getItem('authToken')) {
  //     window.location.replace('login.html');
  // }
  // else {
    $("#Create").click(createData);
    loadDeviceData();
    $('.registerButton').click(loadDeviceData);
    $('#password').keypress(function(event) {
      if (event.which === 13) {
        loadDeviceData();
      }
    });
  // }
});