var divToChange = $("#ifFailure");

function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {
    document.getElementById("demo").style.color = "red";
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function loadDeviceData() {
  let devID = $('#regDevice').val();

  if (!isValidID()) return;
  
  $.ajax({
    url: '/devices/data',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({deviceId : devID}),
    dataType: 'json'
  })
    .done(loadSuccess)
    .fail(loadError);
}

function loadSuccess(data, textStatus, jqXHR) { // TODO: Needs to change
  if (data.success) {
    let parToEdit = $('#dataArea');
    let addHTML = '<p>Recorded posts from device:</p>';

    $('.formToRemove').addClass('hide');

    for (let obj of data.data) {
      let GPS_speed = obj.GPS_speed;
      let lat = obj.lat;
      let lon = obj.lon;
      let uv = obj.uv;
      let publishTime = obj.publishTime;

      addHTML += '<ul><li>Published: ' + publishTime + '</li><li>Latitude/Longitude: ' + lat + ' / ' + lon + '</li><li>Speed: ' + GPS_speed + ' knots</li><li>UV Reading: ' + uv + ' mW/cm&#178;</li></ul><br>';
    }

    parToEdit.html(addHTML);    
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