var express = require('express');
var router = express.Router();
var Device = require("../models/device");
var HwData = require("../models/hwdata");

/* POST: Register new device. */
router.post('/hit', function(req, res, next) {
  console.log("Post Recieved from WebHook"); 
  
  console.log(req.body); 
  var responseJson = { 
    status : "",
    message : ""
  };

  // Ensure the POST data include properties id and email
  if( !req.body.hasOwnProperty("deviceId") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing deviceId parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  if( !req.body.hasOwnProperty("apikey") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing apikey parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }
  
  if( !req.body.hasOwnProperty("lon") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing lon parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }
  
  if( !req.body.hasOwnProperty("lat") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing lat parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  if( !req.body.hasOwnProperty("GPS_speed") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing GPS_speed parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  if( !req.body.hasOwnProperty("uv") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing uv parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  if( !req.body.hasOwnProperty("Date") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing Date parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  // Find the device and verify the apikey
  
  Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
    if(err) {return res.status(400).json({message:err.message}); }
    if (device !== null) {
      /*
      if (device.apikey != req.body.apikey) {
        responseJson.status = "ERROR";
        responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
        return res.status(201).send(JSON.stringify(responseJson));
      } */
    //  else {
        // Create a new hw data with user email time stamp 
        var newHwData = new HwData({
          apikey:   req.body.apikey,
          deviceId: req.body.deviceId,
          GPS_speed: req.body.GPS_speed, 
          lon: req.body.lon,
          lat: req.body.lat,
          uv : req.body.uv,
          publishTime: req.body.Date
        });

        console.log(newHwData); 

        // Save device. If successful, return success. If not, return error message.                          
        newHwData.save(function(err, newHwData) {
          if (err) {
            responseJson.status = "ERROR";
            responseJson.message = "Error saving data in db.";
            return res.status(201).send(JSON.stringify(responseJson));
          }
          else {
            responseJson.status = "OK";
            responseJson.message = "Data saved in db with object ID " + newHwData._id + ".";
            return res.status(201).send(JSON.stringify(responseJson));
          }
        });
     // }
    } 
    else {
      responseJson.status = "ERROR";
      responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
      return res.status(201).send(JSON.stringify(responseJson));    
    }
  });
}); 

module.exports = router;
