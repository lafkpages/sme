const encodeDiv = document.querySelector('div#encode');
const encodeVis = document.querySelector('#encode-visible');
const encodeSec = document.querySelector('#encode-secret');
const encodeCom = document.querySelector('#encode-compress');
const encodeOut = document.querySelector('#encode-output');
const encodeLen = document.querySelector('span#encode-length');

const decodeDiv = document.querySelector('div#decode');
const decodeMes = document.querySelector('#decode-message');
const decodeOut = document.querySelector('#decode-output');

const parsedUrl = new URL(window.location);

let reg = null;

function resizeTextarea(elm) {
  elm.style.height = '0px';
  elm.style.height = elm.scrollHeight + "px";
}

function _encode(e = null)
{
  if (true || e) {
    resizeTextarea(encodeVis);
    resizeTextarea(encodeSec);
    resizeTextarea(encodeOut);
  }

  const encoded = encodeSecret(
    encodeVis.value,
    encodeSec.value,
    encodeCom.checked
  );

  encodeOut.value = encoded;
  encodeLen.innerText = encoded.length;

  localStorage.setItem('encodeVis', encodeVis.value);
  localStorage.setItem('encodeSec', encodeSec.value);
}

function _decode(e = null)
{
  if (true || e) {
    resizeTextarea(decodeMes);
    resizeTextarea(decodeOut);
  }

  try
  {
    decodeOut.value = decodeSecret(decodeMes.value);
  }
  catch (err)
  {
    decodeOut.value = '';
  }

  localStorage.setItem('decodeMes', decodeMes.value);
}

function _prevent(e)
{
  if (!e.code.includes('Arrow') && !e.ctrlKey && !e.metaKey && !e.shiftKey)
    e.preventDefault();
}

encodeVis.value = localStorage.getItem('encodeVis') || '';
encodeSec.value = localStorage.getItem('encodeSec') || '';
decodeMes.value = parsedUrl.searchParams.get('shareText') || parsedUrl.searchParams.get('shareTitle') || parsedUrl.searchParams.get('shareUrl') || localStorage.getItem('decodeMes') || '';

_encode();
_decode();

encodeVis.addEventListener('input', _encode);
encodeSec.addEventListener('input', _encode);
encodeCom.addEventListener('click', _encode);
encodeOut.addEventListener('keydown', _prevent);

decodeMes.addEventListener('input', _decode);
decodeOut.addEventListener('keydown', _prevent);

document.addEventListener('click', e => {
  if (!e.target.matches('button.copy[for]'))
  return;

  const btn = e.target;
  const elm = document.getElementById(btn.getAttribute('for'));

  elm.select();
  elm.setSelectionRange(0, 999999999999);

  navigator.clipboard.writeText(elm.value);

  btn.innerText = 'Copied!';

  setTimeout(() => {
    btn.innerText = 'Copy';
  }, 1500);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', e => {
    navigator.serviceWorker.register('/src/sw.js')
      .then(r => {
        reg = r;

        console.log('Registered service worker');
      })
      .catch(err => {
        console.error('Could not register service worker:', err);
      });
  });
}