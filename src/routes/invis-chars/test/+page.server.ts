import type { PageServerLoad } from './$types';

import { getCharTestId } from '$lib/utils';

export const load: PageServerLoad = async ({ cookies }) => {
	return {
		charTestId: getCharTestId(cookies)
	};
};
