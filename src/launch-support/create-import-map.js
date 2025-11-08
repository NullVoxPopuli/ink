import fs from 'node:fs';
import {glob} from 'node:fs/promises';
import path from 'node:path';

const CWD = process.cwd();
const OUT_FILE = 'node-loader-importmap.json';

const OUT_PATH = path.join(CWD, OUT_FILE);

const map = {};
const prefix = 'node_modules/ember-source/dist';

for await (const entry of glob('./' + prefix + '/**/*.js')) {
	const root = entry.replace(prefix + '/', '');

	if (root.includes('/shared-chunks/')) continue;

	if (root.startsWith('packages')) {
		const local = root.replace('packages/', '');
		const importName = local.replace(/\/index\.js$/, '').replace(/\.js$/, '');

		map[importName] = './' + entry;
	}
}

fs.writeFileSync(
	OUT_PATH,
	JSON.stringify(
		{
			imports: map,
		},
		null,
		2,
	),
);
