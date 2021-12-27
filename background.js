//@ts-check

/*
allnotes:
{
  index,
  website,
  text,
  oRect,
  content
}
*/

var printData;
var all;

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ index: 0 });
//   chrome.storage.sync.set({ allnotes: [] });
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.storage.sync.get("allnotes", ({ allnotes }) => {
    console.log(allnotes);
    all = allnotes;
  });
  chrome.storage.sync.get("index", ({ index }) => {
    console.log(index);
  });
  // chrome.storage.sync.set({ allnotes: [] });
  // chrome.storage.sync.set({ index: 0 });

  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: displayNotes,
      args: [all, tab.url],
    });

    function displayNotes(all, url) {
      chrome.runtime.sendMessage({ print: true, data: "allnotes" });
      chrome.runtime.sendMessage({ print: true, data: all });
      var elements = Array(all.length);
      var highlights = Array(all.length);
      var divs = Array(all.length);

      for (var index = 0; index < all.length; index++) {
        var note = all[index];
        chrome.runtime.sendMessage({ print: true, data: note });
        if (note.website === url) {
          var left = note.oRect.left;
          var top = note.oRect.top;

          highlights[index] = document.createElement("div");
          highlights[index].id = "web-notes-chrome-ext-hg-" + note.index;
          highlights[index].style.width = note.oRect.width + "px";
          highlights[index].style.height = note.oRect.height + 10 + "px";
          highlights[index].style.background = "#bf40bf";
          highlights[index].style.opacity = 0.25;
          highlights[index].style.position = "absolute";
          highlights[index].style.zIndex = "50";
          highlights[index].style.top = top + "px";
          highlights[index].style.left = left + "px";
          highlights[index].style.cursor = "pointer";

          divs[index] = document.createElement("div");
          divs[index].id = "web-notes-chrome-ext-" + note.index;
          divs[index].style.position = "absolute";
          divs[index].style.zIndex = "50";
          divs[index].style.top = top + "px";
          divs[index].style.left = Math.min(window.innerWidth - 250, left + note.oRect.width + 10) + "px";
          divs[index].style.borderRadius = "5px";
          divs[index].style.padding = "5px";
          divs[index].style.paddingTop = "30px";
          divs[index].style.background = "rgba(56,161,197,0.62)";
          divs[index].style.boxShadow = "2px 2px 8px rgba(0,0,0,0.6)";
          divs[index].style.visibility = "hidden";

          var textarea = document.createElement("textarea");
          textarea.style.height = "100px";
          textarea.style.color = "white";
          textarea.style.background = "rgba(56,161,197)";
          textarea.style.paddingLeft = "2px";
          textarea.style.fontWeight = "bold";
          textarea.style.marginRight = "-40px";
          textarea.style.fontSize = "16px";
          textarea.value = note.content;

          var button = document.createElement("button");
          button.style.float = "right";
          button.innerHTML = "&#10006;";
          button.style.position = "relative";
          button.style.top = "-25px";
          button.style.right = "10px";
          button.style.color = "white";
          button.style.margin = "0px";
          button.onclick = function close() {
            elements[index].style.visibility = "hidden";
          };

          var save = document.createElement("img");
          save.style.float = "right";
          save.innerHTML = "&#10006;";
          save.style.position = "relative";
          save.style.top = "-20px";
          save.style.right = "40px";
          save.style.color = "white";
          save.style.margin = "0px";
          save.style.width = "16px";
          save.style.cursor = "pointer";
          save.onclick = function sav() {
            // save content

            var updatedNote = {
              index: note.index,
              website: url,
              text: note.text,
              oRect: note.oRect,
              content: textarea.value ? textarea.value : note.content,
            };
            all[index] = updatedNote;
            chrome.storage.sync.set({ allnotes: all });

            chrome.runtime.sendMessage({ print: true, data: "save in bg" });
            chrome.runtime.sendMessage({ print: true, data: all });
          };
          save.src =
            "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTFsNSA1djExYTIgMiAwIDAgMS0yIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBjbGFzcz0ic3Ryb2tlLTAwMDAwMCI+PC9wYXRoPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNyAyMXYtOEg3djhNNyAzdjVoOCIgY2xhc3M9InN0cm9rZS0wMDAwMDAiPjwvcGF0aD48L3N2Zz4=";

          var img = document.createElement("img");
          img.style.float = "right";
          img.innerHTML = "&#10006;";
          img.style.position = "relative";
          img.style.top = "-20px";
          img.style.right = "25px";
          img.style.color = "white";
          img.style.margin = "0px";
          img.style.width = "16px";
          img.style.cursor = "pointer";
          img.onclick = function del() {
            // delete note
          };
          img.src =
            "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSJMYXllciAxNyI+PHBhdGggZD0iTTI0IDMxSDhhMyAzIDAgMCAxLTMtM1Y5YTEgMSAwIDAgMSAyIDB2MTlhMSAxIDAgMCAwIDEgMWgxNmExIDEgMCAwIDAgMS0xVjlhMSAxIDAgMCAxIDIgMHYxOWEzIDMgMCAwIDEtMyAzWk0yOCA3SDRhMSAxIDAgMCAxIDAtMmgyNGExIDEgMCAwIDEgMCAyWiIgZmlsbD0iI2ZmZmZmZiIgY2xhc3M9ImZpbGwtMTAxODIwIj48L3BhdGg+PHBhdGggZD0iTTIwIDdhMSAxIDAgMCAxLTEtMVYzaC02djNhMSAxIDAgMCAxLTIgMFYyYTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxdjRhMSAxIDAgMCAxLTEgMVpNMTYgMjZhMSAxIDAgMCAxLTEtMVYxMWExIDEgMCAwIDEgMiAwdjE0YTEgMSAwIDAgMS0xIDFaTTIxIDI0YTEgMSAwIDAgMS0xLTFWMTNhMSAxIDAgMCAxIDIgMHYxMGExIDEgMCAwIDEtMSAxWk0xMSAyNGExIDEgMCAwIDEtMS0xVjEzYTEgMSAwIDAgMSAyIDB2MTBhMSAxIDAgMCAxLTEgMVoiIGZpbGw9IiNmZmZmZmYiIGNsYXNzPSJmaWxsLTEwMTgyMCI+PC9wYXRoPjwvZz48L3N2Zz4=";

          divs[index].appendChild(button);
          divs[index].appendChild(img);
          divs[index].appendChild(save);
          divs[index].appendChild(textarea);
          document.body.appendChild(divs[index]);

          highlights[index].onclick = function () {
            var i = this.id.slice(24, 100000);
            if (document.getElementById("web-notes-chrome-ext-" + i).style.visibility === "visible") {
              document.getElementById("web-notes-chrome-ext-" + i).style.visibility = "hidden";
            } else {
              document.getElementById("web-notes-chrome-ext-" + i).style.visibility = "visible";
            }
            chrome.runtime.sendMessage({ print: true, data: "clicked again" });
          };
          document.body.appendChild(highlights[index]);

          // var highlight = document.createElement("div");
          // highlight.style.width = note.oRect.width + "px";
          // highlight.style.height = note.oRect.height + "px";
          // highlight.style.background = "#bf40bf";
          // highlight.style.opacity = 0.25;
          // highlight.style.position = "absolute";
          // highlight.style.zIndex = "50";
          // highlight.style.top = top + window.scrollY + "px";
          // highlight.style.left = left + "px";
          // highlight.style.cursor = "pointer";

          // var div = document.createElement("div");
          // div.id = "web-notes-chrome-ext-" + note.index;
          // div.style.position = "absolute";
          // div.style.zIndex = "50";
          // div.style.top = top + window.scrollY + "px";
          // div.style.left = Math.min(window.innerWidth - 250, left + note.oRect.width + 10) + "px";
          // div.style.borderRadius = "5px";
          // div.style.padding = "5px";
          // div.style.paddingTop = "30px";
          // div.style.background = "rgba(56,161,197,0.62)";
          // div.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.6)";

          // var textarea = document.createElement("textarea");
          // textarea.style.height = "100px";
          // textarea.style.color = "white";
          // textarea.style.background = "rgba(56,161,197)";
          // textarea.style.paddingLeft = "2px";
          // textarea.style.fontWeight = "bold";
          // textarea.style.marginRight = "-40px";
          // textarea.style.fontSize = "16px";
          // textarea.innerHTML = note.content;

          // var button = document.createElement("button");
          // button.style.float = "right";
          // button.innerHTML = "&#10006;";
          // button.style.position = "relative";
          // button.style.top = "-25px";
          // button.style.right = "10px";
          // button.style.color = "white";
          // button.style.margin = "0px";
          // button.onclick = function close() {
          //   var element = document.getElementById("web-notes-chrome-ext-" + note.index);
          //   element.style.visibility = "hidden";
          // };

          // var save = document.createElement("img");
          // save.style.float = "right";
          // save.innerHTML = "&#10006;";
          // save.style.position = "relative";
          // save.style.top = "-20px";
          // save.style.right = "40px";
          // save.style.color = "white";
          // save.style.margin = "0px";
          // save.style.width = "16px";
          // save.style.cursor = "pointer";
          // save.onclick = function sav() {
          //   // save content
          // };
          // save.src =
          //   "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTFsNSA1djExYTIgMiAwIDAgMS0yIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBjbGFzcz0ic3Ryb2tlLTAwMDAwMCI+PC9wYXRoPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNyAyMXYtOEg3djhNNyAzdjVoOCIgY2xhc3M9InN0cm9rZS0wMDAwMDAiPjwvcGF0aD48L3N2Zz4=";

          // var img = document.createElement("img");
          // img.style.float = "right";
          // img.innerHTML = "&#10006;";
          // img.style.position = "relative";
          // img.style.top = "-20px";
          // img.style.right = "25px";
          // img.style.color = "white";
          // img.style.margin = "0px";
          // img.style.width = "16px";
          // img.style.cursor = "pointer";
          // img.onclick = function del() {
          //   // delete note
          // };
          // img.src =
          //   "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSJMYXllciAxNyI+PHBhdGggZD0iTTI0IDMxSDhhMyAzIDAgMCAxLTMtM1Y5YTEgMSAwIDAgMSAyIDB2MTlhMSAxIDAgMCAwIDEgMWgxNmExIDEgMCAwIDAgMS0xVjlhMSAxIDAgMCAxIDIgMHYxOWEzIDMgMCAwIDEtMyAzWk0yOCA3SDRhMSAxIDAgMCAxIDAtMmgyNGExIDEgMCAwIDEgMCAyWiIgZmlsbD0iI2ZmZmZmZiIgY2xhc3M9ImZpbGwtMTAxODIwIj48L3BhdGg+PHBhdGggZD0iTTIwIDdhMSAxIDAgMCAxLTEtMVYzaC02djNhMSAxIDAgMCAxLTIgMFYyYTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxdjRhMSAxIDAgMCAxLTEgMVpNMTYgMjZhMSAxIDAgMCAxLTEtMVYxMWExIDEgMCAwIDEgMiAwdjE0YTEgMSAwIDAgMS0xIDFaTTIxIDI0YTEgMSAwIDAgMS0xLTFWMTNhMSAxIDAgMCAxIDIgMHYxMGExIDEgMCAwIDEtMSAxWk0xMSAyNGExIDEgMCAwIDEtMS0xVjEzYTEgMSAwIDAgMSAyIDB2MTBhMSAxIDAgMCAxLTEgMVoiIGZpbGw9IiNmZmZmZmYiIGNsYXNzPSJmaWxsLTEwMTgyMCI+PC9wYXRoPjwvZz48L3N2Zz4=";

          // div.appendChild(button);
          // div.appendChild(img);
          // div.appendChild(save);
          // div.appendChild(textarea);
          // document.body.appendChild(div);
          // // chrome.runtime.sendMessage({ print: true, data: document.getElementById("web-notes-chrome-ext-" + (i + 1)) });

          // highlight.onclick = function toggle() {
          //   chrome.runtime.sendMessage({
          //     print: true,
          //     data: document.getElementById("web-notes-chrome-ext-" + note.index),
          //   });
          //   var element = document.getElementById("web-notes-chrome-ext-" + note.index);
          //   if (element.style.visibility === "visible") {
          //     element.style.visibility = "hidden";
          //   } else {
          //     element.style.visibility = "visible";
          //   }
          // };
          // document.body.appendChild(highlight);
        }
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.print) {
    printData = request.data;
    console.log(printData);
  }
});
