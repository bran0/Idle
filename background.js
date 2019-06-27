
var laststate = "";
var oldWindowsState = "";
var homeurl = "";	// URL of the new tab
var waitTime = 0;
var dataurl = "https://screendynamics.com/webapp/results.json"
var suc = false;

function loadData() {
	fetch("https://cors-anywhere.herokuapp.com/" + dataurl + "?v=" + Math.random())
		.then(response => {
			if (response.status == 200) {
				suc = true;
				return response.json();
			}
			else {
				suc = false;
				alert("Error: " + response.statusText)
			}
		})
		.then(data => {
			if (suc == true) {
				homeurl = data["posts"][0]["url"];
				waitTime = parseInt(data["posts"][0]["idle"]);
			}
		})
}

function checkState() {
	if (waitTime <= 0)
		return;
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
loadData()
setInterval(checkState, 1000);
//setInterval(loadData, 60000);