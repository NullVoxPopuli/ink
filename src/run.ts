import {register} from 'node:module';
import assert from 'node:assert';
import {join, resolve} from 'node:path';

import importMap from './launch-support/import-map.json' with {type: 'json'};

register(
	join(import.meta.dirname, 'launch-support/loaders/babel.js'),
	import.meta.url,
);

register(
	join(import.meta.dirname, 'launch-support/loaders/import-map.js'),
	import.meta.url,
	{
		data: {
			importMap,
		},
	},
);

assert(process.argv[1], `You must specify a script to run`);

let path = resolve(process.cwd(), process.argv[1]);

import(path);
