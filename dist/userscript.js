// ==UserScript==
// @name         Secret Message Encoder
// @name:de      Geheime Nachrichten Kodierer
// @namespace    https://lafkpages.tech
// @version      0.1
// @description  Encodes a secret message inside another.
// @author       LuisAFK
// @match        *://*/*
// @icon         https://secret-message-encoder.luisafk.repl.co/favicon96.png
// @website      https://secret-message-encoder.luisafk.repl.co
// @grant        none
// @supportURL   https://github.com/lafkpages/sme/issues
// @run-at       document-idle
// ==/UserScript==

(()=>{const r="\u200b";const c="\u200c";const o="\u200e";const s="\u200f";const l="\u2061";const a="\u2062";const p="\u2063";const g="\u2064";const t=new RegExp(`[${p}${g}${s}${o}${a}${l}${c}${r}]+`);function i(e){let t="";for(const n of e){t+=n.charCodeAt(0).toString(2).padStart(8,0)}return t}function n(e){let t="";for(const n of e.match(/[01]{8}/g)){t+=String.fromCharCode(parseInt(n,2))}return t}function f(e,t=true){let n=i(e);if(t){n=n.replace(/000/g,p);n=n.replace(/111/g,g);n=n.replace(/01/g,a);n=n.replace(/10/g,l);n=n.replace(/00/g,s);n=n.replace(/11/g,o)}n=n.replace(/0/g,c);n=n.replace(/1/g,r);return n}function d(e){e=e.replace(new RegExp(p,"g"),"000");e=e.replace(new RegExp(g,"g"),"111");e=e.replace(new RegExp(a,"g"),"01");e=e.replace(new RegExp(l,"g"),"10");e=e.replace(new RegExp(s,"g"),"00");e=e.replace(new RegExp(o,"g"),"11");e=e.replace(new RegExp(c,"g"),"0");e=e.replace(new RegExp(r,"g"),"1");e=n(e);return e}function e(e,t,n=false){const r=f(t,n);return`${e[0]||""}${r}${e.substr(1)}`}function u(e){e=e.match(t)[0];return d(e)}const x="translateY(calc(-100% - 50px))";const y=document.createElement("div");y.id="sme-inject-notif";y.style.position="fixed";y.style.top="20px";y.style.right="20px";y.style.padding="10px";y.style.zIndex="99999";y.style.background="wheat";y.style.border="1px solid black";y.style.borderRadius="5px";y.style.transition="transform 0.5s ease-in-out 0s";y.style.transform=x;y.style.whiteSpace="pre-line";document.body.appendChild(y);setInterval(()=>{const e=window.getSelection().toString();let t=null;if(e){try{t=u(e)}catch{}}if(t){y.style.transform="translateY(0px)";y.textContent=t}else{y.style.transform=x}},1e3)})();