import { Client } from "@notionhq/client";
import { env } from "$env/dynamic/private";
import { NOTION_DATABASEID_1 } from "$env/static/private";

const notion = new Client({ auth: env.NOTION_SECRET });

// import("@notionhq/client/build/src/api-endpoints").
/**
 * @typedef {import("@notionhq/client/build/src/api-endpoints").PageObjectResponse} NotionPage
 * @typedef {import("@notionhq/client/build/src/api-endpoints").CreatePageParameters} NotionCreatePage
 * @typedef {import("@notionhq/client/build/src/api-endpoints").DatabaseObjectResponse} NotionDatabase
 * @typedef {"A001" | "A002"} ItemId
 * @typedef {"Bin Clear Sm" | "Bin Clear Lg" | "Basket" | "Shelf" | "Bin Black XL" } ItemContainer
 * @typedef {`${ItemId},${ItemContainer}`} RawScan
 */

/**
 * @typedef {Object} ScannedItem
 * @prop {ItemId} ID
 * @prop {string[]} Tags
 * @prop {ItemContainer} ContainerType
 * @prop {string} [Description]
 * @prop {string} [Source]
 * @prop {string} [PartNumber]
 */

/** @type {NotionDatabase} */
export let currentDatabase;

/** @type {NotionPage} */
export let currentPage;

export let columnsToDisplay = [
	"Name",
	"Tags",
	"ID",
	"ContainerType",
	"Description",
	"Source",
	"PartNumber",
];

/**
 * Gets the database description and SCHEMA, not any of the actual content.
 * Database properties child object is the schema for the page properties
 * see https://developers.notion.com/reference/page-property-values
 * @returns {Promise<NotionDatabase>}
 */
export async function getDatabase(forceRefresh = false) {
	if (!currentDatabase || forceRefresh) {
		const databaseObject = await notion.databases.retrieve({
			database_id: NOTION_DATABASEID_1,
		});
		currentDatabase = /** @type {typeof currentDatabase} */ (databaseObject);
	}
	// console.log('[NOTION] database object:', databaseObject);
	return currentDatabase;
}

/** @param {ItemId} ID */
export async function findPageInDatabase(ID) {
	const queryResult = await notion.databases.query({
		database_id: NOTION_DATABASEID_1,
		filter: {
			property: "ID",
			rich_text: {
				equals: ID,
			},
		},
	});
	// console.log('[Notion] database query result: ', queryResult);
	return queryResult.results;
}

/**
 * @param {ScannedItem} item
 * //@returns {Promise<NotionPage>}
 */
export async function getItemPage(item) {
	const queryResult = await findPageInDatabase(item.ID);

	/** @type {NotionPage} */
	//let page;
	if (queryResult.length > 1) throw new Error(`Multiple entries for Item ID: ${item.ID}`);
	if (queryResult.length === 0) {
		// page does not exist, create a new one
		console.log("[NOTION] getItemPage - creating page...");
		currentPage = await createPage(item.ID);
	} else {
		// (exactly 1 result)
		// page exists, modify it
		console.log("[NOTION] getItemPage - page found!");
		currentPage = /** @type {NotionPage} */ (queryResult[0]);
	}
	console.log("[NOTION] page_id:", currentPage.id);
	if ("properties" in queryResult[0]) {
		console.log("[NOTION] page properties:", queryResult[0]?.properties);
	}
	return currentPage;
}

/**
 * @param {ItemId} itemId
 * @returns {Promise<NotionPage>}
 */
export async function createPage(itemId) {
	/** @type {NotionCreatePage["properties"]} */
	let properties = {};
	// make page from database schema
	Object.entries(currentDatabase.properties).forEach(([propertyName, propertyValue]) => {
		const bannedProps = [
			"rollup",
			"created_by",
			"created_time",
			"last_edited_by",
			"last_edited_time",
		];
		//NOTE: maybe just manually create page properties. Auto is possible but obnoxious:
		// see https://github.com/makenotion/notion-sdk-js/blob/main/examples/generate-random-data/index.ts
		if (!bannedProps.includes(propertyValue.type)) {
			Object.assign(properties, {
				[propertyName]: {
					type: [propertyValue.type], // I think the type prop is optional
					[propertyValue.type]: {},
				},
			});
		}
		// console.log(`${propertyName}: ${propertyValue.type}`);
	});
	//FIXME: should this be ID or Name (title) or both?
	properties.ID = {
		title: [{ text: { content: itemId } }],
	};

	//FIXME: do not create page until data is populated
	console.log("[NOTION] createPage - properies obj:", properties);
	const response = await notion.pages.create({
		parent: {
			// type: "database_id",	//TODO why is this optional?
			database_id: NOTION_DATABASEID_1,
		},
		properties,
	});
	console.log(response);
	return /** @type {NotionPage}*/ (response);
}

/**
 *
 * @param {NotionPage["id"]} page_id
 * @param {NotionCreatePage["properties"]} properties
 * @returns
 */
export async function updatePage(page_id, properties) {
	const response = await notion.pages.update({
		page_id,
		properties,
	});
	return response;
}

/**
 * @param {RawScan} scanData - a string like "A001,Basket"
 * @returns {Promise<ScannedItem>} returns a
 */
export async function scanItem(scanData) {
	//TODO make this runtime checkable? Enums?
	const [ID, ContainerType] = /** @type { [ItemId, ItemContainer] } */ (scanData.split(","));
	//TODO check if page exists

	//FIXME: scanned item should not contain name and tags yet
	/** @type ScannedItem */
	const item = {
		ID,
		ContainerType,
		Tags: ["one", "two"],
	};
	return item;
}

//HACK this is for testing!!
(async () => {
	try {
		const item = await scanItem("A002,Basket");
		await getItemPage(item);
	} catch (e) {
		console.error(e);
	}
})();
