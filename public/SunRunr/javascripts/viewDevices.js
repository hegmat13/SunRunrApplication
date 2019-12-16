
$("#viewButton").click(getDevices); 

//Temporary Json data returned 
var deviceData = {username: "heger", lastAccess: "12/15/2019", zipcode: "55378", deviceList: [{apikey: "First Device apikey", deviceId: "First Device Id"}, {apikey: "First Device apikey", deviceId: "First Device Id"}]}; 

//var requestData = {"username": ""}; 
function getDevices() {
   // window.location.href='viewDevices.html'; 

    let deviceId = $('#regDevice').val();
    let username = window.localStorage.getItem('username');   //Get user email address from localStorage 
   // let authToken =  window.localStorage.getItem('authToken');   //Get user email address from localStorage 

    console.log(deviceId); 
    console.log(username); 
    console.log(deviceData.deviceList[0].apikey); 
    //console.log(authToken); 

    try {
        $.ajax({
            url: '/users/account',
            type: 'GET',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },
            dataType: 'json'
          })
        .done(getDeviceSuccess)
        .fail(getDeviceError); 
    } 
    catch (ex) {
      window.location = "./homepage.html";
    } 
  }

  function getDeviceSuccess(data, textStatus, jqXHR) {
    var listHtml = ""; 
    console.log(data); 
    console.log(data.devices); 
    console.log(data.devices.length); 
    if (data.success) {  
      for(let obj of data.devices) {
        let deviceId = obj.deviceId; 
        let apikey = obj.apikey; 
        console.log(deviceId); 
        console.log(apikey); 
        listHtml = "<li> Device ID: " + deviceId + " API key: " + apikey; 
      }
      window.location.replace("viewDevices.html");

     $(".devicesList").html(listHtml); 

     }
//     else {
//       divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
//       divToChange.show();
//     }
  }

  function getDeviceError(jqXHR, textStatus, errorThrown) {
    if (jqXHR.statusCode == 404) {
      divToChange.html("<span class='red-text text-darken-2'>Server could not be reached.</p>");
      divToChange.show();
    }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + jqXHR.status + " " + jqXHR.responseText + "</span>");
      divToChange.show();
    }
  }