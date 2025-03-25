import { getCharTestId } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	return {
		charTestId: getCharTestId(cookies)
	};
};
