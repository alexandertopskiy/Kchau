var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: String,
    id: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
