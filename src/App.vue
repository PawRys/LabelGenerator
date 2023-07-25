<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();

import InputChoice from './components/InputChoice.vue';
import PageCount from './components/PageCount.vue';
import Results from './components/Results.vue';
import Print from './components/Print.vue';
</script>

<template>
	<header class="noprint">
		<h1>Etykieter</h1>
	</header>
	<InputChoice class="noprint" />
	<PageCount class="noprint" />
	<Results class="noprint" />
	<Print class="printme" />
</template>

<style>
@page {
	size: 210mm 297mm;
	/* margin: 0; */
}
.printme {
	display: none;
}
@media print {
	.noprint {
		display: none;
	}
	.printme {
		display: block;
	}
	* {
		box-sizing: border-box;
		position: relative;
		padding: 0;
		border: 0;
		margin: 0;
	}
}

.narrow-box {
	margin-inline: auto;
	max-width: 60ch;
}

.button-bar {
	display: flex;
	gap: 1em;
	justify-content: center;
	align-items: center;
	margin-block: 2em;
}
</style>
