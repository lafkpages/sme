const one = '\u200B';
const zero = '\u200C';
const oneOne = '\u200E';
const zeroZero = '\u200F';
const oneZero = '\u2061';
const zeroOne = '\u2062';
const zeroZeroZero = '\u2063';
const oneOneOne = '\u2064';

const secretsRegEx = new RegExp(
	`[${zeroZeroZero}${oneOneOne}${zeroZero}${oneOne}${zeroOne}${oneZero}${zero}${one}]+`
);

function stringToBin(s: string) {
	let b = '';

	for (const c of s) {
		const code = c.codePointAt(0);

		if (code === undefined) {
			break;
		}

		b += code.toString(2).padStart(8, '0');
	}

	return b;
}

function binToString(b: string) {
	const m = b.match(/[01]{8}/g);

	if (!m) {
		return null;
	}

	let s = '';
	for (const c of m) {
		s += String.fromCodePoint(parseInt(c, 2));
	}

	return s;
}

function stringToSecretBin(s: string, compress = true) {
	let b = stringToBin(s);

	if (compress) {
		b = b.replace(/000/g, zeroZeroZero);
		b = b.replace(/111/g, oneOneOne);

		b = b.replace(/01/g, zeroOne);
		b = b.replace(/10/g, oneZero);

		b = b.replace(/00/g, zeroZero);
		b = b.replace(/11/g, oneOne);
	}

	b = b.replace(/0/g, zero);
	b = b.replace(/1/g, one);

	return b;
}

function secretBinToString(b: string) {
	b = b.replace(new RegExp(zeroZeroZero, 'g'), '000');
	b = b.replace(new RegExp(oneOneOne, 'g'), '111');

	b = b.replace(new RegExp(zeroOne, 'g'), '01');
	b = b.replace(new RegExp(oneZero, 'g'), '10');

	b = b.replace(new RegExp(zeroZero, 'g'), '00');
	b = b.replace(new RegExp(oneOne, 'g'), '11');

	b = b.replace(new RegExp(zero, 'g'), '0');
	b = b.replace(new RegExp(one, 'g'), '1');

	return binToString(b);
}

export function encodeSecret(visible: string, secret: string, compress = false) {
	const s = stringToSecretBin(secret, compress);

	return `${visible[0] || ''}${s}${visible.slice(1)}`;
}

export function decodeSecret(s: string) {
	const b = s.match(secretsRegEx)?.[0];

	if (!b) {
		return null;
	}

	return secretBinToString(b);
}
