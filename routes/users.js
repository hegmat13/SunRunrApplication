let express = require('express');
let router = express.Router();
let User = require("../models/user");
let Device = require("../models/device");
var HwData = require("../models/hwdata");
let fs = require('fs');
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");

/* Authenticate user */
var secret = 'secret'; //fs.readFileSync(__dirname + '/../../jwtkey').toString();


router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      return res.status(401).json({success : false, message : "Can't connect to DB."});         
    }
    else if(!user) {
      return res.status(401).json({success : false, message :  "username or password invalid."});         
    }
    else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
         if (err) {
            return res.status(401).json({success : false, message : "Error authenticating. Contact support." + user.passwordHash});         
         }
         else if(valid) {
            var authToken = jwt.encode({username: req.body.username}, secret);
            return res.status(201).json({success:true, authToken: authToken});
         }
         else {
            return res.status(401).json({success : false, message : "username or password invalid."});         
         }
      });
    }
  });
});

// Changing password
router.post('/newpw', function(req, res, next) {
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];

   try {
      var decodedToken = jwt.decode(authToken, secret);

      User.findOne({username: decodedToken.username}, function(err, user) {
         if (err) {
           return res.status(401).json({success : false, message : "Can't connect to DB."});         
         }
         else if(!user) {
           return res.status(401).json({success : false, message :  "invalid username in authtoken???"});         
         }
         else {
            bcrypt.compare(req.body.oldp, user.passwordHash, function(err, valid) {
               if (err) {
                  return res.status(401).json({success : false, message : "Error authenticating password. Contact support." + user.passwordHash});         
               }
               else if(valid) {
                  bcrypt.hash(req.body.newp, 10, function(err, hash) {
                     if (err) {
                        // res.status(400).json({success : false, message : err.errmsg});         
                        res.status(400).json({success : false, message : 'cannot hash new password'});         
                     }
                     else { 
                        User.updateOne({username: user.username}, {$set: {passwordHash: hash}}, function(err, user2) {
                           if (err) {
                              return res.status(400).json({success : false, message : 'could not update password'});
                           }
                           else {
                              return res.status(201).json({success:true});
                           }
                        });
                     }
                  });
               }
               else {
                  return res.status(401).json({success : false, flag: true, message : "Password is incorrect."});         
               }
            });
         }
       });
   } catch (e) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
});


//  Changing email
router.post('/newemail', function(req, res, next) {
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];

   try {
      var decodedToken = jwt.decode(authToken, secret);
      
      User.findOne({username: decodedToken.username}, function(err, user) {
         if (err) {
            return res.status(401).json({success : false, message : "Can't connect to DB."});         
         }
         else if(!user) {
            return res.status(401).json({success : false, message : 'invalid username stored in authToken???'});         
         }
         else {
            User.findOne({username: req.body.username}, function(err, user2) {
               if (err) {
                  return res.status(401).json({success : false, message : "Can't connect to DB."}); 
               }
               else if (!user2) {
                  User.updateOne({username: user.username}, {$set: {username: req.body.username}}, function(err, user3) {
                     if (err) {
                        return res.status(400).json({success : false, message : 'could not update password'});
                     }
                     else {
                        return res.status(201).json({success:true});
                     }
                  });
               }
               else {
                  return res.status(401).json({success : false, userExists: true, message : "Email already taken."});
               }
            });
         }
      });
   } catch (e) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }

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
            return res.status(400).json({success : false, message : err.message});         
          }
          else {
            var authToken = jwt.encode({username: req.body.username}, secret);
            return res.status(201).json({success : true, authToken: authToken, message : "Account with username " + user.username + "has been created."});                      
          }
        });
      }
   });   
});

router.get("/account" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];
   
   try {
      var decodedToken = jwt.decode(authToken, secret);
      var userStatus = {};
      
      User.findOne({username: decodedToken.username}, function(err, user) {
         if(err) {
            return res.status(400).json({success: false, message: "User does not exist."});
         }
         else {
            userStatus['success'] = true;
            userStatus['username'] = user.username;
            userStatus['lastAccess'] = user.lastAccess;
            userStatus['zipcode'] = user.zipcode;
            
            // Find devices based on decoded token
		      Device.find( {username: decodedToken.username}, function(err, devices) {
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
                  return res.status(200).json(userStatus);
			      }
			      else {
                  return res.status(400).json({success: false, message: 'User has no registered devices.'})
               }       
		      });
         }
      });
   }
   catch (ex) {
      console.log(ex); 
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
});

//Getting general 7-day summary
router.get("/data" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];
   
   try {
      var decodedToken = jwt.decode(authToken, secret);

      Device.find( {username: decodedToken.username}, function(err, devices) {
         if (!err) {
            // Construct device list
            var data = []; 
            var errors = [];
            for (device of devices) {
               // deviceList.push({ 
               //       deviceId: device.deviceId,
               //       apikey: device.apikey,
               // });
               HwData.find({ deviceId : device.deviceId }, function(err, allData) {
                  if (err) {
                     errors.push({deviceId: device.deviceId, message : err});
                  }
                  else {
                     let list = [];
                     for(let doc of allData) {
                        list.push({ deviceId : doc.deviceId, GPS_speed : doc.GPS_speed, lat : doc.lat, lon : doc.lon, uv : doc.uv, publishTime : doc.publishTime});
                     }
                     list.sort((a,b) => (a.publishTime < b.publishTime) ? 1 : -1); //sorts most recent first
                     data.push(list);
                  }
               });
            }
            if (errors != []) {
               return res.status(200).json({success: false, data: data, errors: errors});
            }
            else {
               return res.status(200).json({success: true, data: data});
            }
         }
         else {
            return res.status(400).json({success: false, message: 'User has no registered devices.'})
         }       
      });
   } catch (ex) { 
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
});

module.exports = router;