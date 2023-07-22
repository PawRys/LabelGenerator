import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useLabelsStore = defineStore('labels', () => {
	const items = reactive([]);

	function addItem(...args: any) {
		for (const item of args) {
			items.push(item);
		}
	}

	function removeItem(index: number) {
		items.splice(index, 1);
	}

	function removeAll() {
		items.splice(0, items.length);
	}

	function count() {
		return items.reduce((acc, item) => (acc += +item['packsCount']), 0);
	}

	return { items, addItem, removeItem, removeAll, count };
});
