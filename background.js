
setInterval(checkState, 100);
var laststate = "";
var oldWindowsState = "";
var homeurl = "https://www.google.com";	// URL of the new tab
var waitTime = 15;
var curStatus = "active";

function checkState() {
  waitTime = 15;	// Duration of idle state : 300sec = 5min

  chrome.idle.queryState(waitTime, function(state) {
    if (laststate != state) {
			laststate = state;
			if (state == "idle") {
				curStatus = "idle";
				chrome.tabs.getSelected(null, function(tab) {
					alert(tab.url);
					if (tab.url.indexOf("screendynamics.com") < 0)
						chrome.tabs.create({ url: homeurl })
				})
				chrome.windows.getCurrent(null, function(window) {
					oldWindowsState = window.state;
					chrome.windows.update(window.id, { state: "fullscreen" });
				})
			}
			else if (state == "active" && curStatus == "idle") {
				curStatus = "active";
				chrome.windows.getCurrent(null, function(window) {
					if (oldWindowsState != "")
						chrome.windows.update(window.id, { state: oldWindowsState });
				})
			}
    }
  });
};

chrome.runtime.getPackageDirectoryEntry(function(root) {
	root.getFile("1.json", {}, function(fileEntry) {
		fileEntry.file(function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var myFile = JSON.parse(this.result);
				homeurl = myFile["posts"][0]["url"];
				waitTime = myFile["posts"][0]["idle"];
			};
			reader.readAsText(file);
		});
	});
});
