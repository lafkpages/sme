import type { RequestHandler } from './$types';
import type { D1PreparedStatement } from '@cloudflare/workers-types';

import { error } from '@sveltejs/kit';

import { UAParser } from 'ua-parser-js';

import { BitArray } from '$lib/bitArray';
import { getCharTestId } from '$lib/utils';

interface InvisCharsDBCharsRow {
	testId: number;
	charCode: number;
}

interface InvisCharsDBTestsRow {
	testId: number;
	timestamp: number;
	browserName: string | null;
	cpuArchitecture: string | null;
	deviceModel: string | null;
	deviceVendor: string | null;
	engineName: string | null;
	osName: string | null;
	userAgent: string;
}

export const POST: RequestHandler = async ({ platform, cookies, request }) => {
	if (!platform) {
		error(500);
	}

	if (platform.env.DISABLE_INVIS_CHARS_ENDPOINT) {
		error(503);
	}

	const uaString = request.headers.get('user-agent');
	if (!uaString) {
		error(400, 'Invalid User-Agent');
	}

	const charTestId = getCharTestId(cookies);

	if (typeof charTestId === 'number') {
		error(400, `Test already submitted: ${charTestId}`);
	}

	const data = await request.bytes();

	if (data.byteLength !== 16384) {
		error(400, `Invalid request body length: ${data.byteLength}`);
	}

	const chars = BitArray.fromUint8Array(data);

	if (!chars.buffer) {
		error(400, 'Empty test BitArray');
	}

	const ua = new UAParser(uaString);
	const uaBrowser = ua.getBrowser();
	const uaCPU = ua.getCPU();
	const uaDevice = ua.getDevice();
	const uaEngine = ua.getEngine();
	const uaOS = ua.getOS();

	const testResult = await platform.env.InvisCharsDB.prepare(
		`--sql
			INSERT INTO tests (
				timestamp,
				browserName,
				cpuArchitecture,
				deviceModel,
				deviceVendor,
				engineName,
				osName,
				userAgent
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING testId
		`
	)
		.bind(
			Date.now(),
			uaBrowser.name || null,
			uaCPU.architecture || null,
			uaDevice.model || null,
			uaDevice.vendor || null,
			uaEngine.name || null,
			uaOS.name || null,
			ua.getUA()
		)
		.run<InvisCharsDBTestsRow>();

	console.debug('INSERT INTO tests:', testResult);

	const testId = testResult.results[0].testId;

	const statements: D1PreparedStatement[] = [];
	for (let i = 0; i < 0xffff; i++) {
		if (chars.get(BigInt(i))) {
			statements.push(
				platform.env.InvisCharsDB.prepare(
					'INSERT INTO zeroWidthChars (testId, charCode) VALUES (?, ?)'
				).bind(testId, i)
			);
		}
	}
	for (let i = 0; i < 0xffff; i++) {
		if (chars.get(BigInt(i) + 0x10000n)) {
			statements.push(
				platform.env.InvisCharsDB.prepare(
					'INSERT INTO invisibleChars (testId, charCode) VALUES (?, ?)'
				).bind(testId, i)
			);
		}
	}

	await platform.env.InvisCharsDB.batch<InvisCharsDBCharsRow>(statements);

	cookies.set('charTestId', testId.toString(), { path: '/' });

	return new Response(null, {
		status: 201
	});
};
