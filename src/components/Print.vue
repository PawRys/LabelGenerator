<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
</script>
<template>
	<section>
		<template
			v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
			:key="index">
			<section v-for="n in +packsCount" class="page">
				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<span class="label__item-glue">{{ itemGlue }}</span>
					<span class="label__contract">{{ contract }}</span>
					<span class="label__pack-size" v-if="Number(packSize) > 0">{{ packSize }}</span>
				</div>

				<hr class="label-divider" />

				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<span class="label__item-glue">{{ itemGlue }}</span>
					<span class="label__contract">{{ contract }}</span>
					<span class="label__pack-size" v-if="Number(packSize) > 0">{{ packSize }}</span>
				</div>
			</section>
		</template>
	</section>
</template>

<style scoped>
.page {
	display: grid;
	gap: 1cm;
	grid-template-rows: 1fr 1px 1fr;
	height: calc(100vh - 1mm);
	height: calc(100svh - 1mm);
	page-break-before: always;
	overflow: hidden;
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
	grid-template-areas:
		'A A A'
		'B B B'
		'C D E';

	font-size: 3cm; /* Master font size for all label childs */
	--fs-normal: 3cm;
	--fs-small: calc(var(--fs-normal) * 0.64);
	--fs-smaller: calc(var(--fs-small) * 0.5);
	font-weight: 600;
	text-align: center;
	line-height: 1;
}

.label__item-size {
	grid-area: A;
	font-size: var(--fs-normal);
	font-weight: 600;
}
.label__long-desc {
	grid-area: B;
	font-size: var(--fs-small);
	white-space: pre-line;
	text-align: center;
	min-height: 1em;
}

.label__item-glue {
	grid-area: C;
	font-size: var(--fs-small);
}

.label__contract {
	grid-area: D;
	font-size: var(--fs-smaller);
	font-weight: 400;
}
.label__pack-size {
	grid-area: E;
	font-size: var(--fs-small);
}
.label__pack-size::after {
	content: 'szt.';
	font-size: var(--fs-smaller);
	font-weight: 400;
}
</style>
