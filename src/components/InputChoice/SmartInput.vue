<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLabelsStore, type LabelInterface } from '@/stores/labels';

interface MountedHTMLElement {
	el: HTMLElement;
}

const labelsStore = useLabelsStore();
const props = defineProps({ labelIndex: Number, labelProp: String });
const labelIndex = props.labelIndex || 0;
const labelProp = props.labelProp || '';

const editing = ref(false);

const labelPropValue = computed(() => {
	const labelIdx = labelsStore.items[labelIndex];
	if (labelIndex !== undefined && labelProp !== '') {
		return labelIdx[labelProp as keyof typeof labelIdx];
	}
	return 'ERROR';
});

function updateItem(event: FocusEvent): void {
	const target = event.target as HTMLInputElement;
	const value = target.value;

	if (labelIndex !== undefined && labelProp !== '') {
		labelsStore.updateItem(labelIndex, labelProp as keyof LabelInterface, value);
	}
	editing.value = false;
}
</script>

<template>
	<div class="smart-input">
		<span v-if="!editing" class="smart-input__show-value" @focus="editing = true" contenteditable="true">{{
			labelPropValue
		}}</span>
		<input
			v-if="editing"
			class="smart-input__edit-value"
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
	display: inline-grid;
	grid-template-columns: 100%;
	grid-template-rows: 100%;

	width: 100%;
}
.smart-input > * {
	width: 100%;
}

.smart-input__show-value {
	border: dotted 1px silver;
}
</style>
