var db = require("../db");

// Define the schema
var hwDataSchema = new db.Schema({
    apikey:     String,
    deviceId:   String,
    GPS_speed:  String,
    lat:        String,
    lon:        String,
    uv:         String,
    publishTime: String
});

// Creates a Devices (plural) collection in the db using the device schema
var HwData = db.model("HwData", hwDataSchema);

module.exports = HwData;

