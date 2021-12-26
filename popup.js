const deleteicon =
  "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSJMYXllciAxNyI+PHBhdGggZD0iTTI0IDMxSDhhMyAzIDAgMCAxLTMtM1Y5YTEgMSAwIDAgMSAyIDB2MTlhMSAxIDAgMCAwIDEgMWgxNmExIDEgMCAwIDAgMS0xVjlhMSAxIDAgMCAxIDIgMHYxOWEzIDMgMCAwIDEtMyAzWk0yOCA3SDRhMSAxIDAgMCAxIDAtMmgyNGExIDEgMCAwIDEgMCAyWiIgZmlsbD0iI2ZmZmZmZiIgY2xhc3M9ImZpbGwtMTAxODIwIj48L3BhdGg+PHBhdGggZD0iTTIwIDdhMSAxIDAgMCAxLTEtMVYzaC02djNhMSAxIDAgMCAxLTIgMFYyYTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxdjRhMSAxIDAgMCAxLTEgMVpNMTYgMjZhMSAxIDAgMCAxLTEtMVYxMWExIDEgMCAwIDEgMiAwdjE0YTEgMSAwIDAgMS0xIDFaTTIxIDI0YTEgMSAwIDAgMS0xLTFWMTNhMSAxIDAgMCAxIDIgMHYxMGExIDEgMCAwIDEtMSAxWk0xMSAyNGExIDEgMCAwIDEtMS0xVjEzYTEgMSAwIDAgMSAyIDB2MTBhMSAxIDAgMCAxLTEgMVoiIGZpbGw9IiNmZmZmZmYiIGNsYXNzPSJmaWxsLTEwMTgyMCI+PC9wYXRoPjwvZz48L3N2Zz4=";

var content = document.getElementById("content");

document.addEventListener("DOMContentLoaded", async () => {
  //   chrome.storage.sync.get("notes", ({ notes }) => {
  //     console.log(notes);
  //   });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: insertNote,
  });

  function insertNote() {
    s = window.getSelection();
    oRange = s.getRangeAt(0);
    oRect = oRange.getBoundingClientRect();
    var top = oRect["top"];
    var left = oRect["left"];

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
    // chrome.runtime.sendMessage({ print: true, data: { a: highlight } });
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = "50";
    div.style.top = top + window.scrollY + "px";
    div.style.left = Math.min(window.innerWidth - 250, left + oRect["width"] + 10) + "px";
    div.style.borderRadius = "5px";
    var textarea = document.createElement("textarea");
    textarea.style.height = "100px";
    textarea.style.color = "white";
    textarea.style.background = "rgba(56,161,197)";
    textarea.style.fontWeight = "bold";
    textarea.style.marginRight = "-25px";
    textarea.style.fontSize = "16px";
    div.style.padding = "5px";
    div.style.paddingTop = "30px";
    div.style.background = "rgba(56,161,197,0.62)";
    div.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.6)";
    var button = document.createElement("button");
    button.style.float = "right";
    button.innerHTML = "&#10006;";
    button.style.position = "relative";
    button.style.top = "-25px";
    button.style.right = "10px";
    button.style.color = "white";
    button.style.margin = "0px";
    button.onclick = function close() {
      // get and save content from the textarea
      div.style.visibility = "hidden";
    };
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
    div.appendChild(textarea);
    document.body.appendChild(div);

    highlight.onclick = function toggle() {
      if (div.style.visibility === "visible") {
        div.style.visibility = "hidden";
      } else {
        div.style.visibility = "visible";
      }
    };
    document.body.appendChild(highlight);
  }
});
