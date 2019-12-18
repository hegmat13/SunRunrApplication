//var divToChange = $("#ifFailure");

var deviceId = "1f002a000e504b5350313120"; 
var divToChange = $(".dataDiv");  

$("#Create").click(createData); 

loadDeviceData(); 

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {
    document.getElementById("demo").style.color = "red";
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function createData() {
console.log("connecter"); 
var data = {
  Date: "100",
  uv: "100",
  lon: "100",
  lat: "100",
  GPS_speed: "100",
  deviceId: "1f002a000e504b5350313120",
  apikey: "E0fqeTlyWMnyJzppbN6IRTrJW8DWfg2g"
}

  try {
    $.ajax({
    url: '/photon/hit',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json'
    })
      .done(registerSuccess)
      .fail(registerError); 
  } 
  catch (ex) {
    window.location = "./homepage.html";
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
    // window.location = "./homepage.html";  // TODO: Uncomment below
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
}
          

   

function loadDeviceData() {
  // let devID = $('#regDevice').val();

  //if (!isValidID()) return;

  $.ajax({
    url: '/devices/data',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({deviceId : deviceId}),
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
    let GPS_speed;
    let lat;
    let lon;
    let uv = 0.000000;
    let publishTime; 
    let uvtotal = 0.000000; 
    let size = parseInt(data.data.length); 
    let uvaverage = 0.000000; 


    for (let obj of data.data) {
      GPS_speed = obj.GPS_speed;
      lat = obj.lat;
      lon = obj.lon;
      uv = obj.uv;
      publishTime = obj.publishTime;
      uvtotal += parseInt(uv); 
     // addHTML += '<ul><li>Published: ' + publishTime + '</li><li>Latitude/Longitude: ' + lat + ' / ' + lon + '</li><li>Speed: ' + GPS_speed + ' knots</li><li>UV Reading: ' + uv + ' mW/cm&#178;</li></ul><br>';
    }

    console.log(size); 
    console.log(uvtotal); 
    uvaverage = uvtotal/size; 

    console.log(uvaverage); 

    $("#uv").html(uvaverage); 
    $("#duration").html(publishTime); 

    // parToEdit.html(addHTML);    
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error1: " + data.message + "</span>");
    divToChange.show();
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
  if (!window.localStorage.getItem('authToken')) {
      window.location.replace('login.html');
  }
  else {
    $('.registerButton').click(loadDeviceData);
    $('#password').keypress(function(event) {
      if (event.which === 13) {
        loadDeviceData();
      }
    });
  }
});