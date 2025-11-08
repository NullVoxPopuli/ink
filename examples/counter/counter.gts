import { render, Text } from '../../src/index.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

class Counter extends Component {
	@tracked counter = 0;

	constructor(...args) {
		super(...args);

		const timer = setInternal(() => {
				this.counter += 1;
		}, 100);
		registerDestructor(() => clearInterval(timer));
	}

	<template>
		<Text @color="green">{{this.counter}} tests passed</Text>
	</template>
}

render(Counter);

// Original Example from Ink
// -------------------------
//
// import React from 'react';
// import {render, Text} from '../../src/index.js';
//
// function Counter() {
// 	const [counter, setCounter] = React.useState(0);
//
// 	React.useEffect(() => {
// 		const timer = setInterval(() => {
// 			setCounter(prevCounter => prevCounter + 1); // eslint-disable-line unicorn/prevent-abbreviations
// 		}, 100);
//
// 		return () => {
// 			clearInterval(timer);
// 		};
// 	}, []);
//
// 	return <Text color="green">{counter} tests passed</Text>;
// }

// render(<Counter />);
