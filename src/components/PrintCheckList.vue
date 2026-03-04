<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
import { usePrintLayout } from '@/stores/printLayout';
</script>
<template>
	<section>
		<table>
			<tr
				v-for="({ invoice, contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
				:key="index">
				<td>{{ `${index + 1}.` }}</td>
				<td class="item-check">
					<div class="grid"><i v-for="x in Number(packsCount)" :key="x" class="bi bi-square"></i></div>
				</td>
				<td>{{ `${packsCount}x${packSize}` }}</td>
				<td class="item-size">{{ itemSize }}</td>
				<td>{{ `${longDesc} ${itemGlue}` }}</td>
			</tr>
		</table>
	</section>
</template>

<style scoped>
@media print {
	table {
		border-collapse: collapse;
		--fs-normal: 2.7cm;
		--fs-small: calc(var(--fs-normal) * 0.75);
		--fs-smaller: calc(var(--fs-normal) * 0.55);
		--fs-smallest: calc(var(--fs-normal) * 0.35);

		font-family: 'Roboto Flex', serif;
		font-size: 1rem;
		font-optical-sizing: auto;
		font-style: normal;
		font-variation-settings:
			'slnt' 0,
			'wdth' 100,
			'GRAD' 0,
			'XOPQ' 96,
			'XTRA' 468,
			'YOPQ' 79,
			'YTAS' 750,
			'YTDE' -203,
			'YTFI' 738,
			'YTLC' 514,
			'YTUC' 712;
	}

	td {
		border-bottom: solid 1px silver;
		height: 100%;
		padding: 1ch 0.5ch;
		line-height: 1;
	}

	.item-size {
		/* border-left: solid 1px silver; */
		font-weight: 600;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, auto);
		gap: 1ch;
	}

	@page {
		margin-inline: 1cm;
	}
}
</style>
