import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform) {
		error(500);
	}

	if (platform.env.DISABLE_INVIS_CHARS_ENDPOINT) {
		error(503);
	}

	// const { authError } = ensureAuthed(context);
	// if (authError) {
	// 	return authError;
	// }

	const { testsCount } = (await platform.env.InvisCharsDB.prepare(
		`--sql
            SELECT count(*) AS testsCount FROM tests
        `
	).first<{ testsCount: number }>())!;

	const { results: stats } = await platform.env.InvisCharsDB.prepare(
		`--sql
            SELECT
                charCode,
                browserNameCount,
                cpuArchitectureCount,
                deviceModelCount,
                deviceVendorCount,
                engineNameCount,
                osNameCount,
                (browserNameCount + cpuArchitectureCount + deviceModelCount + deviceVendorCount + engineNameCount + osNameCount) AS totalCount,
                (browserNameCount * 3 + osNameCount * 2 + deviceModelCount) AS score
            FROM charsStats WHERE totalCount > 0 ORDER BY charCode ASC
        `
	).all<{
		charCode: number;
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
