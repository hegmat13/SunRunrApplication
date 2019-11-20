var db = require("../db");

// Define the schema
var hwDataSchema = new db.Schema({
    apikey:     Number,
    deviceId:   String,
    GPS_speed:  String,
    lat:        Number,
    lon:        Number,
    uv:         Number,
    publishTime: { type: Date, default: Date.now }
});

// Creates a Devices (plural) collection in the db using the device schema
var HwData = db.model("HwData", hwDataSchema);

module.exports = HwData;

