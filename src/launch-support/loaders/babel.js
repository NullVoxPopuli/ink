import {fileURLToPath} from 'node:url';

import babel from '@babel/core';
import {Preprocessor} from 'content-tag';

const p = new Preprocessor();

// The formats that babel can compile
// It cannot compile wasm/json
const supportedModuleFormats = ['module', 'commonjs'];

export async function load(url, context, defaultLoad) {
	if (!useLoader(url)) {
		// console.log(`Ignoring, `, url);

		return defaultLoad(url, context, defaultLoad);
	}

	if (
		url.endsWith('.ts') ||
		url.endsWith('.tsx') ||
		url.endsWith('.gjs') ||
		url.endsWith('.gts')
	) {
		// defaultLoad throws ERR_UNKNOWN_FILE_EXTENSION unless we tell it a module format
		// We assume typescript users are using ESM rather than CJS, for simplicity
		context.format = 'module';
	}

	const {source, format} = await defaultLoad(url, context, defaultLoad);

	// NodeJS' implementation of defaultLoad returns a source of `null` for CommonJS modules.
	// So we just skip compilation when it's commonjs until a future day when NodeJS (might) support that.
	// Also, we skip compilation of wasm and json modules by babel, since babel isn't needed or possible
	// in those situations
	if (!source || (format && !supportedModuleFormats.includes(format))) {
		return {source, format};
	}

	const filename = fileURLToPath(url);

	// Babel config files can themselves be ES modules,
	// but we cannot transform those since doing so would cause an infinite loop.
	if (filename.endsWith('babel.config.cjs')) {
		return {
			source,
			format: 'commonjs',
		};
	}

	const options = babel.loadOptions({
		sourceType: format || 'module',
		// eslint-disable-next-line no-undef
		root: process.cwd(),
		rootMode: 'root',
		filename: filename,
		configFile: true,
	});

	/**
	 * technically, maybe (<template> can be omitted)
	 */
	const needsContentTag = url.endsWith('.gjs') || url.endsWith('.gts');

	let sourceForBabel = source;

	if (needsContentTag) {
		const str = String.fromCharCode.apply(null, source);
		const output = p.process(str);

		sourceForBabel = output.code;
	}

	const transformed = await babel.transformAsync(sourceForBabel, options);

	return {
		source: transformed.code,
		// Maybe a shaky assumption
		// TODO: look at babel config to see whether it will output ESM/CJS or other formats
		format: 'module',
	};
}

/**
 * We need to run @embroider/macros' babel plugin on any library that uses macros.
 * ember-source, addons, etc.
 *
 * I don't want to do the proper thing and check if the package.json
 * declared macros rn, so for now we hard-code.
 */

const force = [
	'@ember/test-waiters',
	'@embroider/router',
	'@glimmer/component',
	'ember-source',
	'ember-resources',
	'ember-strict-application-resolver',
];

function useLoader(url) {
	if (force.some(x => url.includes(x))) return true;

	const result = !/node_modules/.test(url) && !/node:/.test(url);

	// if (!result) {
	//   console.log('ignoring', url);
	// }

	return result;
}
