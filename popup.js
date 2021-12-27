//@ts-check

const deleteicon =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSJMYXllciAxNyI+PHBhdGggZD0iTTI0IDMxSDhhMyAzIDAgMCAxLTMtM1Y5YTEgMSAwIDAgMSAyIDB2MTlhMSAxIDAgMCAwIDEgMWgxNmExIDEgMCAwIDAgMS0xVjlhMSAxIDAgMCAxIDIgMHYxOWEzIDMgMCAwIDEtMyAzWk0yOCA3SDRhMSAxIDAgMCAxIDAtMmgyNGExIDEgMCAwIDEgMCAyWiIgZmlsbD0iI2ZmZmZmZiIgY2xhc3M9ImZpbGwtMTAxODIwIj48L3BhdGg+PHBhdGggZD0iTTIwIDdhMSAxIDAgMCAxLTEtMVYzaC02djNhMSAxIDAgMCAxLTIgMFYyYTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxdjRhMSAxIDAgMCAxLTEgMVpNMTYgMjZhMSAxIDAgMCAxLTEtMVYxMWExIDEgMCAwIDEgMiAwdjE0YTEgMSAwIDAgMS0xIDFaTTIxIDI0YTEgMSAwIDAgMS0xLTFWMTNhMSAxIDAgMCAxIDIgMHYxMGExIDEgMCAwIDEtMSAxWk0xMSAyNGExIDEgMCAwIDEtMS0xVjEzYTEgMSAwIDAgMSAyIDB2MTBhMSAxIDAgMCAxLTEgMVoiIGZpbGw9IiNmZmZmZmYiIGNsYXNzPSJmaWxsLTEwMTgyMCI+PC9wYXRoPjwvZz48L3N2Zz4=";
const saveicon =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoMTFsNSA1djExYTIgMiAwIDAgMS0yIDJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBjbGFzcz0ic3Ryb2tlLTAwMDAwMCI+PC9wYXRoPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNyAyMXYtOEg3djhNNyAzdjVoOCIgY2xhc3M9InN0cm9rZS0wMDAwMDAiPjwvcGF0aD48L3N2Zz4=";
var i, all;

document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get("index", ({ index }) => {
    i = index;
  });
  chrome.storage.sync.get("allnotes", ({ allnotes }) => {
    all = allnotes;
  });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: insertNote,
    args: [i, tab.url, all],
  });

  function insertNote(i, url, all) {
    var s = window.getSelection();
    var oRange = s.getRangeAt(0);
    var oRect = oRange.getBoundingClientRect();
    var top = oRect["top"];
    var left = oRect["left"];
    chrome.runtime.sendMessage({ print: true, data: "initial" });
    chrome.runtime.sendMessage({ print: true, data: i });
    chrome.runtime.sendMessage({ print: true, data: all });

    var highlight = document.createElement("div");
    highlight.style.width = oRect["width"] + "px";
    highlight.style.height = oRect["height"] + "px";
    highlight.style.background = "#bf40bf";
    highlight.style.opacity = 0.25;
    highlight.style.position = "absolute";
    highlight.style.zIndex = "50";
    highlight.style.top = top + window.scrollY + "px";
    highlight.style.left = left + "px";
    highlight.style.cursor = "pointer";

    var div = document.createElement("div");
    div.id = "web-notes-chrome-ext-" + (i + 1);
    div.style.position = "absolute";
    div.style.zIndex = "50";
    div.style.top = top + window.scrollY + "px";
    div.style.left = Math.min(window.innerWidth - 250, left + oRect["width"] + 10) + "px";
    div.style.borderRadius = "5px";
    div.style.padding = "5px";
    div.style.paddingTop = "30px";
    div.style.background = "rgba(56,161,197,0.62)";
    div.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.6)";

    var textarea = document.createElement("textarea");
    textarea.style.height = "100px";
    textarea.style.color = "white";
    textarea.style.background = "rgba(56,161,197)";
    textarea.style.paddingLeft = "2px";
    textarea.style.fontWeight = "bold";
    textarea.style.marginRight = "-40px";
    textarea.style.fontSize = "16px";

    var button = document.createElement("button");
    button.style.float = "right";
    button.innerHTML = "&#10006;";
    button.style.position = "relative";
    button.style.top = "-25px";
    button.style.right = "10px";
    button.style.color = "white";
    button.style.margin = "0px";
    button.onclick = function close() {
      var element = document.getElementById("web-notes-chrome-ext-" + (i + 1));
      element.style.visibility = "hidden";
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

      var newNote = {
        index: i + 1,
        website: url,
        text: oRange.toString(),
        oRect: {
          width: oRect["width"],
          height: oRect["height"],
          top: oRect["top"] + window.scrollY,
          left: oRect["left"],
          bottom: oRect["bottom"],
          right: oRect["right"],
          x: oRect["x"],
          y: oRect["y"],
        },
        content: textarea.value ? textarea.value : "",
      };
      chrome.storage.sync.set({ index: i + 1 });
      all.push(newNote);
      chrome.storage.sync.set({ allnotes: all });

      chrome.runtime.sendMessage({ print: true, data: "save" });
      // chrome.runtime.sendMessage({ print: true, data: all.push(newNote) });
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

    div.appendChild(button);
    div.appendChild(img);
    div.appendChild(save);
    div.appendChild(textarea);
    document.body.appendChild(div);
    // chrome.runtime.sendMessage({ print: true, data: document.getElementById("web-notes-chrome-ext-" + (i + 1)) });

    highlight.onclick = function toggle() {
      var element = document.getElementById("web-notes-chrome-ext-" + (i + 1));
      if (element.style.visibility === "visible") {
        element.style.visibility = "hidden";
      } else {
        element.style.visibility = "visible";
      }
    };
    document.body.appendChild(highlight);
  }
});
