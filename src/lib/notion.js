import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';

const notion = new Client({ auth: env.NOTION_SECRET });

/** @param {string} database_id  */
export async function getDatabase(database_id) {
	const databaseObject = await notion.databases.retrieve({
		database_id
	});
	console.log('[NOTION] database object:', databaseObject);
	return databaseObject;
}
