var divToChange = $("#ifFailure");

function getHWdata() {
 
  try {
    $.ajax({
    url: '/photon/hit',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({username:username, zipcode:zipcode, password:password}),
    dataType: 'json'
    })
      .done(registerSuccess)
      .fail(registerError); 
  } 
  catch (ex) {
    window.location = "./homepage.html";
  }
}

function registerSuccess(data, textStatus, jqXHR) {
  // window.location = "./homepage.html";  // TODO: Uncomment below
  if (data.success) {  
    window.location = "./homepage.html";
  }
  else {
    divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
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
    divToChange.html("<span class='red-text text-darken-2'>Error: " + response.message + "</span>");
    divToChange.show();
  }
}