(() => {
const one = "\u200B";
const zero = "\u200C";
const oneone = "\u200E";
const zerozero = "\u200F";
const onezero = "\u2061";
const zeroone = "\u2062";
const zerozerozero = "\u2063";
const oneoneone = "\u2064";

const secretsRegEx = new RegExp(
  `[${zerozerozero}${oneoneone}${zerozero}${oneone}${zeroone}${onezero}${zero}${one}]+`
);

function stringToBin(s) {
  let b = "";

  for (const c of s) {
    b += c.charCodeAt(0).toString(2).padStart(8, 0);
  }

  return b;
}

function binToString(b) {
  let s = "";

  for (const c of b.match(/[01]{8}/g)) {
    s += String.fromCharCode(parseInt(c, 2));
  }

  return s;
}

function stringToSecretBin(s, compress = true) {
  let b = stringToBin(s);

  if (compress) {
    b = b.replace(/000/g, zerozerozero);
    b = b.replace(/111/g, oneoneone);

    b = b.replace(/01/g, zeroone);
    b = b.replace(/10/g, onezero);

    b = b.replace(/00/g, zerozero);
    b = b.replace(/11/g, oneone);
  }

  b = b.replace(/0/g, zero);
  b = b.replace(/1/g, one);

  return b;
}

function secretBinToString(b) {
  b = b.replace(new RegExp(zerozerozero, "g"), "000");
  b = b.replace(new RegExp(oneoneone, "g"), "111");

  b = b.replace(new RegExp(zeroone, "g"), "01");
  b = b.replace(new RegExp(onezero, "g"), "10");

  b = b.replace(new RegExp(zerozero, "g"), "00");
  b = b.replace(new RegExp(oneone, "g"), "11");

  b = b.replace(new RegExp(zero, "g"), "0");
  b = b.replace(new RegExp(one, "g"), "1");

  b = binToString(b);

  return b;
}

function encodeSecret(visible, secret, compress = false) {
  const s = stringToSecretBin(secret, compress);

  return `${visible[0] || ""}${s}${visible.substr(1)}`;
}

function decodeSecret(s) {
  s = s.match(secretsRegEx)[0];

  return secretBinToString(s);
}

  // Inject top right SME notif
  const div = document.createElement('div');
  div.id = 'sme-inject-notif';
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.padding = '10px';
  div.style.zIndex = '99999';
  div.style.background = 'wheat';
  div.style.border = '1px solid black';
  div.style.borderRadius = '5px';
  div.style.transition = 'transform 0.5s ease-in-out 0s';
  div.style.transform = 'translateY(-100px)';
  document.body.appendChild(div);

  // Check for selected SME text
  setInterval(() => {
    const selectedText = window.getSelection().toString();
    let decodedSecret = null;

    if (selectedText) {
      try {
        decodedSecret = decodeSecret(selectedText);
      } catch {
        
      }
    }

    if (decodedSecret) {
      div.style.transform = 'translateY(0px)';
      div.textContent = decodedSecret;
    } else {
      div.style.transform = 'translateY(-100px)';
    }
  }, 1000);
})();