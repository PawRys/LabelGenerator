<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
import { usePrintLayout } from '@/stores/printLayout';
</script>
<template>
	<section>
		<template
			v-for="({ invoice, contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
			:key="index">
			<div v-for="n in +packsCount" class="page">
				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<span class="label__item-glue">{{ itemGlue }}</span>
					<span class="label__contract">{{ invoice }}</span>
					<span class="label__pack-size" v-if="Number(packSize) > 0">{{ packSize }}</span>
				</div>
				<hr class="label-divider" />
				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<span class="label__item-glue">{{ itemGlue }}</span>
					<span class="label__contract">{{ invoice }}</span>
					<span class="label__pack-size" v-if="Number(packSize) > 0">{{ packSize }}</span>
				</div>
			</div>
		</template>
	</section>
</template>

<style scoped>
@media print {
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	@page {
		size: A4 portrait;
		margin: 0;
	}

	.page {
		box-sizing: border-box;
		width: 100%;
		height: 100svh;
		margin: 0;
		padding: 0;

		display: grid;
		grid-template-rows: 1fr auto 1fr;
		gap: 0.5cm;
		page-break-before: always;

		--fs-normal: 2.7cm;
		--fs-small: calc(var(--fs-normal) * 0.75);
		--fs-smaller: calc(var(--fs-normal) * 0.55);
		--fs-smallest: calc(var(--fs-normal) * 0.35);

		font-family: 'Roboto Flex', serif;
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

	.page:nth-of-type(1) {
		page-break-before: avoid;
	}

	.label-divider {
		border-bottom: dashed 1px gray;
		width: 100%;
	}

	.label {
		display: grid;
		gap: 0.5cm;
		align-self: self-end;
		align-items: baseline;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto auto;
		grid-template-areas:
			'A A A'
			'B B B'
			'C D E';

		max-height: calc(50vh - 0.5cm - 1px);
		overflow: clip;

		font-size: var(--fs-normal); /* Master font size for all label childs */
		font-weight: 500;
		text-align: center;
		line-height: 1.1;
	}

	.label__item-size {
		grid-area: A;
		font-size: var(--fs-normal);
		font-weight: 600;
		align-self: end;
	}

	.label__long-desc {
		grid-area: B;
		font-size: var(--fs-small);
		white-space: pre-line;
		text-wrap: balance;
		text-align: center;
		min-height: calc(var(--fs-normal) * 1);
		max-height: calc(var(--fs-normal) * 2.3);
		/* box-shadow: inset 0 0 0 1px hotpink; */
		overflow: clip;
	}

	.label__item-glue {
		grid-area: C;
		font-size: var(--fs-smaller);
	}

	.label__contract {
		grid-area: D;
		font-size: var(--fs-smallest);
		font-weight: 400;
	}

	.label__pack-size {
		grid-area: E;
		font-size: var(--fs-normal);
		font-weight: 500;
	}

	.label__pack-size::after {
		content: 'szt.';
		font-size: var(--fs-smallest);
		font-weight: 400;
	}
}
</style>
