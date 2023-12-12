import { getDatabase } from '$lib/notion';

/** @type {import('./$types').PageServerLoad} */
// export async function load({cookies}) {
// const dbId = cookies.get('dbId');
export async function load() {
	return {
		db: (await getDatabase()) ?? {}
	};
}

// export const actions = {
// 	default: async ({ request }) => {
// 		const data = request.formData();
// 	}
// };
