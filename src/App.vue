<script setup lang="ts">
import { computed, onBeforeUpdate, onMounted, onUpdated, watch } from 'vue';
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
import { usePrintLayout } from '@/stores/printLayout';

const { layoutName } = storeToRefs(usePrintLayout());

import InputChoice from './components/InputChoice.vue';
import PrintSettings from './components/PrintSettings.vue';
import Results from './components/Results.vue';

import PrintSingle from '@/components/PrintSingle.vue';
import PrintDouble from '@/components/PrintDouble.vue';
import { storeToRefs } from 'pinia';

const printLayoutList = {
	PrintSingle: { component: PrintSingle, label: 'Jedna na stronę', orientation: 'landscape', icon: 'bi bi-box-seam' },
	PrintDouble: { component: PrintDouble, label: 'Dwie na stronę', orientation: 'portrait', icon: 'bi bi-box-seam' },
};

const activeLayout = computed(() => {
	const activeLayoutIndex =
		usePrintLayout().layoutName in printLayoutList ? usePrintLayout().layoutName : Object.keys(printLayoutList)[0];
	return printLayoutList[activeLayoutIndex as keyof typeof printLayoutList];
});
</script>

<template>
	<header class="noprint">
		<p>
			<a href="https://pawrys.github.io/StockBrowser5/">Stany</a>
			<span> / </span>
			<a href="https://pawrys.github.io/LabelGenerator/">Etykiety</a>
			<span> / </span>
			<a href="https://pawrys.github.io/PurchaseComparator/">Tester</a>
		</p>

		<h1>Etykieter</h1>
	</header>
	<InputChoice class="noprint" />
	<PrintSettings class="noprint" />
	<Results class="noprint" />

	<component class="printme" :is="activeLayout.component"></component>

	<footer class="noprint">
		<p>Wszelkie prawa zastrzeżone - Paweł Ryszkowski</p>
		<p>
			Uwagi i pomoc techniczna:
			<a href="mailto:pawrys.kontakt@gmail.com?subject=Pomoc%20Stock%20Browser%205" target="_blank"
				>pawrys.kontakt@gmail.com</a
			>
			<span> - </span>
			<a href="https://github.com/PawRys/">Github/PawRys</a>
		</p>
		<p></p>
	</footer>
</template>

<style>
@page {
	size: A4 portrait;
	margin: 10mm;
}

.printme {
	/* visibility: collapse; */
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
	max-width: 80ch;
}

.button-bar {
	display: flex;
	gap: 1em;
	justify-content: center;
	align-items: center;
	margin-block: 2em;
}
</style>
