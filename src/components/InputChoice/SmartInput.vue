<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLabelsStore, type LabelInterface } from '@/stores/labels';

const labelsStore = useLabelsStore();
const props = defineProps({ labelIndex: Number, labelProp: String });
const labelIndex = props.labelIndex || 0;
const labelProp = props.labelProp || '';

const labelPropValue = computed(() => {
	const labelIdx = labelsStore.items[labelIndex];
	if (labelIndex !== undefined && labelProp !== '') {
		return labelIdx[labelProp as keyof typeof labelIdx];
	}
	return 'ERROR';
});

function updateItem(event: Event): void {
	const target = event.target as HTMLInputElement;
	const value = target.value;
	console.log(labelPropValue.value);

	if (labelIndex !== undefined && labelProp !== '') {
		labelsStore.updateItem(labelIndex, labelProp as keyof LabelInterface, value);
	}
}
</script>

<template>
	<div class="smart-input">
		<div class="size-holder">{{ labelPropValue }}</div>
		<textarea
			v-if="labelProp === 'longDesc'"
			rows="5"
			cols="20"
			class="size-filler"
			@blur="updateItem"
			@keyup="updateItem"
			>{{ labelPropValue }}</textarea
		>
		<input
			v-if="labelProp !== 'longDesc'"
			class="size-filler"
			type="text"
			:value="labelPropValue"
			@blur="updateItem"
			@keyup="updateItem" />
	</div>
</template>

<style scoped>
.smart-input {
	display: inline-grid;
	grid-template-columns: 100%;
	grid-template-rows: 100%;
	width: 100%;
}

.smart-input > * {
	width: 100%;
	padding: 0.1rem;
	border: dotted 1px silver;
	background-color: white;
	text-align: center;
}

.size-holder {
	visibility: hidden;
	white-space: pre-line;
	text-wrap: nowrap;
	padding: 0.5ch 1ch;
}

.long-width .size-holder {
	text-wrap: wrap;
}

.size-holder:empty::before {
	content: '  '; /*  if input has no value, hold size of few hard-space */
}

.size-filler {
	position: absolute;
	inset: 0;
	white-space: pre-line;
	padding: 0.5ch 1ch;
}
</style>
