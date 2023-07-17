var sData = new Object();
var isResult = 0;
var isSem = 0;
var scorePolling;
var oddPolling;
var oldOddsXML = "";

async function MakeTable6in1() {
    var container = document.getElementById("6in1");
    var html = [];
    var groupHtml = [];
    var groupData = {};

    var dataSchedule = await fetchData();

    var groupData = {};


    dataSchedule.forEach((e, i) => {
        var leagueId = e.LEAGUE_ID;
        var score = '';
        if (e.STATUS == '0') {
            score = '-';
        } else {
            score = `${e.SCORE_HOME}-${e.SCORE_AWAY}`;
        }
        const time = new Date(e.TIME_STAMP).getTime();
        const timeStamp = new Date(e.TIME_STAMP);
        const day = timeStamp.getDate();
        const month = timeStamp.getMonth() + 1;
        const hours = timeStamp.getHours();
        const minutes = timeStamp.getMinutes();

        const formattedTime = `${day}-${month} ${hours}:${minutes}`;


        if (e.STATUS != '-1') {
            if (!groupData[leagueId]) {
                groupData[leagueId] = [];
                groupData[leagueId].push('<div class="c-league__header" data-open="true" data-l="' + e.LEAGUE_ID + '">');
                // groupData[leagueId].push('<td colspan="9" class="Leaguestitle"><div class="head-6in1 d-flex justify-content-between"><span class="l1"><a href="#" target="_blank">' + e.LEAGUE_NAME + '</a></span><div class="6in1-title d-sm-inline-flex" style="width: 60.2%;"><span class="text-center" style="width: 15%;">' + _locModel.T.T_1x2 + '</span><span class="text-center" style="width: 22%;">' + _locModel.T.T_Handicap + '</span><span class="text-center" style="width: 22%;">' + _locModel.T.T_OU + '</span><span class="text-center" style="width: 22%;">HT ' + _locModel.T.T_Handicap + '</span><span class="text-center" style="width: 22%;">HT ' + _locModel.T.T_OU + '</span></div></div></td>');
                groupData[leagueId].push('<div class="c-league__info"><a class="c-league__btn-favorite " style="cursor: default;">star</a><div class="c-league__name">' + e.LEAGUE_NAME + '</div></div>');
                groupData[leagueId].push('<div class="c-bettype-title" role="asiaview2022-visible"><div class="c-bettype-col c-has-goal" title="' + _locModel.T.T_Handicap + '"><span class="c-text">Cược Chấp Toàn Trận</span></div><div class="c-bettype-col c-has-goal" title="' + _locModel.T.T_OU + '"><span class="c-text">Tài Xỉu Toàn Trận</span></div><div class="c-bettype-col" title="' + _locModel.T.T_1x2 + '"><span class="c-text">1X2 Toàn Trận</span></div><div class="c-bettype-col c-has-goal" title="Toàn Trận Lẻ/Chẵn" data-bt="2"><span class="c-text">Chẵn Lẻ Toàn Trận</span></div><div class="c-bettype-col c-has-goal" title="h1 ' + _locModel.T.T_Handicap + '"><span class="c-text">Cược Chấp Hiệp 1</span></div><div class="c-bettype-col c-has-goal" title="h1 ' + _locModel.T.T_OU + '"><span class="c-text">Tài Xỉu Hiệp 1</span></div><div class="c-bettype-col" title="h1 ' + _locModel.T.T_1x2 + '"><span class="c-text">1X2 Hiệp 1</span></div></div>')
                groupData[leagueId].push('</div>');
                groupData[leagueId].push(html.join(""));
            }
            groupData[leagueId].push('<div class="c-match-group" odds="" class="odds-table-bg dataItem" leagueid="' + e.LEAGUE_ID + '" id="table_' + e.MATCH_ID + '" index="' + i + '">');
            groupData[leagueId].push('<div class="c-match">');

            groupData[leagueId].push('<div class="c-match__bets">');

            groupData[leagueId].push('<div class="c-match__timer"><div class="c-match-time">' + formattedTime + '</div><a class="c-btn c-btn--favorite" title="Yêu thích của tôi" style="cursor: default; pointer-events: none;"><i class="c-icon c-icon--favorite"></i></a></div>');

            groupData[leagueId].push('<div class="c-match__odds-group">');
            groupData[leagueId].push('<div class="c-match__odds" id="match_' + e.MATCH_ID + '" odds="">');
            groupData[leagueId].push('<div class="c-match__event"><div class="c-match__team"><div class="c-team" title="' + e.HOME_NAME + '"><div class="c-team__info"><span class="c-team-name">' + e.HOME_NAME + '</span></div></div></div><div class="c-match__team"><div class="c-team c-team--favor" title="' + e.AWAY_NAME + '"><div class="c-team__info"><span class="c-team-name">' + e.AWAY_NAME + '</span></div></div></div><div class="c-match__team"><div class="c-text">Hòa</div></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col c-has-goal" data-bt="1"><div class="c-odds-button" id="h_' + e.MATCH_ID + '"><span class="c-text-goal" id="goal_h' + e.MATCH_ID + '"  style="cursor: pointer;"></span><span class="c-odds c-odds--minus" id="upodds_' + e.MATCH_ID + '"  style="cursor: pointer;"></span></div><div class="c-odds-button" id="h_' + e.MATCH_ID + '"><span class="c-text-goal" id="goal_a' + e.MATCH_ID + '"></span><span class="c-odds" id="downodds_' + e.MATCH_ID + '" style="cursor: pointer;"></span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col c-has-goal" data-bt="2"><div class="c-odds-button" id="a_' + e.MATCH_ID + '"><span class="c-text-goal" id="goal_t1_' + e.MATCH_ID + '"  style="cursor: pointer;"></span><span class="c-odds c-odds--minus" id="upodds_t_' + e.MATCH_ID + '"  style="cursor: pointer;"></span></div><div class="c-odds-button" id="a_' + e.MATCH_ID + '""  ><span class="c-text-goal">U</span><span class="c-odds" id="downodds_t_' + e.MATCH_ID + '" style="cursor: pointer;"></span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col" data-bt="3"><div class="c-odds-button" ><span class="c-odds" id="homewin_' + e.MATCH_ID + '" style="cursor: pointer;">3.45</span></div><div class="c-odds-button" ><span class="c-odds" id="guestwin_' + e.MATCH_ID + '"  style="cursor: pointer;">1.81</span></div><div class="c-odds-button"   ><span class="c-odds" id="Standoff_' + e.MATCH_ID + '" style="cursor: pointer;">3.45</span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col c-has-goal" data-bt="4"><div class="c-odds-button" id="576474532h"><span class="c-text">o</span><span class="c-odds" data-moid="70290697__576474532" style="cursor: pointer;">0.96</span></div><div class="c-odds-button" id="576474532a"  ><span class="c-text">e</span><span class="c-odds" data-moid="70290697__576474532" style="cursor: pointer;">0.92</span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col c-has-goal" data-bt="5"><div class="c-odds-button" id="576474524h"><span class="c-odds" data-moid="70290697__576474524" style="cursor: pointer;">0.71</span></div><div class="c-odds-button" id="576474524a"  ><span class="c-text-goal">0/0.5</span><span class="c-odds c-odds--minus" data-moid="70290697__576474524" style="cursor: pointer;">-0.99</span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col c-has-goal" data-bt="6"><div class="c-odds-button" id="576474522h"><span class="c-text-goal">1.0</span><span class="c-odds" data-moid="70290697__576474522" style="cursor: pointer;">0.63</span></div><div class="c-odds-button" id="576474522a"  ><span class="c-text">u</span><span class="c-odds c-odds--minus" data-moid="70290697__576474522" style="cursor: pointer;">-0.91</span></div></div>');
            groupData[leagueId].push('<div class="c-bettype-col" data-bt="7"><div class="c-odds-button" id="5764745101"  ><span class="c-odds" data-moid="70290697__576474510" style="cursor: pointer;">3.85</span></div><div class="c-odds-button" id="5764745102"  ><span class="c-odds" data-moid="70290697__576474510" style="cursor: pointer;">2.44</span></div><div class="c-odds-button" id="576474510x"  ><span class="c-odds" data-moid="70290697__576474510" style="cursor: pointer;">2.17</span></div></div>');
            groupData[leagueId].push('</div>');
            groupData[leagueId].push('</div>');

            groupData[leagueId].push('</div>');

            groupData[leagueId].push('</div>')
            groupData[leagueId].push('</div>');
        }

    });
    for (var groupId in groupData) {
        if (groupData.hasOwnProperty(groupId)) {
            var groupHtml = groupData[groupId].join("");
            // Thêm các dòng mã HTML của nhóm vào mã HTML chính
            html.push(groupHtml);
        }
    }

    var finalHtml = html.join("");

    var container = document.getElementById("6in1");
    if (container) {
        container.innerHTML = finalHtml;
    }

    // document.getElementById("6in1").innerHTML = html.join("");
}

MakeTable6in1();

function fetchData() {
    return new Promise(function(resolve, reject) {
        var sbOddsDetailHttp = new XMLHttpRequest();
        sbOddsDetailHttp.open("GET", "/ajax/soccerajax?type=1", true);
        sbOddsDetailHttp.send(null);
        sbOddsDetailHttp.onreadystatechange = function() {
            if (sbOddsDetailHttp.readyState === 4) {
                if (sbOddsDetailHttp.status === 200) {
                    var data = sbOddsDetailHttp.responseText;
                    if (data == "") {
                        reject("No data received");
                    } else {
                        var jsonData = JSON.parse(data);
                        var html = jsonData.data;
                        resolve(html);
                    }
                } else {
                    reject("Request failed with status: " + sbOddsDetailHttp.status);
                }
            }
        };
    });
}

function bf_refresh(data, type) {
    var length = 0;
    if (type == 0) {
        length = data.length;
    } else {
        length = data.length;
    }

    for (var i = 0; i < length; i++) {
        if (type == 0) {
            D = data[i];
        } else {
            D = data[i];
        }
        odds = D;

        var tr = document.getElementById("match_" + D.MATCH_ID);
        var objOdds = document.getElementById("match_" + D.MATCH_ID);

        if (tr === null) continue;
        tr = tr.ownerDocument;
        try {
            const oddsValue = (objOdds.attributes["odds"].value);
            var upoddsElement = tr.getElementById("upodds_" + D.MATCH_ID);
            var goal_hElement = tr.getElementById("goal_h" + D.MATCH_ID);
            var goal_aElement = tr.getElementById("goal_a" + D.MATCH_ID);
            var downoddsElement = tr.getElementById("downodds_" + D.MATCH_ID);
            var downoddsElement2 = tr.getElementById("downodds_t_" + D.MATCH_ID);
            var upodds_tElement = tr.getElementById("upodds_t_" + D.MATCH_ID);
            var goal_t1Element = tr.getElementById("goal_t1_" + D.MATCH_ID);
            var homewinElement = tr.getElementById("homewin_" + D.MATCH_ID);
            var StandoffElement = tr.getElementById("Standoff_" + D.MATCH_ID);
            var guestwinElement = tr.getElementById("guestwin_" + D.MATCH_ID);

            if (oddsValue && oddsValue.trim() !== "") {
                old = JSON.parse(oddsValue);

                updateElement(D.HomeHandicap, old.HomeHandicap, "upodds_", upoddsElement);
                updateElement(D.Handicap, old.Handicap, "goal_h", goal_hElement);
                updateElement(D.Handicap, old.Handicap, "goal_a", goal_aElement);
                updateElement(D.AwayHandicap, old.AwayHandicap, "downodds_", downoddsElement);
                updateElement(D.HW, old.HW, "upodds_t_", upodds_tElement);
                updateElement(D.D, old.D, "goal_t1_", goal_t1Element);
                updateElement(D.AW, old.AW, "downodds_t_", downoddsElement2);
                updateElement(D.Over, old.Over, "homewin_", homewinElement);
                updateElement(D.Goals, old.Goals, "Standoff_", StandoffElement);
                updateElement(D.Under, old.Under, "guestwin_", guestwinElement);
            }

            function updateElement(newValue, oldValue, elementPrefix, element) {
                // if (newValue.trim() === '') {
                //     const elClss = document.querySelector('.c-bettype-col.c-has-goal[data-bt="1"]');
                //     elClss.style.display = "none";
                //     return;
                // }

                if (parseFloat(oldValue) !== parseFloat(newValue)) {
                    if (parseFloat(oldValue) > parseFloat(newValue)) {
                        newValue = '<span class="down">' + newValue + '</span>';
                        element.classList.remove("up");
                        element.classList.add("down");
                    } else if (parseFloat(oldValue) < parseFloat(newValue)) {
                        newValue = '<span class="up">' + newValue + '</span>';
                        element.classList.remove("down");
                        element.classList.add("up");
                    }
                }

                element.innerHTML = newValue;
                element.classList.remove("down");
                element.classList.remove("up");
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }

        // var cellContents = ["", "", ""];
        // var oddsTpyes = _oddsOrder.split('-');

        // let AhOH = "-";
        // let AhOM = "-";
        // let AhOW = "-";
        // let EuOH = "-";
        // let EuOM = "-";
        // let EuOW = "-";

        // AhOH = D.HomeHandicap || "-";
        // AhOM = D.Handicap || "-";
        // AhOW = D.AwayHandicap || "-";
        // EuOH = D.HW || "-";
        // EuOM = D.D || "-";
        // EuOW = D.AW || "-";

        // oddsTpyes.forEach(function(a) {
        //     if (a == 1) {
        //         // HDP
        //         if ((_oddsShow & 1) == 1) {
        //             // cellContents[0] += "<p class=odds1>" + ((D[14] == "0" || isResult) ? FilterEmpty(D[3]) : "&nbsp;") + "</p>";
        //             cellContents[0] += "<p class=odds1>" + FilterEmpty(AhOH) + "</p>";
        //             cellContents[1] += "<p class=odds2>" + FilterEmpty(AhOM) + "</p>";
        //             cellContents[2] += "<p class=odds3>" + FilterEmpty(AhOW) + "</p>";
        //         }
        //     } else if (a == 2) {
        //         if ((_oddsShow & 2) == 2) {
        //             cellContents[0] += "<p class=odds4>" + FilterEmpty(EuOH) + "</p>";
        //             cellContents[1] += "<p class=odds5>" + FilterEmpty(EuOM) + "</p>";
        //             cellContents[2] += "<p class=odds6>" + FilterEmpty(EuOW) + "</p>";
        //         }
        //     } else if (a == 3) {
        //         // if ((_oddsShow & 8) == 8) {
        //         //     cellContents[0] += `<p class=odds2>${AhOH}</p>`;
        //         //     cellContents[1] += `<p class=odds2>${AhOH}</p>`;
        //         //     cellContents[2] += `<p class=odds2>${AhOH}</p>`;
        //         // }
        //     }
        // });

        // tr.cells[9].innerHTML = cellContents[0];
        // tr.cells[10].innerHTML = cellContents[1];
        // tr.cells[11].innerHTML = cellContents[2];

        objOdds.attributes["odds"].value = JSON.stringify(data[i]);
    }



}

async function openWebsocket() {
    var channels = ["change_xml", "ch_goal" + 8 + "_xml"];
    try {
        wsUtil.connectWs(channels, async function(data) {
            try {
                const results = JSON.parse(event.data);
                bf_refresh(results, 1);
            } catch (error) {
                console.error("Error:", error);
            }
        }, function() {
            // if (scorePolling) window.clearTimeout(scorePolling);
            // if (oddPolling) window.clearTimeout(oddPolling);
            // if (!isResult && !isSem) scorePolling = window.setTimeout("getxml()", 2000);
            // if (!isResult && !isSem) oddPolling = window.setTimeout("getoddsxml()", 60000);
        }, function() {
            // if (scorePolling) window.clearTimeout(scorePolling);
            // if (oddPolling) window.clearTimeout(oddPolling);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}


if (_websocket && !isResult && !isSem) {
    openWebsocket();
}

// html.push('<table width="100%" border="0" align="center" cellpadding="2" cellspacing="1" class="odds-table-bg">');
// html.push('<tbody>');
// html.push('<tr class="oodstable-t" align="center">');
// html.push('<td width="3%"></td>');
// html.push('<td width="5%">' + _locModel.T.T_Time + '</td>');
// html.push('<td width="23%" class="sl">' + _locModel.T.T_Teams + '</td>');
// html.push('<td width="7%">' + _locModel.T.T_Handicap + '</td>')
// html.push('<td width="14%">' + _locModel.T.T_OU + '</td>')
// html.push('<td width="14%">' + _locModel.T.T_1x2 + '</td>');
// html.push('<td width="14%">HT ' + _locModel.T.T_Handicap + '</td>');
// html.push('<td width="14%">HT ' + _locModel.T.T_OU + '</td>')
// html.push('</tr>');
// html.push('</tbody>');
// html.push("</table>");