
$("#viewButton").click(getDevices); 

function getDevices() {
   // window.location.href='viewDevices.html'; 

    let deviceId = $('#regDevice').val();
    let username = window.localStorage.getItem('username');   //Get user email address from localStorage  

    console.log(deviceId); 
    console.log(username); 

    /*
    try {
      $.ajax({
      url: '/status/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({username:username, zipcode:zipcode, password:password}),
      dataType: 'json'
      })
        .done(getDeviceSuccess)
        .fail(getDeviceError); 
    } 
    catch (ex) {
      window.location = "./homepage.html";
    } */ 
  }