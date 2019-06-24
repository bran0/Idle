
setInterval(checkState, 100);
var laststate = ""
var oldWindowsState = ""
const homeurl = "https://pixelthoughts.co"	// URL of the new tab

function checkState() {
  waitTime = 15;	// Duration of idle state : 300sec = 5min

  chrome.idle.queryState(waitTime, function(state) {
    if (laststate != state) {
			laststate = state;
			if (state == "idle") {
				chrome.tabs.create({ url: homeurl })
				chrome.windows.getCurrent(null, function(window) {
					oldWindowsState = window.state;
					chrome.windows.update(window.id, { state: "fullscreen" });
				})
			}
			else if (state == "active") {
				chrome.windows.getCurrent(null, function(window) {
					if (oldWindowsState != "")
						chrome.windows.update(window.id, { state: oldWindowsState });
				})
			}
    }
  });
};