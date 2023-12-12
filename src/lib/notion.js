import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';
import { NOTION_DATABASEID_1 } from '$env/static/private';

const notion = new Client({ auth: env.NOTION_SECRET });

/** @typedef {"A001"} ItemId */
/** @typedef {"Bin Clear Sm" | "Bin Clear Lg" | "Basket" | "Shelf" | "Bin Black XL" } ItemContainer */
/** @typedef {`${ItemId},${ItemContainer}`} RawScan*/

/**
 * @typedef {Object} ScannedItem
 * @prop {string} Name
 * @prop {string[]} Tags
 * @prop {ItemId} ID
 * @prop {ItemContainer} ContainerType
 * @prop {string} [Description]
 * @prop {string} [Source]
 * @prop {string} [PartNumber]
 */

/**
 * @param {RawScan} scanData - a string like "A001,Basket"
 * @returns {Promise<ScannedItem>} returns a
 */
export async function scanItem(scanData) {
	//TODO make this runtime checkable? Enums?
	const [ID, ContainerType] = /** @type { [ItemId, ItemContainer] } */ (scanData.split(','));
	//TODO check if page exists

	/** @type ScannedItem */
	const item = {
		ID,
		ContainerType,
		Name: 'Test Name',
		Tags: ['one', 'two']
	};
	return item;
}

// iterate over database object example:
// Object.entries(database.properties).forEach(([propertyName, propertyValue]) => {
// 	console.log(`${propertyName}: ${propertyValue.type}`);
// });
export async function getDatabase() {
	const databaseObject = await notion.databases.retrieve({
		database_id: NOTION_DATABASEID_1
	});
	// console.log('[NOTION] database object:', databaseObject);
	return databaseObject;
}

/** @param {ItemId} ID */
export async function findPageInDatabase(ID) {
	const queryResult = await notion.databases.query({
		database_id: NOTION_DATABASEID_1,
		filter: {
			property: 'ID',
			rich_text: {
				equals: ID
			}
		}
	});
	// console.log('[Notion] database query result: ', queryResult);
	return queryResult.results;
}

/** @param {ScannedItem} item */
export async function getItemPage(item) {
	const queryResult = await findPageInDatabase(item.ID);
	if (queryResult.length > 1) throw new Error(`Multiple entries for Item ID: ${item.ID}`);
	if (queryResult.length === 0) {
		// page does not exist, create a new one
		// createPage();
	} else {
		// (exactly 1 result)
		// page exists, modify it
		if ('properties' in queryResult[0]) {
			console.log('[NOTION] page properties:', queryResult[0]?.properties);
		}
	}
}

//HACK this is for testing!!
(async () => {
	try {
		await scanItem('A001,Basket');
	} catch (e) {
		console.error(e);
	}
})();

export async function createPage() {
	const response = await notion.pages.create({
		parent: {
			type: 'database_id',
			database_id: NOTION_DATABASEID_1
		},
		properties: {
			'Grocery item': {
				type: 'title',
				title: [
					{
						type: 'text',
						text: {
							content: 'Tomatoes'
						}
					}
				]
			},
			Price: {
				type: 'number',
				number: 1.49
			},
			'Last ordered': {
				type: 'date',
				date: {
					start: '2021-05-11'
				}
			}
		}
	});
	console.log(response);
}
