import { error } from '@sveltejs/kit';
import { ensureAuthed } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, platform }) => {
	if (!platform) {
		error(500);
	}

	if (platform.env.DISABLE_INVIS_CHARS_ENDPOINT) {
		error(503);
	}

	ensureAuthed(cookies, platform);

	const { testsCount } = (await platform.env.InvisCharsDB.prepare(
		`--sql
            SELECT count(*) AS testsCount FROM tests
        `
	).first<{ testsCount: number }>())!;

	const { results: stats } = await platform.env.InvisCharsDB.prepare(
		`--sql
            SELECT
                charCode as id,
                browserNameCount,
                cpuArchitectureCount,
                deviceModelCount,
                deviceVendorCount,
                engineNameCount,
                osNameCount,
                (browserNameCount + cpuArchitectureCount + deviceModelCount + deviceVendorCount + engineNameCount + osNameCount) AS totalCount,
                (browserNameCount * 3 + osNameCount * 2 + deviceModelCount) AS score
            FROM charsStats WHERE totalCount > 0 ORDER BY id ASC
        `
	).all<{
		id: number;
		browserNameCount: number;
		cpuArchitectureCount: number;
		deviceModelCount: number;
		deviceVendorCount: number;
		engineNameCount: number;
		osNameCount: number;
		totalCount: number;
		score: number;
	}>();

	return { testsCount, stats };
};
