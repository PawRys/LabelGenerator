<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
</script>

<template>
	<table>
		<tr
			v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
			:key="index"
			class="li-grid">
			<td class="li-field">{{ itemSize }}</td>
			<td class="li-field">{{ longDesc }}</td>
			<td class="li-field">{{ itemGlue }}</td>
			<td class="li-field">{{ `${packsCount}x${packSize}` }}</td>
			<td class="li-field">{{ contract }}</td>
		</tr>
	</table>
</template>
