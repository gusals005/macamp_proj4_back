const mongoose = require('mongoose');
const Betting = require('./betting');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    principal: {type:Number, required:true},
    coin: { type: Number, required: true },
    betting: [Betting.schema],
    signUpDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("user", userSchema);