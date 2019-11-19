var db = require("../db");

// Define the schema
var hwDataSchema = new db.Schema({
    apikey:     Number,
    deviceId:   String,
    //userEmail:  String,
    lat:   Number,
    lon:  Number,
    uv:         Number
    //submitTime: { type: Date, default: Date.now }
});

// Creates a Devices (plural) collection in the db using the device schema
var HwData = db.model("HwData", hwDataSchema);

module.exports = HwData;

