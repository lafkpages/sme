import { BitArray } from "./bitArray";

const charTestRef = document.createElement("span");
charTestRef.className = "char-test";
charTestRef.textContent = "abcd";
document.body.appendChild(charTestRef);

function zeroTimeout() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

await zeroTimeout();

const refWidth = charTestRef.getBoundingClientRect().width;

const charTests: HTMLElement[] = [];
for (let i = 0; i < 128; i++) {
  const charTest = document.createElement("span");
  charTest.className = "char-test";
  document.body.appendChild(charTest);
  charTests.push(charTest);
}

const ws = new WebSocket("/invis-chars");

await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

console.debug("Char test start");

let charCode = 0;
const startTime = performance.now();
while (charCode < 0xffff) {
  for (let i = 0; i < 128; i++) {
    charTests[i].textContent = `ab${String.fromCharCode(charCode + i)}cd`;
  }

  await zeroTimeout();

  const chars = new BitArray();
  for (let i = 0; i < 128; i++) {
    const testWidth = charTests[i].getBoundingClientRect().width;

    if (testWidth === refWidth) {
      chars.set(BigInt(i), 1);
    }
  }

  if (chars.buffer) {
    console.debug(chars.buffer);
    const charsBuf = chars.toUint8Array(18);

    // Last two bytes are the char code
    charsBuf[16] = charCode & 0xff;
    charsBuf[17] = charCode >> 8;

    ws.send(charsBuf);
  }

  charCode += 128;
}
const endTime = performance.now();

ws.close();
console.debug("Char test end", endTime - startTime);
