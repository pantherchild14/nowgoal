const express = require("express");
const asyncHandler = require("express-async-handler");
const moment = require("moment-timezone");
const { getByTime } = require("../../controllers/scheduleController");
const { getOdds } = require("../../controllers/oddsController");
const router = express.Router();

moment.tz.setDefault("UTC");

router.get(
    "/soccerajax",
    asyncHandler(async(req, res) => {
        const { type } = req.query;

        // const today = moment().startOf("day").toDate();
        // const begin = moment(today).subtract(7, "hours").toDate();
        // const end = moment(today).endOf("day").add(7, "hours").toDate();
        const today = moment().toDate();
        const begin = moment(today).startOf("day").toDate();
        const end = moment(today).endOf("day").add(7, "hours").toDate();

        try {
            if (type === "1") {
                const schedules = await getByTime(begin.getTime(), end.getTime());
                res.status(200).json({
                    code: 0,
                    message: "success",
                    data: schedules,
                });
            } else if (type === "2") {
                const odds = await getOdds();
                res.status(200).json({
                    code: 0,
                    message: "success",
                    data: odds,
                });
            } else {
                res.status(500).json({
                    code: -1,
                    message: "error",
                    data: null,
                });
            }
        } catch (error) {
            // Xử lý lỗi tại đây
        }
    })
);

module.exports = router;