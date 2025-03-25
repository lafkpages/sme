import { D1Database } from '@cloudflare/workers-types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				BUN_VERSION: string;
				DISABLE_INVIS_CHARS_ENDPOINT: string;
				SECRET: string;
				InvisCharsDB: D1Database;
			};
		}
	}
}

export {};
