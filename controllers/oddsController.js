const asyncHandler = require("express-async-handler");
const Odds = require("../models/oddsModel");

// @desc GET all odds
// @route GET /api/odds
// @access public
const getOdds = asyncHandler(async(req, res) => {
    const odds = await Odds.find().lean();
    return odds;
});

// @desc POST a new Odds
// @route POST /api/Odds
// @access public
const updateOdds = async(oddsData) => {
    const {
        MATCH_ID,
        ODDS_ID,
        ODDS_AH,
        ODDS_EURO,
        ODDS_OU,
        ODDS_AHRUN,
        ODDS_EURORUN,
        ODDS_OURUN,
    } = oddsData;

    const updatedOdds = await Odds.findOneAndUpdate({ MATCH_ID }, {
        ODDS_ID,
        ODDS_AH,
        ODDS_EURO,
        ODDS_OU,
        ODDS_AHRUN,
        ODDS_EURORUN,
        ODDS_OURUN,
    }, { upsert: true, new: true }).lean();

    return updatedOdds;
};


module.exports = { getOdds, updateOdds };