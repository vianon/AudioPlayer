"use strict";

/*
 * 可使用三个参数：url, file, id
 * url: 单文件播放，直接填入音频文件地址；
 * file: 外部JSON文件，放在同级目录；
 * id: 读取数据库。
 */

var playList = {};
var player = null;
var random = false;
var replay = false;
var nowPlay = 0;
var playing = 0;

var ctrl = {
		"play": "data:image/gif;base64,R0lGODlhQABAAMQAAKSLKWVaL4RyLEtFMZN9Kt23JPHGIreZJ8WlJjo5MjU1M1ZOMMGhJkA9MuK7I66TKOzCI+i/I+3DItOvJXNlLVhQMOe+I9SwJZeAKsqoJtizJKiOKYBvLLWXJ/LHIjMzMyH5BAAAAAAALAAAAABAAEAAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj6fHIaBA0gweCaDilEE82AJhUH1dsViNoNFlfcHYDCVRTp3R2E6gfXrDPZEpnWS/exwYXHt9fh4FHGRthIUeCBRNXYuMBnKRjJcWGwtOkpdYEVtHnZ5YF4hFo6RYjpBBqapRS0KvsB4GAJs/tLV/oT27vB4TYzzAwR4Mxce8yTvGtcOJOs+kDr7Ky4W3uT7UfhKyrtlwrEPeYKbSs+OggqjLmdxGxpRzVcDllqqH6vfVgXs+dMpDJaBARpUMiiCkho3ChXDE9FN4Rou7hyOgSCmIsYQSJh1DihxJsqTJkyhTBqpcybJKCAA7",
		"pause": "data:image/gif;base64,R0lGODlhQABAAMQAAFBKMNOvJeS8I9izJOK7I5aAKj07Mk1HMeW9I0lEMdGtJVJLMMelJo96K456K9SwJTo4Mt23JM6rJVFKMNWwJdmzJNKuJeO7I+K6I/LHIjMzMwAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABAAEAAAAX/oCaOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ik8lRQEDDQaBQxaBhIhsYAIe0SFAVeJUMum8uSA+kgObvJFd7l7X5MSJMH/XzhYfZmAQAkAAGAZRh+h2SChIaLiTt/i40jhYsZkTqTh5Uil5CKlIOWj4eaOZyAnhqgp6KdpJ+mgKg4qnusrrWwq7KttHu2N7h0usF0wzbFb8eYyjXMbs6hkpjUr9ajjs+9ub+7wt7G4Mhv0DTSZ9i82rHc1ZvX5d3uvvDZ8tul9frv/PFSzcPXzt89gPkE7pvVT+E/hgFvDURY0OFBiAklLgTWUONDjhFvCMBEYQGJBRQwOQngYQETgwQkEjDAZIFHgQFPukQREMEBBBIQHEQQoDMKgQFhlihdyrSp06dQo0qdSrWq1atYsyoJAQA7",
		"stop": "data:image/gif;base64,R0lGODlhQABAALMAAOi/I9q0JOS8I+nAI9y2JOW9I7ydJ7udJ/LHIjMzMwAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABAAEAAAATpMMlJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu760hDICgcCggBI4BgmDIBAwKBlcBQa1ar9isteAaaL/g68AFCJu/APJ5fU23yuy4mwWPr+erut2MV+n3YH0pf4BagiiEhViHJ4mKVowmjo9UkSUClF8CLgSZWgQuAZ5ZAaGjWKUtoqdWqSyrrFSuK52xVKAtmLYIm2+7CJYkk5TBI8OPxSLHiskhy4XNIM+A0R/Te9Ue13bZHdtyarvdHF67Yy1Tu70sBgVATUJFSElL8EFPBzz6+/z9/v8AAwocSLCgwYMIEyp0EQEAOw==",
		"prev": "data:image/gif;base64,R0lGODlhQABAAMQAAIVzLOzCI3trLaOKKcupJmdbLtGtJcWkJqyRKDs5MlRNME1HMdWxJXBiLtm0JNy2JLaZJ76eJ+K7I8imJl1TL9izJHZnLXNkLWxfLrKVKFhQMOi/I9+4JPDGIvLHIjMzMyH5BAAAAAAALAAAAABAAEAAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ik0pQAIA6TKGGgwSkGkIWOsvF4v56sTWDwBC66SxfsnRRoC0TAu2noGmu2W5YQVMB1d3lgezAKCGwegTl4iR4EGC99DI6LOI2JkC6HHY6KdoyDXwaRK00OnnSgl6JeBqsoGhmpX5Y3mGwGaChNf7Sqgo4MuyYKGZ2/wKGOFRZMAA/JgLA2uGAOAiUUENJsttWtHg/ZIk3R3dPBiRzkGhDI6LXUNdZfEgLm8Ynf9OEMA4j07ZtHo54XB+cEeiM4w6AHhAoHqmNTAWDEdMsS3ct3kV/BcOxEuIOnz2PDcONGjHAsyVCGw5Qktgk06TJcs2cJpdGM4fDmCWMkae2E4XBYil46W/IM92qFrGRDXzhsagoAqlRRXUwtxeLQnEpKiYbT5KJPGYkZ2RB4YyggRlaOCsHo40sZjgtf9bCVEedr1hYUJDiCoGBMmTM6mkCIImUABSsDImhZQrmy5cuYM2vezLmz58+gQ4senSQEADs=",
		"next": "data:image/gif;base64,R0lGODlhQABAAMQAAIVzLOzCI3trLaOKKcupJmdbLtGtJcWkJqyRKDs5MlRNME1HMdWxJXBiLtm0JNy2JLaZJ76eJ+K7I8imJl1TL9izJHZnLXNkLWxfLrKVKFhQMOi/I9+4JPDGIvLHIjMzMyH5BAAAAAAALAAAAABAAEAAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ik0rSADBQ4zYAwqR4QgITuEvAYBLamZ0z2bCi6xmYcQCxohUmZvLmk1+SKQBuLz8cbDXd/CFAwfn+Bg38Mey8YBH9mgjlqkh4dhS6QkoqVeJcOWSwYBp2UOJaXZBkaKw2miag3qqtjFaMoF7FznqmgtpgZhiYXDKeLwWQPuSQWFcifyn8QaCQCDtG/03/MfB8CD9q0wNxjHRCu4BzjNrXmZd4CEu017/BlCAPHssn4cw+y9ZP2r5vAXrPclSuoD9rAbQXHyKP3kFxEdOoEsKuosKC3EeHq0bg3rVqJkBztfy209bHEM5EzSF7qMAzFy5QjV/7B9a0YP4T+LrV6xauML4urRPVEAQumDJke2hBbUcppDJlflqrghDPmQk2HInV9CkyPVhaIgBJs82ZG2jIB7OTg4gVMDQUQJEmwhmNBhCc4KEypUgVCsyWIEytezLix48eQI0ueTLmy5ctHQgAAOw==",
		"random": "data:image/gif;base64,R0lGODlhQABAAMQAAGVaLqWLKbaZJ1RMMOrAIzg3M5iBKtm0JEhEMcSjJm5hLua+I4VyLH5tLHRlLdaxJdCtJZJ9K/HGIu7EIs6rJUA9MuvCI4l1K415K1lQMOC5JF5VL+K7I8imJvLHIjMzMyH5BAAAAAAALAAAAABAAEAAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaT4VB5WjbdBjMmsNjgUZlCotncrnGsh6P5FLwugDasARTrinecAUAgHAlM4D42zAJ+yNtM36DW08bKgMOARQahI5+EoA0j4MHXScbEJSbagaTnGECSyQYB6Cgn6cCJBcSp5waqacBIg4Er5sHADQcC76+BBauhAcIA5qOEwS/vwTDfro7FQABC4MStAHJHQ0ZJmB+D4c+CqZhGggAt9cGo99pHuJBDn0etAKOtCngD95CARIWTIMXhoK7E2Ag+BNS4cA9Rw5WTIEwwAiGgYQ6BEKBoEFFI2W0EbJiJsUAgh4O5BwsacKAI08sUVR4QIjAgI8xSzR4FubexhMdcQ6p0IHQgpsWIqqYQkFokAj5PuCDUGeflqZDAFgbpGFAhnUCfpIARzGIApqEHvoJIFYEOA9leUyr5uhBuq1hJiTo9m5QXF7MFgR7ZKHBB5GElAUWzBOuUxi47JUBwCHyI6yCXoUdcaGeZb+yNokqEaHy50GhHWkw0FZBgtNiYMp4ROCBAAbjZDLogPdUpLYt9LzZoMQFgg15hPMhJCmnCTSQ2DhHmGYMcOdguExPMaXK9hROSH43kWTl+PPo06tfz769+/fw47sIAQA7",
		"replay": "data:image/gif;base64,R0lGODlhQABAAMQAAHxsLYd0K2ZbLkdDMTk4MqSLKZR+KpqDKnRmLcWkJunAI9q1JM2qJeK6I+a9I7GVKPDGIr2eJ+7EItCsJdWwJV5UL0A9MuvCI1FLMG1gLt+4JLaYJ1lRMK6TKPLHIjMzMyH5BAAAAAAALAAAAABAAEAAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCzqLJXAJjFZLBKdA2JAMKoGBsYF4ul6PRBJowMYpCyWIKag+brfngkgXRIkKIAfYAHvuxMZJAJtHhQ9BAcXfoteCgYig14OPBYbjJddEAUZDV8NOwMMjBIKDg0OiotcnkeEcBAMBgAZHBgCCAUTq5efOQW7XxARZSgDABHAfb03ABJwEgF0KhYACozLNaFwDQIwFRSL2DQA22YwCNZ+4jIWCW8NFTEIDtc3GW8KeTCcvDYED28iVHlRoVO/GhzSeZGAIAZATOtgBEjGQJqLAM4YabJhIYCBjwakyCAAAKTJkwE48FhZybKly5cwY8qcgQHByZsHAGCQgeCAyTk2HqRadKFADAuivijoVsPgpQ3yMnqpaMPpIgWBYER4E+CG1T75YlRz42BnVUZh99FzY9TrVX0vBqxVGs+tHwp1XXBw9eXBwLNEA5ibNvaNA5U4vvZhoLPYsWSZuuZQ3AcChQg5K3DIEOAAA8he/Or4CtqNBAcOFJQO/TexpwwFMGEq0BrHXA3dCBhQKJvsgdo4JnTBTQKBu95fGGTtAYBCAqYkqAnvvcDAYB9oUhh70EACaAgXGAieSWBAzwcJnExIsMFABYsz48ufT7++/fv48+vfz/9GCAA7"
	};
var templ = [
		'<span id="playerArea" style="display: none;"></span>',
		'<span style="white-space: nowrap;padding: 5px 35px;border-radius: 100px;border: solid 1px #eee;box-shadow: 2px 3px 5px #ccc;">',
			'<img id="ctrlRandom" class="ctrlBtn" style="width: 48px;border-radius: 100px;margin: 0 12px;cursor: pointer;filter: grayscale(100%);" src="',ctrl.random,'" onclick="control(\'random\')">',
			'<img id="ctrlStop" class="ctrlBtn" style="width: 48px;border-radius: 100px;margin: 0 12px;cursor: pointer;display: none;" src="',ctrl.stop,'" onclick="control(\'stop\')">',
			'<img id="ctrlPrev" class="ctrlBtn" style="width: 48px;border-radius: 100px;cursor: pointer;display: none;" src="',ctrl.prev,'" onclick="control(\'prev\')">',
			'<img id="ctrlPlay" class="ctrlBtn" style="width: 64px;border-radius: 100px;margin: 2px 12px;cursor: pointer;filter: grayscale(100%);" src="',ctrl.play,'" onclick="control(\'play\')">',
			'<img id="ctrlPause" class="ctrlBtn" style="width: 64px;border-radius: 100px;margin: 2px 12px;cursor: pointer;display: none;" src="',ctrl.pause,'" onclick="control(\'pause\')">',
			'<img id="ctrlNext" class="ctrlBtn" style="width: 48px;border-radius: 100px;cursor: pointer;display: none;" src="',ctrl.next,'" onclick="control(\'next\')">',
			'<img id="ctrlReplay" class="ctrlBtn" style="width: 48px;border-radius: 100px;margin: 0 12px;cursor: pointer;filter: grayscale(100%);" src="',ctrl.replay,'" onclick="control(\'replay\')">',
		'</span>'
	];
document.write(templ.join(""));

function receiveData(res) {
	var loadUrl = document.getElementsByTagName("script");
	var src = loadUrl[loadUrl.length-1].getAttribute("src");
	var r = src.substr(1).match(new RegExp('(^|&?)' + res + '=([^&]*)(&|$)', 'i'));
	var result = null;
	if (r && src) {
		result = decodeURI(r[2]);
		return result;
	}
}

function ajax(res) {
	var xmlHttp = null;
	if (window.ActiveXObject) {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	}
	if (xmlHttp != null) {
		xmlHttp.open("get", res, true);
		xmlHttp.send();
		xmlHttp.onreadystatechange = doResult;
	}
	function doResult() {
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var obj = JSON.parse(xmlHttp.responseText);
				console.log(obj);
				playList.org = obj.PlayList;
				playList.now = obj.PlayList;
				if (playList.now.length>1) {
					document.getElementById("ctrlPrev").style.display = "inline";
					document.getElementById("ctrlNext").style.display = "inline";
				} else {
					document.getElementById("ctrlRandom").style.display = "none";
					document.getElementById("ctrlStop").style.display = "inline";
				}
				loadAudio(0);
			}
		}
	}
}

function loadAudio(res) {
	playing = 0;
	document.getElementById("ctrlPlay").style.filter = "grayscale(100%)";
	document.getElementById("ctrlStop").style.filter = "grayscale(100%)";
	var p = [
		'<audio id="audioPlay" hidden autoplay>',
			'<source src="',playList.now[res],'" type="audio/mpeg"/>',
		'</audio>'];
	document.getElementById("playerArea").innerHTML = p.join("");
	player = document.getElementById("audioPlay");
	player.onplay = function() {
		document.getElementById("ctrlPlay").style.display = "none";
		document.getElementById("ctrlPause").style.display = "inline";
	};
	player.onpause=function() {
		document.getElementById("ctrlPlay").style.display = "inline";
		document.getElementById("ctrlPause").style.display = "none";
	};
	player.onstop=function() {
		document.getElementById("ctrlPlay").style.display = "inline";
		document.getElementById("ctrlPause").style.display = "none";
	};
	player.onended=function() {
		changeAudio(1);
	};
	player.onerror=function() {
		changeAudio(1);
	};
	player.oncanplay = function() {
		playing = 1;
		document.getElementById("ctrlPlay").style.filter = "grayscale(0)";
		document.getElementById("ctrlStop").style.filter = "grayscale(0)";
		player.play();
	};
}
if (receiveData("url")) {
	playList.now = [receiveData("url")];
	document.getElementById("ctrlRandom").style.display = "none";
	document.getElementById("ctrlStop").style.display = "inline";
	loadAudio(0);
} else if (receiveData("file")) {
	ajax(receiveData("file")+".json");
} else if (receiveData("id")) {
	console.log(receiveData("id"));
	// ======================================================================================
	// 读取数据库
	// ======================================================================================
}

function changeAudio(res) {
	nowPlay = nowPlay + res;
	if (nowPlay<0) {
		if (replay) {
			nowPlay = playList.now.length - 1;
			loadAudio(nowPlay);
		} else {
			nowPlay = 0;
			return false;
		}
	}
	if (nowPlay>=playList.now.length) {
		if (replay) {
			nowPlay = 0;
			loadAudio(nowPlay);
		} else {
			nowPlay = playList.now.length - 1;
			return false;
		}
	}
	loadAudio(nowPlay);
}

function randomRank(tmp) {
	var flag = false;
	var data = tmp;
	if (/string/.test(typeof(data)))
	{
		flag = true;
		data = data.split("");
	}
	for (var i=0;i<data.length;i++)
	{
		var o = Math.floor(Math.random()*data.length);
		var z = data[i];
		data[i] = data[o];
		data[o] = z;
	}
	if (flag)
	{
		return data.join("");
	} else {
		return data;
	}
}

function control(res) {
	if (playList.now.length<=0) {
		return false;
	}
	switch (res) {
		case "play":
			if (playing===2) {
				playing = 1;
				player.play();
			}
			if (playing===0) {
				loadAudio(nowPlay);
			}
			break;
		case "pause":
			playing = 2;
			player.pause();
			break;
		case "stop":
			if (playing===1) {
				playing = 0;
				player.pause();
			}
			break;
		case "prev":
			changeAudio(-1);
			break;
		case "next":
			changeAudio(1);
			break;
		case "random":
			random = !random;
			nowPlay = 0;
			if (random) {
				document.getElementById("ctrlRandom").style.filter = "grayscale(0)";
				playList.now = randomRank(playList.now);
			} else {
				document.getElementById("ctrlRandom").style.filter = "grayscale(100%)";
				playList.now = playList.org.concat([]);
			}
			loadAudio(nowPlay);
			break;
		case "replay":
			replay = !replay;
			if (replay) {
				document.getElementById("ctrlReplay").style.filter = "grayscale(0)";
			} else {
				document.getElementById("ctrlReplay").style.filter = "grayscale(100%)";
			}
			break;
		default:
	}
}