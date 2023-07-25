<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
</script>
<template>
	<table>
		<tr
			v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
			:key="index">
			<td>{{ index + 1 }}.</td>
			<td>{{ itemSize }}</td>
			<td class="table__long-desc">{{ longDesc }}</td>
			<td>{{ itemGlue }}</td>
			<td>{{ `${packsCount}x${packSize}` }}</td>
			<td>{{ contract }}</td>
			<td>
				<button @click="labelsStore.removeItem(index)">Usuń</button>
			</td>
		</tr>
	</table>
</template>

<style scoped>
table {
	margin-inline: auto;
	margin-bottom: 5em;
	width: 100%;
	border-spacing: 1em;
}

.table__long-desc {
	white-space: pre-wrap;
	text-align: center;
	line-height: 1.5;
}
</style>
