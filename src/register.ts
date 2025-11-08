import { register } from "node:module";
import { generateImportMap } from "./launch-support/create-import-map.ts";

const importMap = await generateImportMap(process.cwd());

register("./launch-support/loaders/babel.js", import.meta.url);

register("./launch-support/loaders/import-map.js", import.meta.url, {
	data: {
		importMap,
	},
});
