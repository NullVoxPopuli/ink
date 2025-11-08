import { register } from "node:module";
import { join } from "node:path";

import { generateImportMap } from "./launch-support/create-import-map.ts";

const importMap = await generateImportMap(process.cwd());

register(join(import.meta.dirname, "launch-support/loaders/babel.js"), import.meta.url);

register(join(import.meta.dirname, "launch-support/loaders/import-map.js"), import.meta.url, {
	data: {
		importMap,
	},
});
