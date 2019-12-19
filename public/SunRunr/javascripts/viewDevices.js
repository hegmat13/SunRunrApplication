var divToChange = $(".ErrorDiv");

var deleteID = $(".regDevice").val(); 
$("#5").click(deleteDevice); 

getDevices(); 

//Temporary Json data returned 
//var deviceData = {username: "heger", lastAccess: "12/15/2019", zipcode: "55378", deviceList: [{apikey: "First Device apikey", deviceId: "First Device Id"}, {apikey: "First Device apikey", deviceId: "First Device Id"}]}; 

//var requestData = {"username": ""}; 
function getDevices() {
   // window.location.href='viewDevices.html'; 

   // let deviceId = $('#regDevice').val();
    let username = window.localStorage.getItem('username');   //Get user email address from localStorage 
   // let authToken =  window.localStorage.getItem('authToken');   //Get user email address from localStorage 
  // if (!isValidInput()) return;
   // console.log(deviceId); 
    console.log(username); 
   // console.log(deviceData.deviceList[0].apikey); 
    //console.log(authToken); 

    try {
        $.ajax({
            url: '/users/account',
            type: 'GET',
            headers: {'x-auth': window.localStorage.getItem("authToken") },
            dataType: 'json'
          })
        .done(getDeviceSuccess)
        .fail(getDeviceError); 
    } 
    catch (ex) {
    //  window.location = "./homepage.html";
      divToChange.html(ex); 
      console.log(ex); 
      console.log(ex); 
    } 
  }

  function getDeviceSuccess(data, textStatus, jqXHR) {
    var listHtml = ""; 
    listHtml = "<div class='devicesTop' >All devices currently registered to " + window.localStorage.getItem('username') + ":</div>"; 

    console.log(data); 
    console.log(data.devices); 
    console.log(data.devices.length); 

    if (data.success) {  
      for(let obj of data.devices) {
        let deviceId = obj.deviceId; 
        let apikey = obj.apikey; 
        console.log(deviceId); 
        console.log(apikey); 
        listHtml += "<p id=" + deviceId +"> Device ID: " + deviceId + ", API key: " + apikey + " </p> "; 
      }

     $(".devicesList").html(listHtml); 

     }
    else {
      divToChange.html("<span class='red-text text-darken-2'>Error: " + data.message + "</span>");
      divToChange.show();
    }
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


  function deleteDevice() {
    var deviceId = $("#deleteDevice").val(); 
    console.log(deviceId); 
    try {
      $.ajax({
      url: '/devices/delete',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({deviceId:deviceId}),
      dataType: 'json'
      })
        .done(deleteSuccess)
        .fail(deleteError); 
    } 
    catch (ex) {
      window.location = "./homepage.html";
    }
  }

  function deleteSuccess (data, textStatus, jqXHR) {
    if(data.deleted == true) {
      var deleteID = $(".regDevice").val(); 
      deleteIdli = "#" + deleteID; 
      console.log(deleteIdli); 
      $(deleteIdli).remove(); 
      console.log(data.message); 
    }
  }



  function deleteError (jqXHR, textStatus, errorThrown) {
    console.log("errror"); 
    if (jqXHR.statusCode == 404) {
      $(".deleteDivError").html("<span class='red-text text-darken-2'>Server could not be reached.</span>");
      $(".deleteDivError").show();
    }
    else {
      response = JSON.parse(jqXHR.responseText); 
      $(".deleteDivError").html("<span class='red-text text-darken-2'>Error: " + jqXHR.status + " " + response.message + "</span>");
      $(".deleteDivError").show();
    }
  }

 