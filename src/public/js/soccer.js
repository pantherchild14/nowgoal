var sData = new Object();
var _oddsShow = getDefaultOddsShow();
var hsLetGoal = new Hashtable();
var hsBigSmallGoal = new Hashtable();
var oddsHttp_ch = zXmlHttp.createRequest();
var sbOddsDetailHttp = zXmlHttp.createRequest();
var oddsHttp = zXmlHttp.createRequest();
var showLiveTv = true;
var needClearHashTable = true;
var loadSbDetailTime = new Date();
var isResult = 0;
var isSem = 0;
var scorePolling;
var oddPolling;
var oldOddsXML = "";

//tạo Table cho Home

var hasInit = 0;

function ShowBf() {
    try {
        MakeTable();

        if (hasInit == 0 && !isResult && !isSem) {
            if (!_websocket) oddPolling = window.setTimeout("getoddsxml()", 3000);
            hasInit = 1;
        }
        hasInit = 1;
    } catch (e) {
        console.log(e);
    }
}


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

// function fetchOddsData() {
//     return new Promise(function(resolve, reject) {
//         var sbOddsDetailHttp = new XMLHttpRequest();
//         sbOddsDetailHttp.open("GET", "/ajax/soccerajax?type=2", true);
//         sbOddsDetailHttp.send(null);
//         sbOddsDetailHttp.onreadystatechange = function() {
//             if (sbOddsDetailHttp.readyState === 4) {
//                 if (sbOddsDetailHttp.status === 200) {
//                     var data = sbOddsDetailHttp.responseText;
//                     if (data == "") {
//                         reject("No data received");
//                     } else {
//                         var jsonData = JSON.parse(data);
//                         var html = jsonData.data;
//                         resolve(html);
//                     }
//                 } else {
//                     reject("Request failed with status: " + sbOddsDetailHttp.status);
//                 }
//             }
//         };
//     });
// }

function showOddsChange(index, event) {
    // console.log("showOddsChange called with index:", index);
    // console.log("Event:", event);
}

async function MakeTable() {
    var league = "";
    var line = 0;
    var html = [];
    var groupHtml = [];
    var groupIndex = 0;
    var groupData = {};

    html.push("<table id='table_live' width='100%' align='center' cellspacing='0' border='0' cellpadding='0'>");
    html.push("<tr id='tr_0' class='scoretitle'>");
    html.push("<td width='3%'><span class='allno' onclick='ClearMyGames()'></span></td><td width='10%' colspan='2'>" + _locModel.T.T_Time + "</td><td width='20%' align='right'>" + _locModel.T.T_Home + "</td><td id='ScoreTh' align='center' width='10%'>" + _locModel.T.T_Score + "</td><td width='20%' align='left'>" + _locModel.T.T_Away + "</td><td style='width:7%' id='HtTh' class='c_ht'>" + _locModel.T.T_TH_CHT + "</td><td class='data_td' width='14%'>" + _locModel.T.T_Data + "</td><td id='oddsHead' width='16%' colspan='3' class='oddsHead'>Odds</td>");
    html.push("</tr>");

    var dataLidx = 1;
    var sclassID = 0;
    var showMt = false,
        showTime = false;
    if (!showLiveTv) {
        showMt = true, showTime = true;
    }
    var dataSchedule = await fetchData();
    var processedMatchIds = [];

    for (var i = 0; i < dataSchedule.length; i++) {
        try {
            if (dataSchedule[i] && dataSchedule[i].MATCH_ID) {
                var matchId = dataSchedule[i].MATCH_ID;
                var score = '';
                if (dataSchedule[i].STATUS == '0') {
                    score = '-';
                } else {
                    score = `${dataSchedule[i].SCORE_HOME}-${dataSchedule[i].SCORE_AWAY}`;
                }

                if (processedMatchIds.includes(matchId)) {
                    continue;
                }

                processedMatchIds.push(matchId);

                var leagueId = dataSchedule[i].LEAGUE_ID;
                var leagueName = dataSchedule[i].LEAGUE_NAME;

                if (!groupData[leagueId]) {
                    groupData[leagueId] = {
                        index: groupIndex,
                        html: []
                    };
                    groupIndex++;
                }
                var group = groupData[leagueId];

                if (league !== leagueName) {
                    league = leagueName;
                    group.html.push(`<tr class='Leaguestitle fbHead' id='tr_${group.index}' leaIndex='${group.index}' data-lidx='${dataLidx}' sclassID='${sclassID}' isLeaTop='0'>`);
                    group.html.push("<td><div class='add-div'><span class='add-info-l l0'><img id='favLeague_" + group.index + "' src='https://www.nowgoal7.com/images/star_off.png' style='cursor:pointer;'/></span></div></td>");
                    group.html.push(`<td colspan='10' style='line-height:28px'><div class='l1'>${leagueName}<a>${leagueName}</a></div>`);
                    group.html.push("</td></tr>");
                    line++;
                    sclassID++;
                }

                var rowClass = "tds";
                var rowBackground = "";
                if (dataSchedule[i].STATUS == '1' || dataSchedule[i].STATUS == '2' || dataSchedule[i].STATUS == '3' || dataSchedule[i].STATUS == '4' || dataSchedule[i].STATUS == '5') {
                    rowClass += " status1";
                    // rowBackground = "background-color: yellow;"; 
                } else if (dataSchedule[i].STATUS == '-1' || dataSchedule[i].STATUS == '-10' || dataSchedule[i].STATUS == '-11' || dataSchedule[i].STATUS == '-13' || dataSchedule[i].STATUS == '-14') {
                    rowClass += " d-none";
                }

                group.html.push("<tr id='tr1_" + matchId + "' class='" + rowClass + "' index='" + i + "' odds='' leaIndex='" + leagueId + "' style='" + rowBackground + "'>");
                group.html.push("<td height='30'><div class='add-div'><span class='add-info l0'><img id='mygame_" + matchId + "' class='mygame_" + matchId + "' src='https://www.nowgoal7.com/images/star_off.png' onclick='MyMatch(" + i + ");' style='cursor:pointer;'/></span></div></td>");
                group.html.push("<td width='0' style='display:none;'></td>");
                group.html.push("<td name='timeData' data-t='" + dataSchedule[i].TIME_STAMP + "' data-tf='4' class='time handpoint' id='mt_" + matchId + "' width='70'>" + dataSchedule[i].MATCH_TIME + "</td>");
                group.html.push("<td id='tvLink_" + matchId + "' class='tvLinkBtn' width='30'>&nbsp</td>");
                group.html.push("<td id='ht_" + matchId + "' style='text-align:right;position: relative;'><span id=horder_" + matchId + "><a id='team1_" + matchId + "'>" + dataSchedule[i].HOME_NAME + "</a></td>");
                group.html.push(`<td align='center'><b>${score}</b></td>`);
                group.html.push("<td id='gt_" + matchId + "' class='conner_span'><a id='team2_" + matchId + "' >" + dataSchedule[i].AWAY_NAME + "</a></td>");
                if (dataSchedule[i].H_T === '0-0' && dataSchedule[i].C === '0-0') {
                    group.html.push("<td><span id='cr_" + matchId + "' style='display:block;' class='conner_span'>-</span><span id='hht_" + matchId + "' style='display:block;'>-</span></td>");
                } else {
                    group.html.push("<td><span id='cr_" + matchId + "' style='display:block;' class='conner_span'>" + dataSchedule[i].C + "</span><span id='hht_" + matchId + "' style='display:block;'>" + dataSchedule[i].H_T + "</span></td>");
                }
                group.html.push("<td id='tvLink_" + matchId + "' class='tvLinkBtn' width='30'>&nbsp</td>");
                group.html.push("<td class=oddstd onmouseenter='showOddsChange(" + i + ",event)' onmouseleave='hideOddsDetail()'></td>");
                group.html.push("<td class=oddstd onmouseenter='showOddsChange(" + i + ",event)' onmouseleave='hideOddsDetail()'>&nbsp;</td>");
                group.html.push("<td class=oddstd onmouseenter='showOddsChange(" + i + ",event)' onmouseleave='hideOddsDetail()'></td>");
                group.html.push("</tr>");
                group.html.push("</td></tr>");
            }

        } catch (e) {
            console.log(e);
        }
    }

    for (var groupId in groupData) {
        if (groupData.hasOwnProperty(groupId)) {
            var group = groupData[groupId];
            groupHtml.push(group.html.join(""));
        }
    }

    html.push(groupHtml.join(""));
    html.push("</table>");
    // document.getElementById("live").innerHTML = html.join("");

    var finalHtml = html.join("");

    var container = document.getElementById("live");
    if (container) {
        container.innerHTML = finalHtml;
    }
}




// async function setMatchTime() {
//     var dataSchedule = await fetchData();
//     for (var i = 1; i <= dataSchedule.length; i++) {
//         // try {
//         //     var t2 = convertTime(A[i][7]);
//         //     var atTime = (A[i][35] != undefined && A[i][35] != "") ? "<br>AT+<font class='red'>" + A[i][35] + "</font>" : "";
//         //     if (A[i][8] == "1") {  //part 1			
//         //         goTime = Math.floor((new Date() - t2 - difftime) / 60000);
//         //         if (goTime > 45) {
//         //             var t3 = goTime - 45;
//         //             goTime = "45+" + (t3 > 15 ? 15 : t3);
//         //         }
//         //         if (goTime < 1) goTime = "1";
//         //         document.getElementById("time_" + A[i][0]).innerHTML = "<span id='got_" + A[i][0] + "'>" + goTime + "<img src='/images/in.gif' border=0></span>" + atTime;
//         //     }
//         //     if (A[i][8] == "3") {  //part 2		
//         //         goTime = Math.floor((new Date() - t2 - difftime) / 60000) + 46;
//         //         if (goTime > 90) {
//         //             var t3 = goTime - 90;
//         //             goTime = "90+" + (t3 > 15 ? 15 : t3);
//         //         }
//         //         if (goTime < 46) goTime = "46";
//         //         document.getElementById("time_" + A[i][0]).innerHTML = "<span id='got_" + A[i][0] + "'>" + goTime + "<img src='/images/in.gif' border=0></span>" + atTime;
//         //     }
//         //     if (A[i][8] == "1" || A[i][8] == "3") {
//         //         document.getElementById("tvLink_" + A[i][0]).style.display = "";
//         //         document.getElementById("mt_" + A[i][0]).style.display = "none";
//         //         document.getElementById("time_" + A[i][0]).style.display = "";
//         //     }
//         // } catch (e) { }
//     }
//     // runtimeTimer = window.setTimeout("setMatchTime()", 30000);
// }

// function initSettings() {
//     if (getCookie(_settingObj.allMatchSetting.goalWindowCookie) != null) {
//         _settingObj.allMatchSetting.goalWindow = getCookie(_settingObj.allMatchSetting.goalWindowCookie) == "1";
//     }

//     if (getCookie("soundCheck") != null) {
//         _settingObj.allMatchSetting.homeSoundId = getCookie("soundCheck");
//     }

//     if (getCookie("soundCheck2") != null) {
//         _settingObj.allMatchSetting.awaySoundId = getCookie("soundCheck2")
//     }

//     if (getCookie(_settingObj.forAllMatchCookie) != null) {
//         _settingObj.forAllMatch = getCookie(_settingObj.forAllMatchCookie) == "0";
//     }
//     var setting = _settingObj.allMatchSetting;

//     if ($("#goalWindowCheck")[0]) {
//         $("#goalWindowCheck")[0].checked = setting.goalWindow;
//     }
//     if ($("#redWindowCheck")[0]) {
//         $("#redWindowCheck")[0].checked = setting.redWindow;
//     }
//     // initSoundSelect(setting.homeSoundId, "selectsound1");
//     // initSoundSelect(setting.awaySoundId, "selectsound2");

//     //球队排名
//     if (getCookie(_settingObj.rankCookie) != null) {
//         _settingObj.rank = getCookie(_settingObj.rankCookie) == "1";
//     }
//     if ($("#TeamOrderCheck")[0])
//         $("#TeamOrderCheck")[0].checked = _settingObj.rank;

//     if (getCookie(_settingObj.yellowCardCookie) != null) {
//         _settingObj.yellowCard = getCookie(_settingObj.yellowCardCookie) == "1";
//     }
//     if ($("#YellowCheck")[0])
//         $("#YellowCheck")[0].checked = _settingObj.yellowCard;

//     if (getCookie(_settingObj.remarkCookie) != null) {
//         _settingObj.remark = getCookie(_settingObj.remarkCookie) == "1";
//     }
// }




function oddsxmlHandle(oHttpObj) {
    if (oHttpObj && oHttpObj.responseText) {
        var root = (oHttpObj.responseText);
    }
    var jsonRoot = (JSON.parse(root));
    var root = jsonRoot.data;
    showodds(root, 0);

}


function showodds(data, type) {
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
        tr = document.getElementById("tr1_" + D.MATCH_ID);
        if (tr) {
            try {
                const oddsValue = (tr.attributes["odds"].value);

                if (oddsValue && oddsValue.trim() !== "") {
                    old = JSON.parse(oddsValue);
                    if (old.HomeHandicap !== D.HomeHandicap) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.HomeHandicap) > parseFloat(D.HomeHandicap)) {
                            // trCV.style.backgroundColor = "#c9e8c6";
                            // pDownOdd1 = trCV.cells[9].querySelector(".odds1");
                            // trCV.classList.add("p9DownOdd1");
                            // trCV.classList.remove("p9UpOdd1");
                            D.HomeHandicap = '<span class="down">' + D.HomeHandicap + '</span>';
                        } else if (parseFloat(old.HomeHandicap) < parseFloat(D.HomeHandicap)) {
                            // pUpOdd1 = trCV.cells[9].querySelector(".odds1");
                            // trCV.classList.add("p9UpOdd1");
                            // trCV.classList.remove("p9DownOdd1");
                            D.HomeHandicap = '<span class="up">' + D.HomeHandicap + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p9DownOdd1");
                        trCV.classList.remove("p9UpOdd1");
                    }

                    if (old.Handicap !== D.Handicap) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.Handicap) > parseFloat(D.Handicap)) {
                            // pDownOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p10DownOdd1");
                            // trCV.classList.remove("p10UpOdd1");
                            D.Handicap = '<span class="down">' + D.Handicap + '</span>';
                        } else if (parseFloat(old.Handicap) < parseFloat(D.Handicap)) {
                            // pUpOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p10UpOdd1");
                            // trCV.classList.remove("p10DownOdd1");
                            D.Handicap = '<span class="up">' + D.Handicap + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p10DownOdd1");
                        trCV.classList.remove("p10UpOdd1");
                    }

                    if (old.AwayHandicap !== D.AwayHandicap) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.AwayHandicap) > parseFloat(D.AwayHandicap)) {
                            // pDownOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p11DownOdd1");
                            // trCV.classList.remove("p11UpOdd1");
                            D.AwayHandicap = '<span class="down">' + D.AwayHandicap + '</span>';
                        } else if (parseFloat(old.AwayHandicap) < parseFloat(D.AwayHandicap)) {
                            // pUpOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p11UpOdd1");
                            // trCV.classList.remove("p11DownOdd1");
                            D.AwayHandicap = '<span class="up">' + D.AwayHandicap + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p11DownOdd1");
                        trCV.classList.remove("p11UpOdd1");
                    }

                    // -------------------------------------
                    if (old.HW !== D.HW) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.HW) > parseFloat(D.HW)) {
                            // pDownOdd1 = trCV.cells[9].querySelector(".odds1");
                            // trCV.classList.add("p9DownOdd2");
                            // trCV.classList.remove("p9UpOdd2");
                            D.HW = '<span class="down">' + D.HW + '</span>';
                        } else if (parseFloat(old.HW) < parseFloat(D.HW)) {
                            // pUpOdd1 = trCV.cells[9].querySelector(".odds1");
                            // trCV.classList.add("p9UpOdd2");
                            // trCV.classList.remove("p9DownOdd2");
                            D.HW = '<span class="up">' + D.HW + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p9DownOdd2");
                        trCV.classList.remove("p9UpOdd2");
                    }

                    if (old.D !== D.D) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.D) > parseFloat(D.D)) {
                            // pDownOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p10DownOdd2");
                            // trCV.classList.remove("p10UpOdd2");
                            D.D = '<span class="down">' + D.D + '</span>';
                        } else if (parseFloat(old.D) < parseFloat(D.D)) {
                            // pUpOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p10UpOdd2");
                            // trCV.classList.remove("p10DownOdd2");
                            D.D = '<span class="up">' + D.D + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p10DownOdd2");
                        trCV.classList.remove("p10UpOdd2");
                    }

                    if (old.AW !== D.AW) {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        if (parseFloat(old.AW) > parseFloat(D.AW)) {
                            // pDownOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p11DownOdd2");
                            // trCV.classList.remove("p11UpOdd2");
                            D.AW = '<span class="down">' + D.AW + '</span>';
                        } else if (parseFloat(old.AW) < parseFloat(D.AW)) {
                            // pUpOdd1 = trCV.cells[10].querySelector(".odds1");
                            // trCV.classList.add("p11UpOdd2");
                            // trCV.classList.remove("p11DownOdd2");
                            D.AW = '<span class="up">' + D.AW + '</span>';
                        }
                    } else {
                        trCV = document.getElementById("tr1_" + D.MATCH_ID);
                        trCV.classList.remove("p11DownOdd2");
                        trCV.classList.remove("p11UpOdd2");
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }

        if (tr == null) continue;

        var cellContents = ["", "", ""];
        var oddsTpyes = _oddsOrder.split('-');

        let AhOH = "-";
        let AhOM = "-";
        let AhOW = "-";
        let EuOH = "-";
        let EuOM = "-";
        let EuOW = "-";

        AhOH = D.HomeHandicap || "-";
        AhOM = D.Handicap || "-";
        AhOW = D.AwayHandicap || "-";
        EuOH = D.HW || "-";
        EuOM = D.D || "-";
        EuOW = D.AW || "-";

        oddsTpyes.forEach(function(a) {
            if (a == 1) {
                // HDP
                if ((_oddsShow & 1) == 1) {
                    // cellContents[0] += "<p class=odds1>" + ((D[14] == "0" || isResult) ? FilterEmpty(D[3]) : "&nbsp;") + "</p>";
                    cellContents[0] += "<p class=odds1>" + FilterEmpty(AhOH) + "</p>";
                    cellContents[1] += "<p class=odds2>" + FilterEmpty(AhOM) + "</p>";
                    cellContents[2] += "<p class=odds3>" + FilterEmpty(AhOW) + "</p>";
                }
            } else if (a == 2) {
                if ((_oddsShow & 2) == 2) {
                    cellContents[0] += "<p class=odds4>" + FilterEmpty(EuOH) + "</p>";
                    cellContents[1] += "<p class=odds5>" + FilterEmpty(EuOM) + "</p>";
                    cellContents[2] += "<p class=odds6>" + FilterEmpty(EuOW) + "</p>";
                }
            } else if (a == 3) {
                // if ((_oddsShow & 8) == 8) {
                //     cellContents[0] += `<p class=odds2>${AhOH}</p>`;
                //     cellContents[1] += `<p class=odds2>${AhOH}</p>`;
                //     cellContents[2] += `<p class=odds2>${AhOH}</p>`;
                // }
            }
        });

        tr.cells[9].innerHTML = cellContents[0];
        tr.cells[10].innerHTML = cellContents[1];
        tr.cells[11].innerHTML = cellContents[2];

        tr.attributes["odds"].value = JSON.stringify(data[i]);


        // if (data[i].ODDS_AH || data[i].ODDS_EURO || data[i].ODDS_AHRUN || data[i].ODDS_EURORUN) {
        //     const oddsAh = JSON.parse(data[i].ODDS_AH);
        //     const oddsEu = JSON.parse(data[i].ODDS_EURO);
        //     const oddsAhRUN = JSON.parse(data[i].ODDS_AHRUN);
        //     const oddsEuRUN = JSON.parse(data[i].ODDS_EURORUN);
        // }
        // let arrOddsAh = JSON.stringify(oddsAhRUN.u) === '""' ? JSON.stringify(oddsAh.l) : JSON.stringify(oddsAhRUN);
        // let arrOddsEu = JSON.stringify(oddsEuRUN.u) === '""' ? JSON.stringify(oddsEu.l) : JSON.stringify(oddsEuRUN);

        // arrOddsAh = JSON.parse(arrOddsAh);
        // arrOddsEu = JSON.parse(arrOddsEu);

        // AhOH = arrOddsAh.u || "-";
        // AhOM = arrOddsAh.g || "-";
        // AhOW = arrOddsAh.d || "-";
        // EuOH = arrOddsEu.u || "-";
        // EuOM = arrOddsEu.g || "-";
        // EuOW = arrOddsEu.d || "-";

        // oddsTpyes.forEach(function(a) {
        //     if (a == 1) {
        //         // HDP
        //         if ((_oddsShow & 1) == 1) {
        //             cellContents[0] += `<p class=odds1>${AhOH}</p>`;
        //             cellContents[1] += `<p class=odds1>${AhOM}</p>`;
        //             cellContents[2] += `<p class=odds1>${AhOW}</p>`;
        //         }
        //     } else if (a == 2) {
        //         if ((_oddsShow & 2) == 2) {
        //             cellContents[0] += `<p class=odds2>${EuOH}</p>`;
        //             cellContents[1] += `<p class=odds2>${EuOM}</p>`;
        //             cellContents[2] += `<p class=odds2>${EuOW}</p>`;
        //         }
        //     } else if (a == 3) {
        //         // if ((_oddsShow & 8) == 8) {
        //         //     cellContents[0] += `<p class=odds2>${AhOH}</p>`;
        //         //     cellContents[1] += `<p class=odds2>${AhOH}</p>`;
        //         //     cellContents[2] += `<p class=odds2>${AhOH}</p>`;
        //         // }
        //     }
        // });
        // // tr.cells[10].innerHTML = cellContents[0];
        // tr.cells[9].innerHTML = cellContents[0];
        // tr.cells[10].innerHTML = cellContents[1];
        // tr.cells[11].innerHTML = cellContents[2];

        // tr.attributes["odds"].value = data;

    }
}

function FilterEmpty(val) {
    if (typeof(val) == "undefined" || val == "")
        return "";
    else return val;
}

function getoddsxml() {
    oddsHttp_ch.open("GET", "/ajax/soccerajax?type=2", true);
    oddsHttp_ch.onreadystatechange = oddsrefresh;
    oddsHttp_ch.send(null);
    oddPolling = window.setTimeout("getoddsxml()", 60000);
}

function oddsrefresh() {
    if (oddsHttp_ch.readyState !== 4 || (oddsHttp_ch.status !== 200 && oddsHttp_ch.status !== 0)) return;
    if (oldOddsXML === oddsHttp_ch.responseText) {
        return;
    }
    oldOddsXML = oddsHttp_ch.responseText;
    oddsxmlHandle(oddsHttp_ch);
}

function hideOddsDetail() {
    // document.getElementById("ifShow").value = 0;
    // clearSbdata();
    // showCont = 0;
    // MM_showHideLayers('oddsChange', '', 'hidden');
    // console.log('hideOddsDetail');
}

function Hashtable() {
    this._hash = new Object();
    this.add = function(key, value) {
        if (typeof(key) != "undefined") {
            this._hash[key] = typeof(value) == "undefined" ? null : value;
            return true;
        } else
            return false;
    }
    this.remove = function(key) { delete this._hash[key]; }
    this.keys = function() {
        var keys = new Array();
        for (var key in this._hash) {
            keys.push(key);
        }
        return keys;
    }
    this.count = function() { var i = 0; for (var k in this._hash) { i++; } return i; }
    this.items = function(key) { return this._hash[key]; }
    this.contains = function(key) {
        return typeof(this._hash[key]) != "undefined";
    }
    this.clear = function() { for (var k in this._hash) { delete this._hash[k]; } }
}

// async function initHashTable() {
//     var odds = await fetchOddsData();
//     var noOddsKey = _locModel.T.T_NoOdds;
//     if (needClearHashTable) {
//         hsLetGoal = new Hashtable();
//         hsBigSmallGoal = new Hashtable();

//         for (var i = 1; i <= odds.league; i++) {
//             if (hsLetGoal.contains(noOddsKey)) {
//                 var iList = hsLetGoal.items(noOddsKey);
//                 iList += "," + i;
//                 hsLetGoal.add(noOddsKey, iList);
//             } else
//                 hsLetGoal.add(noOddsKey, i.toString());

//             if (hsBigSmallGoal.contains(noOddsKey)) {
//                 var iList = hsBigSmallGoal.items(noOddsKey);
//                 iList += "," + i;
//                 hsBigSmallGoal.add(noOddsKey, iList);
//             } else
//                 hsBigSmallGoal.add(noOddsKey, i.toString());
//         }
//     }
// }

function changeTimeZone(value) {
    ShowBf();
}


async function openWebsocket() {
    var channels = ["change_xml", "ch_goal" + 8 + "_xml"];
    try {
        wsUtil.connectWs(channels, async function(data) {
            try {
                const results = JSON.parse(event.data);
                showodds(results, 1);
            } catch (error) {
                console.error("Error:", error);
            }
        }, function() {
            // if (scorePolling) window.clearTimeout(scorePolling);
            // if (oddPolling) window.clearTimeout(oddPolling);
            // if (!isResult && !isSem) scorePolling = window.setTimeout("getxml()", 2000);
            if (!isResult && !isSem) oddPolling = window.setTimeout("getoddsxml()", 60000);
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