const express = require("express");
const { engine } = require("express-handlebars");
const { errorHandler } = require("./middleware/errorHandler");
const moment = require('moment-timezone');
const connectDb = require("./configs/dbConnection");
const fs = require('fs');
const xml2js = require('xml2js');
const { crawlSchedule, updateStatusSchedule } = require("./crawler/scheduleCrawl");
const dotenv = require("dotenv").config();
const WebSocket = require("ws");
const { crawlOdds } = require("./crawler/oddsCrawl");
const { getByTime } = require("./controllers/scheduleController");
const path = require("path");


connectDb();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "src/public")));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());

const { v4: uuidv4 } = require("uuid");
const { crawlGfOdds } = require("./crawler/gfdataoddsCrawl");

app.get("/ajax/getwebsockettoken", (req, res) => {
    const token = uuidv4();
    res.send(token);
});

app.use("/ajax", require("./routes/api/oddsApiRouter"));
app.use("/schedule", require("./routes/scheduleRouter"));
app.use("/6in1", require("./routes/6in1"));
app.use("/odds", require("./routes/oddsRouter"));


async function updateSchedule() {
    moment.tz.setDefault('UTC');

    const currentDate = moment().toDate();
    currentDate.setDate(currentDate.getDate());
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');

    try {
        const scheduleData = await crawlSchedule(formattedDate);
        console.log("Schedule updated:", scheduleData);

        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(JSON.stringify(scheduleData));
        //     }
        // });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateStatusMatch() {
    moment.tz.setDefault('UTC');

    const currentDate = moment().toDate();
    currentDate.setDate(currentDate.getDate());
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');

    try {
        const scheduleData = await updateStatusSchedule(formattedDate);
        console.log("Update Status Match updated:", scheduleData);

        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(JSON.stringify(scheduleData));
        //     }
        // });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateOdds() {
    moment.tz.setDefault('UTC');

    // const today = moment().toDate();
    // const begin = moment(today).subtract(12, 'hours').toDate();
    // const end = moment(today).add(7, 'days').toDate();

    const today = moment().startOf('day'); // Bắt đầu của ngày hiện tại
    const endOfDay = moment().endOf('day'); // Kết thúc của ngày hiện tại

    const begin = today.toDate();
    const end = endOfDay.toDate();

    try {
        const schedules = await getByTime(begin.getTime(), end.getTime(), ['MATCH_ID']);

        for (const matchId of schedules) {
            try {
                const matchOdds = await crawlOdds(matchId['MATCH_ID']);
                // wss.clients.forEach((client) => {
                //     if (client.readyState === WebSocket.OPEN) {
                //         client.send(JSON.stringify(matchOdds));
                //     }
                // });
            } catch (error) {
                console.error('Error in crawlOdds:', error);
            }
        }
    } catch (error) {
        console.error('Error in getByTime:', error);
    }
}

// async function updateOddsRT() {
//     moment.tz.setDefault('UTC');

//     const today = moment().startOf('day'); // Bắt đầu của ngày hiện tại
//     const endOfDay = moment().endOf('day'); // Kết thúc của ngày hiện tại

//     const begin = today.toDate();
//     const end = endOfDay.toDate();

//     try {
//         const schedules = await getByTime(begin.getTime(), end.getTime(), ['MATCH_ID', 'STATUS']);
//         for (const matchId of schedules) {
//             if (matchId.STATUS == '1' || matchId.STATUS == '2' || matchId.STATUS == '3' || matchId.STATUS == '4' || matchId.STATUS == '5') {
//                 try {
//                     const matchOdds = await crawlOdds(matchId.MATCH_ID);
//                     wss.clients.forEach((client) => {
//                         if (client.readyState === WebSocket.OPEN) {
//                             client.send(JSON.stringify(matchOdds));
//                         }
//                     });
//                 } catch (error) {
//                     console.error('Error in crawlOdds:', error);
//                     // Thực hiện các xử lý lỗi khác tại đây (ví dụ: ghi log, thông báo lỗi, vv.)
//                 }
//             } else {
//                 // Xử lý khi trạng thái không phù hợp
//             }
//         }
//     } catch (error) {
//         console.error('Error in getByTime:', error);
//     }
// }




async function realtimeOdds() {
    try {
        const results = await crawlGfOdds();
        try {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(results));
                }
            });
        } catch (error) {
            console.error('Error in crawlOdds:', error);
        }
    } catch (error) {
        console.error('Error in getByTime:', error);
    }
}


app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", async(ws) => {
    setInterval(realtimeOdds, 5000);
});

function updateScheduleOnNewDay() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();

    if (currentHour === 0 && currentMinute === 5 && currentSecond === 0) {
        updateSchedule();
    }
}
// updateSchedule();
setInterval(updateScheduleOnNewDay, 1000);
// setInterval(updateOddsRT, 5000);
setInterval(updateOdds, 60000);
setInterval(updateStatusMatch, 60000);