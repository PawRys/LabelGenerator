<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
import SmartInput from './InputChoice/SmartInput.vue';

const labelsStore = useLabelsStore();
function logme(e: any): void {
	console.log(e);
}
</script>
<template>
	<section>
		<table>
			<tr
				v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
				:key="index">
				<td>{{ index + 1 }}.</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'itemSize'" />
				</td>
				<td class="table__long-desc">
					<SmartInput :label-index="index" :label-prop="'longDesc'" />
				</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'itemGlue'" />
				</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'packsCount'" />x<SmartInput
						:label-index="index"
						:label-prop="'packSize'" />
				</td>
				<td>
					<SmartInput :label-index="index" :label-prop="'contract'" />
				</td>
				<td class="button-bar">
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
</style>
