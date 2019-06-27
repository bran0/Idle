
var laststate = "";
var oldWindowsState = "";
var homeurl = "";	// URL of the new tab
var waitTime = 0;

chrome.runtime.getPackageDirectoryEntry(function(root) {
	root.getFile("1.json", {}, function(fileEntry) {
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var myFile = JSON.parse(this.result);
				homeurl = myFile["posts"][0]["url"];
				waitTime = parseInt(myFile["posts"][0]["idle"]);
				setInterval(checkState, 1000);
			};
			reader.readAsText(file);
		});
	});
});

function checkState() {
	if (waitTime  <= 0)
		return;
	waitTime = Math.max(15, waitTime);
	chrome.idle.queryState(waitTime, function(state) {
		if (laststate != state) {
			laststate = state;
			if (state == "idle") {
				chrome.tabs.getSelected(null, function(tab) {
					if (tab.url.indexOf("screendynamics.com") < 0)
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