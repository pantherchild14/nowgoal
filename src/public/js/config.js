var _mainWebDomain = '//www.nowgoal7.com/';
var _livescoreWebDomain = '//www.nowgoal7.com/';
var _dataWebDomain = '//data.nowgoal7.com/';
var _basketballWebDomain = '//basketball.nowgoal7.com/';
var _footballWebDomain = '//football.nowgoal7.com/';
var _cmsWebDomain = 'https://tips.nowgoal7.com/';
var _infoWebDomain = '//football.nowgoal7.com/';
var _touchWebDomain = '//www.nowgoal24.com/';
var _freeWebDomain = '//www.nowgoal7.com/';
var _freeAppDomain = 'https://goalo.net/';
var _domain = 'nowgoal7';
var _tail = 'com';
var _defaultOddsType = '1';
var _defaultTimeZone = '7';
var _leagueNameIdx = '2';
var _isNewOddsTxt = '1';
var _upDownColorType = '1';
var _oddsOrder = '1-2-3';
var _moduleKey = 'Ng';
var _websocket = true;

function generateToken() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var tokenLength = 32;
    var token = '';

    for (var i = 0; i < tokenLength; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }

    return token;
}

var wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
var wsHost = window.location.host;
var wsPath = '/stream';

var channels = 'change_xml,ch_goal8_xml';
var token = generateToken();

var _wsUrl = wsProtocol + wsHost + wsPath + '?channels=' + encodeURIComponent(channels) + '&token=' + encodeURIComponent(token);