const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.route("/").get(
    asyncHandler(async(req, res) => {
        res.render("home");
    })
);

module.exports = router;