import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export interface LabelInterface {
	orderNo?: number;
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
		if (itemToUpdate && property !== 'orderNo') {
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
				if (a.orderNo !== b.orderNo) return (a.orderNo || 0) - (b.orderNo || 0);
				return 0;
			});
		}

		// Sort by Thickness
		if (n === 1) {
			items.sort((a, b) => {
				const aNums = a.itemSize.split('x').map(s => parseFloat(s.replace(',', '.')));
				const bNums = b.itemSize.split('x').map(s => parseFloat(s.replace(',', '.')));
				const aOrdered = [aNums[0], aNums[1], aNums[2], Number(a.packSize)];
				const bOrdered = [bNums[0], bNums[1], bNums[2], Number(b.packSize)];
				for (let i = 0; i < aOrdered.length; i++) {
					if (aOrdered[i] !== bOrdered[i]) return aOrdered[i] - bOrdered[i];
				}
				return 0;
			});
		}

		// Sort by FormatGroup
		if (n === 2) {
			items.sort((a, b) => {
				const aNums = a.itemSize.split('x').map(s => parseFloat(s.replace(',', '.')));
				const bNums = b.itemSize.split('x').map(s => parseFloat(s.replace(',', '.')));
				const aOrdered = [
					Math.round(Math.min(aNums[1], aNums[2]) / 305),
					Math.round(Math.max(aNums[1], aNums[2]) / 305),
					aNums[0],
					aNums[1],
					aNums[2],
					// Math.min(aNums[1], aNums[2]),
					// Math.max(aNums[1], aNums[2]),
					Number(a.packSize),
				];
				const bOrdered = [
					Math.round(Math.min(bNums[1], bNums[2]) / 305),
					Math.round(Math.max(bNums[1], bNums[2]) / 305),
					bNums[0],
					bNums[1],
					bNums[2],
					// Math.min(bNums[1], bNums[2]),
					// Math.max(bNums[1], bNums[2]),
					Number(b.packSize),
				];
				for (let i = 0; i < aOrdered.length; i++) {
					if (aOrdered[i] !== bOrdered[i]) return aOrdered[i] - bOrdered[i];
				}
				return 0;
			});
		}
	}

	return { items, addItem, updateItem, removeItem, removeAll, count, sortItems };
});

function nowrap(text: string): string {
	return text.replace(/\b(\w+) (\w+)\/(\w+) (\w+)\b/g, '$1 $2/$3 $4');
}
