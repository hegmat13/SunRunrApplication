var db = require("../db");

var userSchema = new db.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: String,
  lastAccess:   { type: Date, default: Date.now },  // TODO: Replace here down with correct information
  userDevices:  [ String ],
  potholesHit:  [ { potholeId: Number, numHits: Number } ]
});

var User = db.model("User", userSchema);

module.exports = User;
