<script lang="ts">
	import { page } from '$app/state';
	import { decodeSecret, encodeSecret } from '$lib/encoders';

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

<!-- TODO: missing <title>? -->

<a href="https://youtu.be/aJISpi8E6gU" target="_blank" rel="noopener noreferer" id="demo-video">
	Demo video
</a>
<a href="https://github.com/lafkpages/sme" target="_blank" rel="noopener noreferrer"> GitHub </a>

<div id="encode" class="outlined">
	<h2>Encode message</h2>

	<textarea
		id="encode-visible"
		cols="30"
		placeholder="Enter the visible message..."
		bind:value={encodeVisibleValue}
		oninput={resizeTextarea}
	></textarea>

	<textarea
		id="encode-secret"
		cols="30"
		placeholder="Enter the secret message..."
		bind:value={encodeSecretValue}
		oninput={resizeTextarea}
	></textarea>

	<br />

	<input type="checkbox" id="encode-compress" bind:checked={encodeCompress} />
	<label
		for="encode-compress"
		title="Compressing makes the encoded message smaller, so you can send longer messages"
		>Compress?</label
	>

	<hr />

	<textarea
		id="encode-output"
		cols="30"
		placeholder="Encoded message"
		readonly
		value={encodedResult}
	></textarea>

	<button class="copy" data-copy="encode-output">Copy</button>

	<p>
		Encoded message length:
		<span id="encode-length">{encodedResult.length}</span>
	</p>
</div>

<div id="decode" class="outlined">
	<h2>Decode message</h2>

	<textarea
		id="decode-message"
		cols="30"
		rows="10"
		placeholder="The encoded message..."
		bind:value={decodeMessage}
		oninput={resizeTextarea}
	></textarea>

	<hr />

	<textarea
		id="decode-output"
		cols="30"
		rows="10"
		placeholder="Decoded secret"
		readonly
		value={decodedResult}
	></textarea>

	<button class="copy" data-copy="decode-output">Copy</button>
</div>

<style>
	div#encode h2,
	div#decode h2 {
		margin-block-start: 0px;
		margin-inline-start: 0px;
	}

	div#encode textarea,
	div#decode textarea {
		min-height: 30px;
		max-width: calc(100% - 10px);

		height: 50px;
	}

	@media (orientation: portrait) {
		div#encode textarea,
		div#decode textarea {
			resize: vertical;
		}
	}

	@media (orientation: landscape) {
		div#encode hr,
		div#decode hr {
			max-width: 600px;
			margin-left: 0px;
		}
	}

	div#encode button,
	div#decode button {
		margin-top: 10px;
	}

	div#encode textarea#encode-output,
	div#decode textarea#decode-output {
		margin-bottom: 0px;
	}

	div#encode input#encode-compress {
		margin-right: -5px;
	}

	div#encode span#encode-length {
		display: inline-block;
		margin-top: 10px;
	}

	div#encode textarea {
		margin-bottom: 10px;
	}
</style>
