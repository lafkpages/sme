import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url }) => {
	return {
		errorModal: url.searchParams.has('errorModal')
	};
};
