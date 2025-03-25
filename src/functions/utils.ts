/// <reference path="../../sme2/functions/types.d.ts" />

import { parse } from 'cookie';

export function parseCookies(request: Request) {
	const cookieString = request.headers.get('cookie');
	return parse(cookieString || '');
}

type Context = Parameters<PagesFunction<Env>>[0];

export function ensureAuthed(context: Context) {
	const cookies = parseCookies(context.request);

	if (cookies.smeAuth !== context.env.SECRET) {
		return { authError: new Response(null, { status: 401 }), cookies };
	}

	return { authError: null, cookies };
}
