var notes = [];

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ notes: notes });
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tab);
  // if (changeInfo.status == "complete") {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: setPageBackgroundColor,
  //   });

  //   function setPageBackgroundColor() {
  //     document.body.style.backgroundColor = "blue";
  //   }
  // }
});

var printData;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.print) {
    printData = request.data;
    console.log(request);
  }
});
