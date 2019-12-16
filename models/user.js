var db = require("../db");

var userSchema = new db.Schema({
  username:     { type: String, required: true, unique: true },
  passwordHash: String,
  zipcode:      Number,
  lastAccess:   { type: Date, default: Date.now }
  // deviceList:  [ String ] // We don't really need this i think
});

var User = db.model("User", userSchema);

module.exports = User;
