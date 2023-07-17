const express = require("express");
const asyncHandler = require("express-async-handler");
const { crawlOdds } = require("../crawler/oddsCrawl");
const { getOdds } = require("../controllers/oddsController");
const {
    getSchedule,
    findMatchId,
    getByTime,
} = require("../controllers/scheduleController");
const router = express.Router();

router.get(
    "/",
    asyncHandler(async(req, res) => {
        const begin = Date.now();
        const end = new Date(
            new Date().toISOString().slice(0, 10) + " 23:59:59"
        ).getTime();

        try {
            const schedules = await getByTime(begin, end);
            // for (const matchId of schedules) {
            //     console.log("MATCH_ID:", matchId["MATCH_ID"]);
            // }
            res.status(200).json(schedules);
        } catch (error) {
            console.error("Error retrieving schedules by time:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    })
);

module.exports = router;