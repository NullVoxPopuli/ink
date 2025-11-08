import fs from "node:fs";
import { glob } from "node:fs/promises";
import path, { join } from "node:path";

const CWD = process.cwd();
const OUT_FILE = "node-loader-importmap.json";

const OUT_PATH = path.join(CWD, OUT_FILE);
const defaultLocation = "node_modules/ember-source/dist";

export async function generateImportMap(fromDir?: string) {
	const map: Record<string, string> = {};
	const prefix = fromDir ? join(fromDir, defaultLocation) : defaultLocation;

	for await (const entry of glob("./" + prefix + "/**/*.js")) {
		const root = entry.replace(prefix + "/", "");

		if (root.includes("/shared-chunks/")) continue;

		if (root.startsWith("packages")) {
			const local = root.replace("packages/", "");
			const importName = local.replace(/\/index\.js$/, "").replace(/\.js$/, "");

			map[importName] = "./" + entry;
		}
	}

	return { imports: map };
}

if (import.meta.url === `file://${process.argv[1]}`) {
	fs.writeFileSync(OUT_PATH, JSON.stringify(await generateImportMap(), null, 2));
}
