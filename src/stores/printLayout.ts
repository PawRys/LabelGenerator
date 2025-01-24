import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePrintLayout = defineStore('printLayout', () => {
	const layoutName = ref('');

	return { layoutName };
});
