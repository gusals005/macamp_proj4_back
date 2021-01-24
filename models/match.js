const mongoose = require('mongoose')
var Schema = mongoose.Schema

var matchSchema = new Schema({
    match_date: Date,
    can_betting: { type: Boolean, required: true },
    home: { type: String, required: true },
    away: { type: String, required: true },
    home_score: Number,
    away_score: Number,
    home_season_stat: { type: String, required: true },
    away_season_stat: { type: String, required: true },
    win_odds: Number,
    lose_odds: Number,
    win_betting: [String],
    lose_betting: [String]
});

module.exports = mongoose.model("match", matchSchema);