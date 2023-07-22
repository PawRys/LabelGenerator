<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

import DefaultTemplate from './components/Default.vue';
import PrintTemplate from './components/Print.vue';
import CompA from './components/CompA.vue';
import CompB from './components/CompB.vue';

const currentTemplate = ref('DefaultTemplate');
const templates: any = { DefaultTemplate, PrintTemplate, CompA, CompB };
const template = computed(() => {
	console.log('triggered');

	return templates[currentTemplate.value];
});

addEventListener('beforeprint', event => {
	currentTemplate.value = 'PrintTemplate';
	console.log('beforeprint', currentTemplate.value);
});

addEventListener('afterprint', event => {
	currentTemplate.value = 'DefaultTemplate';
	console.log('afterprint', currentTemplate.value);
});

function printPage() {
	currentTemplate.value = 'PrintTemplate';
	window.print();
}
</script>

<template>
	<component :is="DefaultTemplate"></component>
</template>

<style>
:is(button, .button) {
	display: inline-flex;

	/* margin: 0.3em; */
	padding: 0.5em 0.8em;
	color: midnightblue;
	background-color: aliceblue;
	border: none;
	border-radius: 0.5em;

	/* transition-property: all;
	transition-duration: 300ms; */
}

:is(button, .button).cta {
	background-color: lightsteelblue;
	font-weight: 500;
}

:is(button, .button):hover {
	cursor: pointer;
	background-color: steelblue;
	color: aliceblue;
}
</style>
