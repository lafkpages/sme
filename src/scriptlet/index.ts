import { decodeSecret } from '$lib/encoders';

// Inject top right SME toast
const host = document.createElement('div');
host.id = 'sme-inject-toast-host';
const shadow = host.attachShadow({ mode: 'closed' });
const div = document.createElement('div');
div.id = 'sme-inject-toast';
shadow.appendChild(div);
document.body.appendChild(host);

const style = document.createElement('style');
style.textContent = `
  #sme-inject-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    z-index: 99999;
    background: wheat;
    border: 1px solid black;
    border-radius: 5px;
    transition: transform 0.5s ease-in-out 0s;
    transform: translateY(calc(-100% - 50px));
    white-space: pre-line;
  }

  #sme-inject-toast.show,
  #sme-inject-toast:hover {
    transform: translateY(0px);
  }
`;
shadow.appendChild(style);

// TODO: check for Shadow DOM support

document.addEventListener('select', onSelectionChange);
document.addEventListener('selectionchange', onSelectionChange);

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
		div.classList.add('show');
		div.textContent = decodedSecret;
	} else {
		div.classList.remove('show');
	}
}
