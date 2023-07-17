const mongoose = require("mongoose");

const DBScheduleSchema = mongoose.Schema({
    MATCH_ID: {
        type: String,
        required: false,
    },
    HOME_ID: {
        type: String,
        required: false,
    },
    AWAY_ID: {
        type: String,
        required: false,
    },
    HOME_NAME: {
        type: String,
        required: false,
    },
    AWAY_NAME: {
        type: String,
        required: false,
    },
    TIME_STAMP: {
        type: Date,
        required: false,
    },
    MATCH_TIME: {
        type: String,
        required: false,
    },
    LEAGUE_ID: {
        type: String,
        required: false,
    },
    LEAGUE_NAME: {
        type: String,
        required: false,
    },
    LEAGUE_SHORT_NAME: {
        type: String,
        required: false,
    },
    STATUS: {
        type: String,
        required: false,
    },
    SCORE_HOME: {
        type: String,
        required: false,
    },
    SCORE_AWAY: {
        type: String,
        required: false,
    },
    H_T: {
        type: String,
        required: false,
    },
    F_T: {
        type: String,
        required: false,
    },
    C: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const DBSchedule = mongoose.model("DBSchedule", DBScheduleSchema);

module.exports = DBSchedule;