const one = "\u200B";
const zero = "\u200C";
const oneone = "\u200E";
const zerozero = "\u200F";
const onezero = "\u2061";
const zeroone = "\u2062";
const zerozerozero = "\u2063";
const oneoneone = "\u2064";

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
  s = s.match(
    new RegExp(
      `[${zerozerozero}${oneoneone}${zerozero}${oneone}${zeroone}${onezero}${zero}${one}]+`
    )
  )[0];

  return secretBinToString(s);
}
