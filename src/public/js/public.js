var _settingObj = {
    forAllMatch: true,
    forAllMatchCookie: "forAllMatchCheck",
    allMatchSetting: {
        goalWindow: true,
        redWindow: true,
        homeSoundId: 0,
        awaySoundId: 1,
        goalWindowCookie: "goalWindowCheck",
        redWindowCookie: "redWindowCheck",
        closeSound: function() {
            this.homeSoundId = 4;
            this.awaySoundId = 4;
        }
    },
    rank: true,
    rankCookie: "TeamOrderCheck",
    yellowCard: true,
    yellowCardCookie: "YellowCheck",
    remark: true,
    remarkCookie: "ShowRemarkCheck",
    redCard: true,
    oddsTrend: true,
    showPanLu: true,
    showCorner: true,
    isFavTop: true,

};

// var _oddsType = GetOddType();
var _timeZone = GetTimeZone();

// function GetOddType() {
//     var detault = _defaultOddsType;
//     var oddsType = getCookie("Odds_Type");
//     if (!oddsType != null && oddsType != "" && oddsType != undefined && !isNaN(oddsType)) detault = parseInt(oddsType);
//     return detault;
// }


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function writeCookie(name, value, expireVal) {
    if (typeof(_appModule) != 'undefined' && (_appModule == "Ind" || _appModule == "Bola")) {
        writeShareCookie(name, value, expireVal);
        return;
    }

    var expire = expireVal;
    var hours = 365;
    if (expire == undefined)
        expire = new Date((new Date()).getTime() + hours * 3600000);

    expire = ";path=/;expires=" + expire.toGMTString();
    document.cookie = name + "=" + escape(value) + expire;
}

function getDoMain() {
    var arrDoms = location.href.split("/")[2].split(".");
    var isNum = /^\d+$/;
    if (isNum.test(arrDoms[1]))
        return arrDoms[0] + "." + arrDoms[1] + "." + arrDoms[2] + "." + arrDoms[3].split(":")[0];
    else
        return arrDoms[1] + "." + arrDoms[2];
}

function writeShareCookie(name, value, expireVal) {
    var expire = expireVal;
    var hours = 365;
    if (expire == undefined)
        expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = ";path=/;expires=" + expire.toGMTString() + ";domain=" + getDoMain();
    document.cookie = name + "=" + escape(value) + expire;
}



function GetTimeZone() {
    var defaultTimeZone = 0 - ((new Date()).getTimezoneOffset()) / 60;
    var detault = defaultTimeZone;
    var value = getCookie("Time_Zone");
    if (value != null && value != "" && value != undefined && !isNaN(value)) detault = parseFloat(value);
    writeCookie("Default_TimeZone", detault);
    return detault;
}

function changeTopTimeZone(value) {
    if (_timeZone !== value || document.getElementById('selectedTimeZone').innerText == document.getElementById("timeZone_auto").innerText) {
        var isAuto = (value === '');
        if (isAuto) {
            SetTimeZone('');
            value = GetTimeZone();
        }
        var elem = isAuto ? 'timeZone_auto' : 'timeZone_' + value;
        document.getElementById('selectedTimeZone').innerText = document.getElementById(elem).innerText;
        _timeZone = parseFloat(value);
        if (!isAuto) SetTimeZone(value);
        changeTimeZone();
        // setTimeByFormat();
        // setPublishTime();
    }
}

function SetTimeZone(value) {
    writeShareCookie("Time_Zone", value);
}

var zXml = {
    useActiveX: (typeof ActiveXObject != "undefined"),
    useXmlHttp: (typeof XMLHttpRequest != "undefined")
};

function zXmlHttp() {}
zXmlHttp.createRequest = function() {
    if (zXml.useXmlHttp) return new XMLHttpRequest();
    if (zXml.useActiveX) {
        if (!zXml.XMLHTTP_VER) {
            for (var i = 0; i < zXml.ARR_XMLHTTP_VERS.length; i++) {
                try {
                    new ActiveXObject(zXml.ARR_XMLHTTP_VERS[i]);
                    zXml.XMLHTTP_VER = zXml.ARR_XMLHTTP_VERS[i];
                    break;
                } catch (oError) {}
            }
        }
        if (zXml.XMLHTTP_VER) return new ActiveXObject(zXml.XMLHTTP_VER);
    }
    alert("Sorry，XML object unsupported by your computer,please setup XML object or change explorer.");
};

function MM_showHideLayers() { //v6.0
    var i, p, v, obj, args = MM_showHideLayers.arguments;
    for (i = 0; i < (args.length - 2); i += 3)
        if ((obj = MM_findObj(args[i])) != null) {
            v = args[i + 2];
            if (obj.style) {
                obj = obj.style;
                v = (v == 'show') ? 'visible' : (v == 'hide') ? 'hidden' : v;
            }
            if (v == "none" || v == "block") {
                obj.display = v;
            } else {
                obj.visibility = v;
            }
        }
}

function MM_findObj(n, d) { //v4.01
    var p, i, x;
    if (!d) d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n);
    return x;
}

// function getChangeStrDiv(odds, odds1, odds2) {
//     var retVal;
//     if (typeof (odds) == "undefined" || odds == "")
//         return "";
//     if (parseFloat(odds1) > parseFloat(odds2))
//         retVal = '<div class="up">' + odds + '</div>';
//     else if (parseFloat(odds1) < parseFloat(odds2))
//         retVal = '<div class="down">' + odds + '</div>';
//     else
//         retVal = odds;
//     return retVal;
// }


function SetRunOddsObj(data) {
    var arr = data;

    var scheduleId = arr['MATCH_ID'];
    var oddsList = arr
    sData[scheduleId] = oddsList;
}

function getDefaultOddsShow() {
    if (typeof(_oddsOrder) != "undefined") {
        var oddsArr = _oddsOrder.split('-');
        var fir = oddsArr[0] == '3' ? 8 : parseInt(oddsArr[0]);
        var sec = oddsArr[1] == '3' ? 8 : parseInt(oddsArr[1]);
        return fir + sec;
    } else {
        return 10;
    }
}

function initSetting() {

    var _$selectedTimeZone = document.getElementById('selectedTimeZone');
    var timeCookie = getCookie("Time_Zone");
    if (_$selectedTimeZone && (timeCookie == null || timeCookie == '')) {
        _$selectedTimeZone.innerText = document.getElementById('timeZone_auto').innerText;
        return;
    }
    var _$timeZone = document.getElementById('timeZone_' + _timeZone);
    if (_$selectedTimeZone && (_$selectedTimeZone && _$timeZone)) {
        _$selectedTimeZone.innerText = _$timeZone.innerText;
    }
}

$(function() {
    document.onclick = checkHide;
    initSetting();
});

function checkHide(e) {
    var timeZone = document.getElementById('selectedTimeZone');
    var src = e.srcElement;
    if (src == timeZone) return;
}