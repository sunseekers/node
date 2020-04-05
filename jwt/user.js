let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let {
  dbUrl
} = require('../config');
let conn = mongoose.createConnection(dbUrl);
let UserSchema = new Schema({
  username: String,
  password: String
});
module.exports = conn.model("User", UserSchema);