function openNav() { document.getElementById("menu").style.width = "250px";}

function closeNav() {document.getElementById("menu").style.width = "0";}

function logout() {
    document.getElementById("demo").style.color = "red";
    window.localStorage.removeItem('authToken');
    window.location.replace('login.html');
}

function loadDeviceData() {
    $.ajax({
        url: '/devices/data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({deviceID:deviceID}), // TODO: Adapt summary page to ask for which device to show stats for
        dataType: 'json'
        })
          .done(loadSuccess)
          .fail(loadError);
}

function loadSuccess(data, textStatus, jqXHR) { // TODO: Needs to change
    if (data.success) {
        divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
    }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
      divToChange.show();
    }
  }
  
  function loadError(jqXHR, textStatus, errorThrown) { // TODO: Needs to change
    if (jqXHR.statusCode == 404) {
      divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
        divToChange.show();
    }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.responseJSON.message + "</span>");
      divToChange.show();
    }
  }

$(function() {  
    if (!window.localStorage.getItem('authToken')) {
        window.location.replace('login.html');
    }
    else {
        loadDeviceData();
    }
  });