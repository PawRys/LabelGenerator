import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export interface LabelInterface {
	orderNo?: string;
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

	function sortItems(n: number) {
		// No-sort
		if (n === 0) {
			items.sort((a, b) => {
				const A = a.orderNo || '0';
				const B = b.orderNo || '0';
				return A.localeCompare(B, 'pl', { numeric: true });
			});
		}

		// Sort by Thickness
		if (n === 1) {
			items.sort((a, b) => {
				const A = `${a.itemSize}x${a.packSize}`;
				const B = `${b.itemSize}x${b.packSize}`;
				return A.localeCompare(B, 'pl', { numeric: true });
			});
		}

		// Sort by Format
		if (n === 2) {
			items.sort((a, b) => {
				const A = `${a.itemSize.split('x').slice(1).concat(a.itemSize.split('x')[0]).join('x')}x${a.packSize}`;
				const B = `${b.itemSize.split('x').slice(1).concat(b.itemSize.split('x')[0]).join('x')}x${b.packSize}`;
				return A.localeCompare(B, 'pl', { numeric: true });
			});
		}
	}

	return { items, addItem, updateItem, removeItem, removeAll, count, sortItems };
});

function nowrap(text: string): string {
	return text.replace(/\b(\w+) (\w+)\/(\w+) (\w+)\b/g, '$1 $2/$3 $4');
}
