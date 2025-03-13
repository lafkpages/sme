import { decodeSecret } from "./encoders";

const hideTransform = "translateY(calc(-100% - 50px))";

// Inject top right SME toast
const host = document.createElement("div");
host.id = "sme-inject-toast";
const shadow = host.attachShadow({ mode: "closed" });
const div = document.createElement("div");
div.style.position = "fixed";
div.style.top = "20px";
div.style.right = "20px";
div.style.padding = "10px";
div.style.zIndex = "99999";
div.style.background = "wheat";
div.style.border = "1px solid black";
div.style.borderRadius = "5px";
div.style.transition = "transform 0.5s ease-in-out 0s";
div.style.transform = hideTransform;
div.style.whiteSpace = "pre-line";
shadow.appendChild(div);
document.body.appendChild(host);

// TODO: check for Shadow DOM support

document.addEventListener("select", onSelectionChange);
document.addEventListener("selectionchange", onSelectionChange);

function onSelectionChange() {
  let selectedText = window.getSelection()?.toString();
  if (!selectedText) {
    const elm = document.activeElement;

    if (elm instanceof HTMLTextAreaElement || elm instanceof HTMLInputElement) {
      if (elm.selectionStart !== null && elm.selectionEnd !== null) {
        selectedText = elm.value.slice(elm.selectionStart, elm.selectionEnd);
      }
    }
  }

  let decodedSecret: string | null = null;
  if (selectedText) {
    try {
      decodedSecret = decodeSecret(selectedText);
    } catch {}
  }

  if (decodedSecret) {
    div.style.transform = "translateY(0px)";
    div.textContent = decodedSecret;
  } else {
    div.style.transform = hideTransform;
  }
}
