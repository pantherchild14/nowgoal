const asyncHandler = require("express-async-handler");
const { curl } = require("../crawler/crawl");
const { updateOdds } = require("../controllers/oddsController");
const dotenv = require("dotenv").config();

/*
 * crawl odds
 */

const crawlOdds = asyncHandler(async(matchid) => {
    const currentTime = Date.now();
    const DOMAIN = process.env.DOMAIN;

    // Type 1
    const run = 1;
    const replacedUrl = urlOddsComp(DOMAIN, run, matchid, currentTime);

    // Type 11
    const runT11 = 11;
    const replacedUrlT11 = urlOddsComp(DOMAIN, runT11, matchid, currentTime);

    try {
        // Type 1
        const data = await curl(replacedUrl);

        // Type 11
        const dataT11 = await curl(replacedUrlT11);

        if (data["ErrCode"] !== 0 || dataT11["ErrCode"] !== 0) {
            return;
        }

        // Type 1
        const mixodds = data["Data"]["mixodds"];
        const arrBet365 = mixodds.find((item) => item.cid === Number(process.env.BET_ID));
        const arrRes = oddsComp(matchid, arrBet365);

        // Type 11
        const roddsList = dataT11["Data"]["roddsList"];
        const arrBet365T11 = roddsList.find((item) => item.cid === Number(process.env.BET_ID));
        const arrResT11 = oddsCompType11(matchid, arrBet365T11);

        if (arrResT11 && arrResT11.MATCH_ID === arrRes.MATCH_ID) {
            Object.assign(arrRes, {
                ODDS_AHRUN: arrResT11.ODDS_AHRUN,
                ODDS_EURORUN: arrResT11.ODDS_EURORUN,
                ODDS_OURUN: arrResT11.ODDS_OURUN,
                ...arrResT11,
            });
        }

        await updateOdds(arrRes);
    } catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});

const oddsComp = (matchid, str) => {
    const odd_id = str["cid"];
    const oddAh = JSON.stringify(str["ah"]);
    const oddEuro = JSON.stringify(str["euro"]);
    const oddOu = JSON.stringify(str["ou"]);

    const oddsData = {
        MATCH_ID: matchid,
        ODDS_ID: odd_id,
        ODDS_AH: oddAh,
        ODDS_EURO: oddEuro,
        ODDS_OU: oddOu,
    };

    return oddsData;
};

const oddsCompType11 = (matchid, str) => {
    const oddAh = JSON.stringify(str["ah"]);
    const oddEuro = JSON.stringify(str["euro"]);
    const oddOu = JSON.stringify(str["ou"]);

    const oddsData = {
        MATCH_ID: matchid,
        ODDS_AHRUN: oddAh,
        ODDS_EURORUN: oddEuro,
        ODDS_OURUN: oddOu,
    };

    return oddsData;
};

function urlOddsComp(domain, run, matchid, currentTime) {
    const url =
        `${domain}ajax/soccerajax?type=14&t=${run}&id=${matchid}&h=0&flesh=${currentTime}`;

    return url;
}

module.exports = { crawlOdds };