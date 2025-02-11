import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export interface LabelInterface {
	invoice: string;
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
			const stringifiedResult = JSON.stringify(item);
			const nowrapResult = nowrap(stringifiedResult);
			const finalResult = JSON.parse(nowrapResult);
			items.push(finalResult);
		}
	}

	function updateItem(index: number, property: keyof LabelInterface, dataToSave: string) {
		const itemToUpdate = items[index];
		if (itemToUpdate) {
			itemToUpdate[property] = nowrap(dataToSave);
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

function nowrap(text: string): string {
	return text.replace(/\b(\w+) (\w+)\/(\w+) (\w+)\b/g, '$1 $2/$3 $4');
}
