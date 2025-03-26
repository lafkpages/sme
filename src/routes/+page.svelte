<script lang="ts">
	import { page } from '$app/state';
	import { decodeSecret, encodeSecret } from '$lib/encoders';
	import { Checkbox, CopyButton, TextArea } from 'carbon-components-svelte';

	let encodeVisibleValue = $state('');
	let encodeSecretValue = $state('');
	let encodeCompress = $state(true);
	let encodedResult = $derived(encodeSecret(encodeVisibleValue, encodeSecretValue, encodeCompress));

	let decodeMessage = $state(
		page.url.searchParams.get('shareText') ||
			page.url.searchParams.get('shareTitle') ||
			page.url.searchParams.get('shareUrl') ||
			''
	);
	let decodedResult = $derived(decodeSecret(decodeMessage));

	function resizeTextarea(this: HTMLTextAreaElement) {
		this.style.height = '0px';
		this.style.height = this.scrollHeight + 'px';
	}
</script>

<svelte:head>
	<title>Secret Message Encoder</title>
</svelte:head>

<svelte:document
	onclick={(e) => {
		const btn = e.target;

		if (!(btn instanceof HTMLButtonElement) || !btn.matches('button.copy[data-copy]')) return;

		const elm = document.getElementById(btn.dataset.copy!);

		if (!(elm instanceof HTMLTextAreaElement)) {
			return;
		}

		elm.select();
		elm.setSelectionRange(0, null);

		navigator.clipboard.writeText(elm.value);

		btn.innerText = 'Copied!';

		setTimeout(() => {
			btn.innerText = 'Copy';
		}, 1500);
	}}
/>

<h2>Encode message</h2>

<TextArea
	labelText="Visible message"
	placeholder="Enter a message..."
	bind:value={encodeVisibleValue}
	oninput={resizeTextarea}
/>

<TextArea
	labelText="Secret message"
	placeholder="Enter a message..."
	bind:value={encodeSecretValue}
	oninput={resizeTextarea}
/>

<br />

<Checkbox
	labelText="Compress?"
	title="Compressing makes the encoded message smaller, so you can send longer messages"
	bind:checked={encodeCompress}
/>

<hr />

<TextArea labelText="Encoded message" readonly value={encodedResult} />
<CopyButton text={encodedResult} />

<p>
	Encoded message length:
	<span id="encode-length">{encodedResult.length}</span>
</p>

<h2>Decode message</h2>

<TextArea
	labelText="Encoded message"
	placeholder="Enter an encoded message..."
	bind:value={decodeMessage}
	oninput={resizeTextarea}
/>

<hr />

<TextArea
	labelText="Decoded secret"
	placeholder="The secret message..."
	readonly
	value={decodedResult}
/>
<CopyButton text={decodedResult || ''} disabled={!decodedResult} />
