import { error, type Cookies } from '@sveltejs/kit';

export function getCharTestId(cookies: Cookies) {
	const charTestId = parseInt(cookies.get('charTestId') || '');

	return isNaN(charTestId) ? null : charTestId;
}

export function ensureAuthed(cookies: Cookies, platform: Readonly<App.Platform>) {
	const smeAuth = cookies.get('smeAuth');

	if (smeAuth !== platform.env.SECRET) {
		error(401);
	}
}
