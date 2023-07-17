const mongoose = require("mongoose");

const DBOddsSchema = mongoose.Schema({
    MATCH_ID: {
        type: String,
        required: false,
    },
    ODDS_ID: {
        type: String,
        required: false,
    },
    ODDS_AH: {
        type: String,
        required: false,
    },
    ODDS_EURO: {
        type: String,
        required: false,
    },
    ODDS_OU: {
        type: String,
        required: false,
    },
    ODDS_AHRUN: {
        type: String,
        required: false,
    },
    ODDS_EURORUN: {
        type: String,
        required: false,
    },
    ODDS_OURUN: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const DBOdds = mongoose.model("DBOdds", DBOddsSchema);

module.exports = DBOdds;