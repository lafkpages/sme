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
div.style.whiteSpace = 'pre-line';
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
