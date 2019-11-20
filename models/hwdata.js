var db = require("../db");

// Define the schema
var hwDataSchema = new db.Schema({
    apikey:     Number,
    deviceId:   String,
<<<<<<< HEAD
    //userEmail:  String,
    lat:   Number,
    lon:  Number,
    uv:         Number
    //submitTime: { type: Date, default: Date.now }
=======
    GPS_speed:  String,
    lat:        Number,
    lon:        Number,
    uv:         Number,
    publishTime: { type: Date, default: Date.now }
>>>>>>> 9c864e29e2995118c08b2553785df24c11cfd696
});

// Creates a Devices (plural) collection in the db using the device schema
var HwData = db.model("HwData", hwDataSchema);

module.exports = HwData;

