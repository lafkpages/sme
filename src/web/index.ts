import { getBuildTimestamp } from "../../scripts/macros" with { type: "macro" };
import { decodeSecret, encodeSecret } from "../shared/encoders";

const encodeVis =
  document.querySelector<HTMLTextAreaElement>("#encode-visible")!;
const encodeSec =
  document.querySelector<HTMLTextAreaElement>("#encode-secret")!;
const encodeCom = document.querySelector<HTMLInputElement>("#encode-compress")!;
const encodeOut =
  document.querySelector<HTMLTextAreaElement>("#encode-output")!;
const encodeLen =
  document.querySelector<HTMLSpanElement>("span#encode-length")!;

const decodeDiv = document.querySelector<HTMLDivElement>("div#decode")!;
const decodeMes =
  document.querySelector<HTMLTextAreaElement>("#decode-message")!;
const decodeOut =
  document.querySelector<HTMLTextAreaElement>("#decode-output")!;

const parsedUrl = new URL(window.location.href);

let reg: ServiceWorkerRegistration | null = null;

function resizeTextarea(elm: HTMLTextAreaElement) {
  elm.style.height = "0px";
  elm.style.height = elm.scrollHeight + "px";
}

function _encode(e: Event | null = null) {
  if (true || e) {
    resizeTextarea(encodeVis);
    resizeTextarea(encodeSec);
    resizeTextarea(encodeOut);
  }

  const encoded = encodeSecret(
    encodeVis.value,
    encodeSec.value,
    encodeCom.checked,
  );

  encodeOut.value = encoded;
  encodeLen.innerText = encoded.length.toString();

  localStorage.setItem("encodeVis", encodeVis.value);
  localStorage.setItem("encodeSec", encodeSec.value);
}

function _decode(e: Event | null = null) {
  if (true || e) {
    resizeTextarea(decodeMes);
    resizeTextarea(decodeOut);
  }

  decodeOut.value = decodeSecret(decodeMes.value) || "";

  localStorage.setItem("decodeMes", decodeMes.value);
}

function _prevent(e: KeyboardEvent) {
  if (!e.code.includes("Arrow") && !e.ctrlKey && !e.metaKey && !e.shiftKey)
    e.preventDefault();
}

encodeVis.value = localStorage.getItem("encodeVis") || "";
encodeSec.value = localStorage.getItem("encodeSec") || "";
decodeMes.value =
  parsedUrl.searchParams.get("shareText") ||
  parsedUrl.searchParams.get("shareTitle") ||
  parsedUrl.searchParams.get("shareUrl") ||
  localStorage.getItem("decodeMes") ||
  "";

_encode();
_decode();

encodeVis.addEventListener("input", _encode);
encodeSec.addEventListener("input", _encode);
encodeCom.addEventListener("click", _encode);
encodeOut.addEventListener("keydown", _prevent);

decodeMes.addEventListener("input", _decode);
decodeOut.addEventListener("keydown", _prevent);

document.addEventListener("click", (e) => {
  const btn = e.target;

  if (!(btn instanceof HTMLButtonElement) || !btn.matches("button.copy[for]"))
    return;

  const elm = document.getElementById(btn.getAttribute("for")!);

  if (!(elm instanceof HTMLTextAreaElement)) {
    return;
  }

  elm.select();
  elm.setSelectionRange(0, null);

  navigator.clipboard.writeText(elm.value);

  btn.innerText = "Copied!";

  setTimeout(() => {
    btn.innerText = "Copy";
  }, 1500);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", (e) => {
    navigator.serviceWorker
      .register(`/sw-${getBuildTimestamp()}.js`, {
        scope: "/",
      })
      .then((r) => {
        reg = r;

        console.log("Registered service worker");
      })
      .catch((err) => {
        console.error("Could not register service worker:", err);
      });
  });
}
