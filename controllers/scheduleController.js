const asyncHandler = require("express-async-handler");
const Schedule = require("../models/scheduleModel");

// @desc GET all schedules
// @route GET /api/schedules
// @access public
const getSchedule = asyncHandler(async(req, res) => {
    const schedules = await Schedule.find();
    // res.status(200).json(schedules);
    return schedules;
});

// @desc POST a new schedule
// @route POST /api/schedules
// @access public
const updateSchedule = async(scheduleData) => {
    const {
        MATCH_ID,
        HOME_ID,
        AWAY_ID,
        HOME_NAME,
        AWAY_NAME,
        SCORE_HOME,
        SCORE_AWAY,
        TIME_STAMP,
        MATCH_TIME,
        LEAGUE_ID,
        LEAGUE_NAME,
        LEAGUE_SHORT_NAME,
        STATUS,
        H_T,
        F_T,
        C,
    } = scheduleData;

    const updatedSchedule = await Schedule.findOneAndUpdate({ MATCH_ID }, {
        MATCH_ID,
        HOME_ID,
        AWAY_ID,
        HOME_NAME,
        AWAY_NAME,
        SCORE_HOME,
        SCORE_AWAY,
        TIME_STAMP,
        MATCH_TIME,
        LEAGUE_ID,
        LEAGUE_NAME,
        LEAGUE_SHORT_NAME,
        STATUS,
        H_T,
        F_T,
        C,
    }, { upsert: true, new: true }).lean();

    return updatedSchedule;
};

// @desc Get all MATCH_IDs from the schedule
// @returns array - an array of MATCH_IDs
const findMatchId = async() => {
    try {
        const matchIds = await Schedule.find().distinct("MATCH_ID");
        return matchIds;
    } catch (error) {
        console.error("Error finding MATCH_IDs:", error);
        throw error;
    }
};

const getByTime = async(begin, end, arSelect = []) => {
    try {
        let selectFields = arSelect.length > 0 ? arSelect.join(" ") : "";

        const schedules = await Schedule.find({
            TIME_STAMP: {
                $gte: begin,
                $lte: end,
            },
        }).select(selectFields).lean(); // Sử dụng lean() để trả về kết quả dạng plain JavaScript object

        return schedules;
    } catch (error) {
        console.error("Error retrieving schedules by time:", error);
        throw error;
    }
};;

module.exports = { updateSchedule, getSchedule, findMatchId, getByTime };