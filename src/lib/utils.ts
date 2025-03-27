import type { Cookies } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';

export function getCharTestId(cookies: Cookies) {
	const charTestId = parseInt(cookies.get('charTestId') || '');

	return isNaN(charTestId) ? null : charTestId;
}

export function ensureAuthed(cookies: Cookies, platform: Readonly<App.Platform>) {
	if (!platform.env.SECRET) {
		return;
	}

	const smeAuth = cookies.get('smeAuth');

	if (smeAuth !== platform.env.SECRET) {
		error(401);
	}
}

export function rmsDiff(data1: ImageData, data2: ImageData) {
	if (data1.width !== data2.width || data1.height !== data2.height) {
		throw new Error('Image dimensions do not match');
	}

	var squares = 0;
	for (var i = 0; i < data1.data.length; i++) {
		squares += (data1.data[i] - data2.data[i]) * (data1.data[i] - data2.data[i]);
	}
	var rms = Math.sqrt(squares / data1.data.length);
	return rms;
}
