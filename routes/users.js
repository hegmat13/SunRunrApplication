let express = require('express');
let router = express.Router();
let User = require("../models/user");
let Device = require("../models/device");
let fs = require('fs');
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");

/* Authenticate user */
var secret = 'secret'; //fs.readFileSync(__dirname + '/../../jwtkey').toString();


router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
       res.status(401).json({success : false, message : "Can't connect to DB."});         
    }
    else if(!user) {
       res.status(401).json({success : false, message :  "username or password invalid."});         
    }
    else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
         if (err) {
           res.status(401).json({success : false, message : "Error authenticating. Contact support." + user.passwordHash});         
         }
         else if(valid) {
            var authToken = jwt.encode({username: req.body.username}, secret);
            res.status(201).json({success:true, authToken: authToken});
         }
         else {
            res.status(401).json({success : false, message : "username or password invalid."});         
         }
      });
    }
  });
});

/* Register a new user */
router.post('/register', function(req, res, next) {
   bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) {
         // res.status(400).json({success : false, message : err.errmsg});         
         res.status(400).json({success : false, message : 'error1'});         
      }
      else {
        console.log(req.body); 
        var newUser = new User;
        newUser.username = req.body.username;
        newUser.passwordHash = hash;
        newUser.zipcode = req.body.zipcode;
        
        newUser.save(function(err, user) {
          if (err) {
             res.status(400).json({success : false, message : err.message});         
          }
          else {
             res.status(201).json({success : true, message : "Account with username " + user.username + "has been created."});                      
          }
        });
      }
   });   
});

/*
router.get("/account" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];
   
   try {
      var decodedToken = jwt.decode(authToken, secret);
      var userStatus = {};
      
      User.findOne(  username: decodedToken   username}, function(err, user) {
         if(err) {
            return res.status(400).json({success: false, message: "User does not exist."});
         }
         else {
            userStatus['success'] = true;
            userStatus[ username'] = user username;
            userStatus['lastAccess'] = user.lastAccess;
            userStatus['zipcode'] = user.zipcode;
            
            // Find devices based on decoded token
		      Device.find({ use username : decodedToken username}, function(err, devices) {
			      if (!err) {
			         // Construct device list
			         let deviceList = []; 
			         for (device of devices) {
				         deviceList.push({ 
				               deviceId: device.deviceId,
				               apikey: device.apikey,
				         });
			         }
			         userStatus['devices'] = deviceList;
			      }
			      
               return res.status(200).json(userStatus);            
		      });
         }
      });
   }
   catch (ex) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
}); */ 


module.exports = router;