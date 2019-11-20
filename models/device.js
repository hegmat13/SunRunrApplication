var db = require("../db");

var deviceSchema = new db.Schema({
    deviceId:     String,
    username:     String
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;
