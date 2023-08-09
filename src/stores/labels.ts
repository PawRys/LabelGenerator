import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export interface LabelInterface {
	contract: string;
	longDesc: string;
	itemSize: string;
	itemGlue: string;
	packsCount: string;
	packSize: string;
}

export const useLabelsStore = defineStore('labels', () => {
	const items = reactive<LabelInterface[]>([]);

	function addItem(...args: LabelInterface[]) {
		for (const item of args) {
			items.push(item);
		}
	}

	function updateItem(index: number, datakey: keyof LabelInterface, data: string) {
		const itemToUpdate = items[index];
		if (itemToUpdate) {
			itemToUpdate[datakey] = data;
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

	return { items, addItem, updateItem, removeItem, removeAll, count };
});
