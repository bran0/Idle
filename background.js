
var laststate = "";
var oldWindowsState = "";
var homeurl = "";	// URL of the new tab
var waitTime = 0;
var dataurl = "https://screendynamics.com/webapp/results.json"

function loadData() {
	fetch("https://cors-anywhere.herokuapp.com/" + dataurl + "?v=" + Math.random())
		.then(response => response.json())
		.then(data => {
			homeurl = data["posts"][0]["url"];
			waitTime = parseInt(data["posts"][0]["idle"]);
			alert(homeurl + waitTime)
		})
}

function checkState() {
	waitTime = Math.max(15, waitTime);
	chrome.idle.queryState(waitTime, function(state) {
		if (laststate != state) {
			laststate = state;
			if (state == "idle") {
				chrome.tabs.getSelected(null, function(tab) {
					if (tab.url.indexOf(homeurl.substr(0, 20)) < 0)
						chrome.tabs.create({ url: homeurl })
					else
						chrome.tabs.update(tab.id, { url: homeurl })
				})
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
setInterval(checkState, 1000);
setInterval(loadData, 3000);