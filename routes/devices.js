let express = require('express');
let router = express.Router();
var Device = require("../models/device");
var HwData = require("../models/hwdata");
let fs = require('fs');
let jwt = require("jwt-simple");

/* Authenticate user */
var secret = "secret"; // fs.readFileSync(__dirname + '/../../jwtkey').toString();

// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
  let newApikey = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (let i = 0; i < 32; i++) {
    newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return newApikey;
}

// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
  let deviceId = req.params.devid;
  let responseJson = { devices: [] };

  if (deviceId == "all") {
    let query = {};
  }
  else {
    let query = {
      "deviceId" : deviceId
    };
  }
  
  Device.find(query, function(err, allDevices) {
    if (err) {
      let errorMsg = {"message" : err};
      res.status(400).json(errorMsg);
    }
    else {
      for(let doc of allDevices) {
        responseJson.devices.push({ "deviceId": doc.deviceId,  "lastContact" : doc.lastContact});
      }
    }
    res.status(200).json(responseJson);
  });
});

router.post('/delete', function(req, res, next) {
  let responseJson = {
    deleted: false,
    message : ""
  };
  console.log("Inside Delete"); 

  if( !req.body.hasOwnProperty("deviceId")) {
    responseJson.message = "Missing deviceId.";
    return res.status(400).json(responseJson);
  }
/*
  Device.deleteOne(deleteQuery, funciton(err) {
 
  }); 
  var deleteQuery = { deviceId: req.body.deviceId }; 
*/

  try {
    Device.findOneAndDelete({deviceId: req.body.deviceId}, function(err, dev) {
    console.log(dev); 
      if(dev == null) {
      responseJson.deleted = false; 
      responseJson.message = 'Device with ID ' + req.body.deviceId + ' is not currently registered to this user.';
      return res.status(404).json(responseJson); 
    }
      else {
        console.log("Deleteion was successful"); 
        responseJson.deleted = true; 
        responseJson.message = 'Device with ID ' + req.body.deviceId + ' successfully deleted.';
        return res.status(200).json(responseJson);
      }
    }); 
  }
  catch (e) {
    responseJson.message = e;
    return res.status(400).json(responseJson);
  }
});

router.post('/register', function(req, res, next) {
  let responseJson = {
    registered: false,
    message : "",
    apikey : "none",
    deviceId : "none"
  };
  let deviceExists = false;
  
  // Ensure the request includes the deviceId parameter
  if( !req.body.hasOwnProperty("deviceId")) {
    responseJson.message = "Missing deviceId.";
    return res.status(400).json(responseJson);
  }

  let email = "";
    
  // If authToken provided, use email in authToken 
  if (req.headers["x-auth"]) {
    try {
      let decodedToken = jwt.decode(req.headers["x-auth"], secret);
      email = decodedToken.email;
    }
    catch (ex) {
      responseJson.message = "Invalid authorization token.";
      return res.status(400).json(responseJson);
    }
  }
  else {
    // Ensure the request includes the email parameter
    if( !req.body.hasOwnProperty("username")) {
      responseJson.message = "Invalid authorization token or missing email address.";
      return res.status(400).json(responseJson);
    }
    username = req.body.username;
  }
    
  // See if device is already registered
  Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
    if (device !== null) {
      responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
      return res.status(400).json(responseJson);
    }
    else {
      // Get a new apikey
	   deviceApikey = getNewApikey();
	    
	    // Create a new device with specified id, user email, and randomly generated apikey.
      let newDevice = new Device({
        deviceId: req.body.deviceId,
        username: username,
        apikey: deviceApikey
      });

      // Save device. If successful, return success. If not, return error message.
      newDevice.save(function(err, newDevice) {
        if (err) {
          responseJson.message = err;
          // This following is equivalent to: res.status(400).send(JSON.stringify(responseJson));
          return res.status(400).json(responseJson);
        }
        else {
          responseJson.registered = true;
          responseJson.apikey = deviceApikey;
          responseJson.deviceId = req.body.deviceId;
          responseJson.message = "Device ID " + req.body.deviceId + " was registered.";
          return res.status(201).json(responseJson);
        }
      });
    }
  });
});

router.post('/data', function(req, res, next) {
  let deviceId1 = req.body.deviceId;
  let responseJson = { success: false, data: [] };
  
  HwData.find({ deviceId : deviceId1 }, function(err, allData) {
    if (err) {
      let errorMsg = {"message" : err};
      return res.status(400).json(errorMsg);
    }
    else {
      for(let doc of allData) {
        responseJson.data.push({ "deviceId" : doc.deviceId, "GPS_speed" : doc.GPS_speed, "lat" : doc.lat, "lon" : doc.lon, "uv" : doc.uv, "publishTime" : doc.publishTime});
        responseJson.success = true;
      }
      return res.status(200).json(responseJson);
    }
  });
});

router.post('/ping', function(req, res, next) {
    let responseJson = {
        success: false,
        message : "",
    };
    let deviceExists = false;
    
    // Ensure the request includes the deviceId parameter
    if( !req.body.hasOwnProperty("deviceId")) {
        responseJson.message = "Missing deviceId.";
        return res.status(400).json(responseJson);
    }
    
    // If authToken provided, use email in authToken 
    try {
        let decodedToken = jwt.decode(req.headers["x-auth"], secret);
    }
    catch (ex) {
        responseJson.message = "Invalid authorization token.";
        return res.status(400).json(responseJson);
    }
    
    request({
       method: "POST",
       uri: "https://api.particle.io/v1/devices/" + req.body.deviceId + "/pingDevice",
       form: {
	       access_token : particleAccessToken,
	       args: "" + (Math.floor(Math.random() * 11) + 1)
        }
    });
            
    responseJson.success = true;
    responseJson.message = "Device ID " + req.body.deviceId + " pinged.";
    return res.status(200).json(responseJson);
});

module.exports = router;