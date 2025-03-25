import type { Cookies } from '@sveltejs/kit';

export function getCharTestId(cookies: Cookies) {
	const charTestId = parseInt(cookies.get('charTestId') || '');

	return isNaN(charTestId) ? null : charTestId;
}
