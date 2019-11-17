var db = require("../db");

var userSchema = new db.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: String,
  zipcode:      Number,
  lastAccess:   { type: Date, default: Date.now },  // TODO: Replace here down with correct information
  userDevices:  [ String ]
});

var User = db.model("User", userSchema);

module.exports = User;
