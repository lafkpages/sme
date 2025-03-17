import { parse } from "cookie";

import { BitArray } from "../shared/bitArray";

let refWidth = 0;
const charTests: HTMLElement[] = [];

const charTestIndicator = document.getElementById("char-test-indicator")!;

const cookies = parse(document.cookie);

if (cookies["charTestId"]) {
  charTestIndicator.className = "char-test-indicator-already";
} else {
  await setupCharTest();
  await doCharTest();
}

function zeroTimeout() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function setupCharTest() {
  const charTestRef = document.createElement("span");
  charTestRef.className = "char-test";
  charTestRef.textContent = "abcd";
  document.body.appendChild(charTestRef);

  await zeroTimeout();

  refWidth = charTestRef.getBoundingClientRect().width;

  for (let i = 0; i < 128; i++) {
    const charTest = document.createElement("span");
    charTest.className = "char-test";
    document.body.appendChild(charTest);
    charTests.push(charTest);
  }
}

async function doCharTest() {
  try {
    if (!refWidth) {
      throw new Error("Char test not set up");
    }

    console.debug("Char test start");
    charTestIndicator.className = "char-test-indicator-running";

    let charCode = 0;

    const chars = new BitArray();

    const startTime = performance.now();
    while (charCode < 0xffff) {
      for (let i = 0; i < 128; i++) {
        charTests[i].textContent = `ab${String.fromCharCode(charCode + i)}cd`;
      }

      await zeroTimeout();

      for (let i = 0; i < 128; i++) {
        const testWidth = charTests[i].getBoundingClientRect().width;

        if (testWidth === refWidth) {
          const code = charCode + i;
          console.debug("Char", code, "is invisible");
          chars.set(BigInt(code), true);
        }
      }

      charCode += 128;
    }
    const endTime = performance.now();

    console.debug("Char test end", endTime - startTime);

    if (chars.buffer) {
      const resp = await fetch("/api/invis-chars", {
        method: "POST",
        body: chars.toUint8Array(8192),
      });

      if (resp.status === 201) {
        charTestIndicator.className = "char-test-indicator-success";
      } else if (resp.status === 503) {
        charTestIndicator.className = "char-test-indicator-disabled";
      } else {
        throw new Error("Char test request failed");
      }
    } else {
      charTestIndicator.className = "char-test-indicator-empty";
    }
  } catch (err) {
    charTestIndicator.className = "char-test-indicator-fail";
    throw err;
  }
}
