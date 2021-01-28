const mongoose = require('mongoose')
var Schema = mongoose.Schema

var bettingSchema = new Schema({
    match_id: { type: String, required: true },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    prediction: {type:String, required:true},    // "WIN" or "LOSE"
    betting_date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("betting", bettingSchema);