<script setup lang="ts">
import { ref, reactive } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import Loop from './components/loop.vue';

const items = reactive<Array<any>>([]);

const regExp_ItemSize: RegExp = /\b\d+x\d+x\d+\b/i; // 12x1250x2500
const regExp_ContarctNo: RegExp = /\b(Contract)\b/i;
const regExp_ItemPacking: RegExp = /\b\d+x\d+\b/i; // 16x50
const regExp_ItemGlueing: RegExp = /\b(EXT|WD|INT|MR)\b/i;
const regExp_ItemDescription: RegExp = /\b(Birch plywood|EXT|WD|INT|MR)\b/i;

async function addItemsFromFiles(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = target.files as FileList;
	const extractedData = await extractDataFromPDF(files);
	const usefullData = filterUselessData(extractedData);
	const dataToDisplay = buildDataToDisplay(usefullData);
	items.push(...dataToDisplay);

	// console.log('extractedData: ', extractedData);
	// console.log('usefullData: ', usefullData);
	// console.log('dataToDisplay: ', dataToDisplay);
}

async function extractDataFromPDF(files: FileList) {
	const filesCount = files.length;
	let result: Array<string> = [];
	for (let fileNo = 0; fileNo < filesCount; fileNo++) {
		const file = files[fileNo];
		if (file.type !== 'application/pdf') continue;
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
		const pagesCount = pdf.numPages;

		for (let pageNo = 1; pageNo <= pagesCount; pageNo++) {
			const page = await pdf.getPage(pageNo);
			const content = await page.getTextContent();
			const contentSize = content.items.length;

			for (let i = 0; i < contentSize; i++) {
				const item = content.items[i] as TextItem;
				const text: string = item.str;
				result.push(text);
			}
		}
	}
	return result;
}

function filterUselessData(input: String[]) {
	let output: Array<String> = [];
	const itemsLenght = input.length;
	for (let i = 0; i < itemsLenght; i++) {
		let lastOutput = output[output.length - 1] as string;
		let currentItem = input[i] as string;
		let testSum = 0;
		testSum += regExp_ItemSize.test(currentItem) ? 1 : 0;
		testSum += regExp_ContarctNo.test(currentItem) ? 1 : 0;
		testSum += regExp_ItemPacking.test(currentItem) ? 1 : 0;
		testSum += regExp_ItemDescription.test(currentItem) ? 1 : 0;
		if (regExp_ItemDescription.test(lastOutput) && regExp_ItemDescription.test(currentItem)) {
			output[output.length - 1] = `${lastOutput} ${currentItem}`;
			continue;
		}
		if (testSum > 0) {
			output.push(currentItem);
		}
	}
	return output;
}

function buildDataToDisplay(items: String[]) {
	interface Results {
		contract: string;
		longDesc: string;
		itemSize: string;
		itemGlue: string;
		packsCount: string;
		packSize: string;
	}

	let result: Results[] = [];
	const itemsLength = items.length;
	let itemSize: string = '';
	let contractNo: string = '';
	let itemPacksCount: string = '';
	let itemPackSize: string = '';
	let itemGlueing: string = '';
	let itemDescription: string = '';
	let itemType: string = '';

	for (let i = 0; i < itemsLength; i++) {
		const item = items[i] as string;

		if (regExp_ContarctNo.test(item)) {
			contractNo = getPurifiedContractNo(item);
			itemType = 'contractNo';
		}

		if (regExp_ItemGlueing.test(item)) {
			itemGlueing = getItemGlueing(item);
			itemType = 'itemGlueing';
		}

		if (regExp_ItemDescription.test(item)) {
			itemDescription = getPurifiedDescription(item);
			itemType = 'itemDescription';
		}

		if (regExp_ItemSize.test(item)) {
			itemSize = getPurifiedSize(item);
			itemType = 'itemSize';
		}

		if (regExp_ItemPacking.test(item)) {
			const packingInfo = getPackingInfo(item);
			itemPacksCount = packingInfo[0];
			itemPackSize = packingInfo[1];
			itemType = 'itemPacking';
		}

		if (itemType === 'itemPacking') {
			result.push({
				contract: contractNo,
				longDesc: itemDescription,
				itemSize: itemSize,
				itemGlue: itemGlueing,
				packsCount: itemPacksCount,
				packSize: itemPackSize,
			});
			itemType = '';
		}
	}

	return result;
}

function getPurifiedDescription(input: string | null): string {
	const destructuredName: Array<string> = input?.split(', ') || [];
	let purifiedName: Array<string> = [];
	for (let text of destructuredName) {
		// Ommit junk chunks
		if (text.match(/(edges sealed|Const|441233\d\d|RAL|EXT|WD|INT|MR)/i)) continue;
		// Erase junk words
		text = text.replace(/\b(Birch|plywood|RIGA|MEL|TEX|FORM|PLY|CODE|\d{5,})\b/gi, '').trim();
		purifiedName.push(text);
	}
	return purifiedName.join(' \n') || "it's null";
}

function getPurifiedSize(input: string): string {
	const match = input?.match(/\b\d+([,.]\d+)?x\d+x\d+\b/i) || ['0x0x0'];
	return match[0];
}

function getPackingInfo(input: string): Array<string> {
	const matching = input.match(/\b\d+x\d+\b/i) || ['1x0'];
	return matching[0].split('x');
}

function getPurifiedContractNo(input: string): string {
	return input.replace(/Contract No\.:/i, '').trim();
}

function getItemGlueing(input: string): string {
	const matching = input.match(/\b(EXT|WD|INT|MR)\b/i) || [''];
	return matching[0];
}

function addItem(input: Event): void {
	input.preventDefault();
	const form = input.target as HTMLFormElement;
	const formData = new FormData(form);
	const result = Object.fromEntries([...formData.entries()]);
	items.push(result);
}

function removeItem(index: number) {
	items.splice(index, 1);
}
</script>

<template>
	<h1>Etykieter</h1>
	<main>
		<input type="file" name="file-upload" id="file-upload" multiple @change="addItemsFromFiles" />

		<form class="add-item-form" @submit.prevent="addItem">
			<input
				type="text"
				name="itemSize"
				class="item-size long-input"
				placeholder="format"
				pattern="\d+([,.]\d)?x\d+x\d+"
				required
				value="12x1250x2500"
				autocomplete="on" />
			<input
				type="text"
				name="longDesc"
				class="item-longDesc long-input"
				placeholder="klasa lub długi opis"
				value="BB/CP"
				autocomplete="on" />
			<select name="itemGlue" class="item-glue short-input" required>
				<option value="EXT">EXT</option>
				<option value="WD">WD</option>
				<option value="INT">INT</option>
				<option value="MR">MR</option>
			</select>
			<input
				type="number"
				name="packsCount"
				class="item-packsCount short-input"
				placeholder="paczki"
				min="1"
				required
				value="16" />
			<span>x</span>
			<input
				type="number"
				name="packSize"
				class="item-pack-size short-input"
				placeholder="sztuki"
				min="0"
				required
				value="50" />
			<span>szt.</span>
			<input type="text" name="contract" class="contractNo long-input" placeholder="krótki opis" />
			<button type="submit" class="submit-item">Dodaj etykietę</button>
		</form>

		<ol>
			<template v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in items" :key="index">
				<li>
					<div class="li-grid">
						<h4 class="li-field">{{ index }}</h4>
						<span class="li-field">{{ itemGlue }}</span>
						<span class="li-field">{{ itemSize }}</span>
						<span class="li-field">{{ longDesc }}</span>
						<span class="li-field">{{ `${packsCount}x${packSize}` }}</span>
						<span class="li-field">{{ contract }}</span>
					</div>
					<button @click="removeItem(index)">Remove</button>
				</li>
			</template>
		</ol>
	</main>
</template>

<style>
textarea {
	width: 100%;
	height: 30ch;
}

li:hover {
	background-color: antiquewhite;
}

.li-grid {
	display: grid;
	/* grid-auto-flow: column; */
	gap: 1ch;
	grid-template-columns: 1fr 2fr 4fr 1fr 2fr;

	padding: 1ch;
	margin: 1ch;
	/* box-shadow: 0 2px 3px -2px lightgray; */
	white-space: pre-line;
}

[class^='li-field'] {
	/* background-color: antiquewhite; */
	text-align: center;
	align-self: center;
}

.add-item-form {
	display: flex;
	flex-wrap: wrap;
	max-width: 40ch;
	gap: 1ch;
	padding: 1ch;
}

.add-item-form :where(input, select, button) {
	border: solid 1px lightblue;
	padding: 0.3ch 0.5ch;
	text-align: center;
	/* flex-grow: 1; */
}

.add-item-form .long-input {
	width: 100%;
}

.add-item-form .short-input {
	width: 8ch;
}

.add-item-form .item-glue {
	margin-right: auto;
}
</style>
