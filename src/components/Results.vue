<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
import SmartInput from './InputChoice/SmartInput.vue';

const labelsStore = useLabelsStore();
</script>

<template>
	<section>
		<table>
			<tr v-for="({}, index) in labelsStore.items" :key="index">
				<td>{{ index + 1 }}.</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'itemSize'" />
				</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'longDesc'" class="long-width" />
				</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'itemGlue'" class="short-width" />
				</td>
				<td class="nowrap">
					<SmartInput :label-index="index" :label-prop="'packsCount'" class="short-width" />
					<span> x </span>
					<SmartInput :label-index="index" :label-prop="'packSize'" class="short-width" />
				</td>
				<td>
					<!-- <SmartInput :label-index="index" :label-prop="'contract'" /> -->
					<SmartInput :label-index="index" :label-prop="'invoice'" />
				</td>
				<td>
					<button @click="labelsStore.removeItem(index)">Usuń</button>
				</td>
			</tr>
		</table>
		<hr class="divider narrow-box" />
	</section>
</template>

<style scoped>
table {
	margin-inline: auto;
	/* margin-bottom: 5em; */
	width: 100%;
	border-spacing: 1em;
}

td {
	text-align: center;
}

.table__long-desc {
	white-space: pre-wrap;
	text-align: center;
	line-height: 1.5;
}

.divider {
	margin-block: 2em 4em;
	border: none;
	border-bottom: dotted 1px lightsteelblue;
}

.nowrap {
	white-space: nowrap;
}

.short-width {
	width: min-content;
}
</style>
