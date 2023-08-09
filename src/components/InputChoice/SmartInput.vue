<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLabelsStore, type LabelInterface } from '@/stores/labels';

interface MountedHTMLElement {
	el: HTMLElement;
}

const labelsStore = useLabelsStore();
const props = defineProps({ labelIndex: Number, labelProp: String });
const index = props.labelIndex || 0;
const labelProp = props.labelProp || '';

const editing = ref(false);
const labelPropValue = computed(() => {
	const labelIdx = labelsStore.items[index];
	if (labelIdx && labelProp) {
		return labelIdx[labelProp as keyof typeof labelIdx]; // Use keyof typeof -chatgpt
	}
	return '';
});

function updateItem(event: FocusEvent): void {
	const target = event.target as HTMLInputElement;
	const value = target.value;

	if (index !== undefined && labelProp !== '') {
		labelsStore.updateItem(index, labelProp as keyof LabelInterface, value);
	}
	editing.value = false;
}
</script>

<template>
	<div class="smart-input">
		<span v-if="!editing" class="smart-input__label" @focus="editing = true" contenteditable="true">{{
			labelPropValue
		}}</span>
		<input
			v-if="editing"
			class="smart-input__input"
			type="text"
			:value="labelPropValue"
			@vue:mounted="({ el }:MountedHTMLElement) => el.focus()"
			@blur="updateItem" />
	</div>
</template>

<style scoped>
.visualy-hidden {
	display: none;
}

.smart-input {
	display: inline-flex;
	grid-template-columns: 100%;
	grid-template-rows: 100%;

	width: fit-content;
}
.smart-input > * {
	width: 100%;
}

.smart-input__label {
	border: dotted 1px silver;
}
</style>
