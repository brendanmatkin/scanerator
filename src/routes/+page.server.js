import { getDatabase } from '$lib/notion';
import { NOTION_DATABASEID_1 } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
// export async function load({cookies}) {
// const dbId = cookies.get('dbId');
export async function load() {
	return {
		db: (await getDatabase(NOTION_DATABASEID_1)) ?? {}
	};
}

// export const actions = {
// 	default: async ({ request }) => {
// 		const data = request.formData();
// 	}
// };
