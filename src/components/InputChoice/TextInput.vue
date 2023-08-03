<script setup lang="ts">
import { ref } from 'vue';
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();
const { index, datakey } = defineProps({ index: Number, datakey: String });

const editing = ref(false);

function updateItem(event: any): void {
	if (labelsStore.items[index]) {
		labelsStore.items[index][datakey] = event.target.value;
	}
	editing.value = false;
}

function logme(e: any) {
	console.log('@mounted', e);
}
</script>

<template>
	<span v-if="!editing" @focus="editing = true" contenteditable="true">{{ labelsStore.items[index][datakey] }}</span>
	<input
		v-if="editing"
		type="text"
		:value="labelsStore.items[index][datakey]"
		@vue:mounted="({ el }) => el.focus()"
		@blur="updateItem" />
</template>

<style scoped>
.visualy-hidden {
	display: none;
}
</style>
