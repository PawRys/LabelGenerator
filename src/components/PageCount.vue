<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();

function plural(one: string, two: string, tre: string, val: number): String {
	let result = '';
	if (val === 1) result = one;
	else if (val % 10 > 1 && val % 10 < 5 && (val % 100 < 10 || val % 100 > 20)) result = two;
	else if (val >= 5) result = tre;
	return result;
}
</script>

<template>
	<section v-if="labelsStore.items.length > 0">
		<!-- <div class="divider">---</div> -->
		<div class="button-bar narrow-box">
			<span class="page-count">{{
				`${labelsStore.count()} ${plural('strona', 'strony', 'stron', labelsStore.count())}`
			}}</span>
			<span class="page-count__info" data-tip="Liczba stron powinna zgadzać się z ilością paczek na CMR.">?</span>

			<button class="cta" onclick="window.print()">Drukuj</button>
			<button @click="labelsStore.removeAll()">Usuń wszystkie</button>
		</div>
	</section>
</template>

<style scoped>
.page-count {
	font-size: 1.5em;
	font-weight: 500;
}

.page-count__info {
	display: inline-flex;
	justify-content: center;
	align-items: center;

	margin-right: auto;
	width: 3ch;
	aspect-ratio: 1;
	border-radius: 100vh;
	box-shadow: 0 0 0.1em steelblue;

	color: steelblue;
	/* font-weight: 500; */
	cursor: help;
}
.page-count__info:hover::after {
	content: attr(data-tip);
	position: absolute;
	translate: -50% 0%;
	z-index: 1;
	left: 50%;
	bottom: 150%;

	padding: 0.5em;
	width: 28ch;

	border-radius: 0.5em;
	box-shadow: 0em 0.1em 0.3em lightsteelblue;

	background-color: white;
	/* font-size: 0.9em; */
	/* font-weight: 300; */
	text-align: center;
}
</style>
