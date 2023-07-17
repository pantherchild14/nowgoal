function GetTimeZone() {
    var defaultTimeZone = 0 - ((new Date()).getTimezoneOffset()) / 60;
    var detault = defaultTimeZone; //默认是系统时区
    var value = getCookie("Time_Zone");
    if (value != null && value != "" && value != undefined && !isNaN(value)) detault = parseFloat(value);
    writeCookie("Default_TimeZone", detault);
    return detault;
}

var timezone = GetTimeZone();
console.log(timezone);


function showHideTimeZone(o) {
    var timeZone = document.getElementById('ddlTimeZone');
    var isHide = timeZone.style.display == "none";
    if (isHide) {
        if (document.getElementById('chooseOddsType') != null) document.getElementById('chooseOddsType').className = "Choose-tool";
        if (document.getElementById('ddlOddsType') != null) document.getElementById('ddlOddsType').style.display = "none";
        o.className = "Choose-tool on";
        timeZone.style.display = "";
    } else {
        o.className = "Choose-tool";
        timeZone.style.display = "none";
    }
}