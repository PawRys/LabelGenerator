<script setup lang="ts">
import { ref, reactive } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

import { useLabelsStore } from '@/stores/labels';

const regExp_ItemSize: RegExp = /\b\d+x\d+x\d+\b/i; // 12x1250x2500
const regExp_ContarctNo: RegExp = /\b(Contract)\b/i;
const regExp_ItemPacking: RegExp = /\b\d+x\d+\b/i; // 16x50
const regExp_ItemGlueing: RegExp = /\b(EXT|WD|INT|MR)\b/i;
const regExp_ItemDescription: RegExp = /\b(Birch plywood|EXT|WD|INT|MR)\b/i;

const labelsStore = useLabelsStore();

interface Results {
	contract: string;
	longDesc: string;
	itemSize: string;
	itemGlue: string;
	packsCount: string;
	packSize: string;
}

function addItem(input: Event): void {
	input.preventDefault();
	const form = input.target as HTMLFormElement;
	const formData = new FormData(form);
	const result = Object.fromEntries([...formData.entries()]);
	labelsStore.addItem(result);
}

function removeItem(index: number): void {
	labelsStore.removeItem(index);
}

async function addItemsFromFiles(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement;
	const files = target.files as FileList;
	const extractedData = await extractDataFromPDF(files);
	const usefullData = filterUselessData(extractedData);
	const dataToDisplay = buildDataToDisplay(usefullData);
	labelsStore.addItem(...dataToDisplay);
	// reset input
	target.value = '';

	// console.log('extractedData: ', extractedData);
	// console.log('usefullData: ', usefullData);
	// console.log('dataToDisplay: ', dataToDisplay);
}

async function extractDataFromPDF(files: FileList): Promise<string[]> {
	const filesCount = files.length;
	let result = [];
	for (let fileNo = 0; fileNo < filesCount; fileNo++) {
		const file = files[fileNo];
		if (file.type !== 'application/pdf') {
			console.log('Invalid file type:', file.type, file);
			continue;
		}
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

function filterUselessData(input: String[]): Array<String> {
	let output = [];
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

function buildDataToDisplay(items: String[]): Results[] {
	let result = [];
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
		if (text.match(/(edges sealed|Const|Spec|441233\d\d|\(1\)\(2\)|RAL|EXT|WD|INT|MR)/i)) continue;
		// Erase junk words
		text = text.replace(/\b(Birch|plywood|RIGA|MEL|TEX|FORM|PLY|CODE|\d{5,})\b/gi, '').trim();
		// Prevent white space wrapping
		text = text.replace(/ (I{1,2}\b)/g, ' $1');
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

function printPage() {
	window.print();
}

function plural(one: string, two: string, tre: string, val: number): String {
	let result = '';
	if (val === 1) result = one;
	else if (val % 10 > 1 && val % 10 < 5 && (val % 100 < 10 || val % 100 > 20)) result = two;
	else if (val >= 5) result = tre;
	return result;
}
</script>

<template>
	<section class="noprint">
		<h1>Etykieter</h1>
		<section class="choice">
			<div class="narrow-box">
				<h2>Wybierz pliki z komputera</h2>
				<p>Wczytaj faktury z Latvijas Finieris w formacie pdf.</p>
				<p>Możesz wybrać kilka plików jednocześnie.</p>
				<div class="button-bar"><label for="file-upload" class="button cta">Dodaj pliki</label></div>
				<input type="file" name="file-upload" id="file-upload" class="" multiple @change="addItemsFromFiles" hidden />
			</div>
		</section>
		<section class="choice-break">--- lub ---</section>
		<section class="choice">
			<div class="narrow-box">
				<h2>Dodaj przez formularz</h2>
				<form class="add-item-form" @submit.prevent="addItem">
					<input
						type="text"
						name="itemSize"
						class="form__item-size long-input"
						placeholder="format"
						pattern="\d+([,.]\d)?x\d+x\d+"
						required
						autocomplete="on" />
					<textarea
						type="text"
						name="longDesc"
						class="form__long-desc long-input"
						placeholder="klasa"
						autocomplete="on"></textarea>
					<section class="short-fields">
						<select name="itemGlue" class="form__item-glue short-input" required>
							<option value="EXT">EXT</option>
							<option value="WD">WD</option>
							<option value="INT">INT</option>
							<option value="MR">MR</option>
						</select>
						<input
							type="number"
							name="packsCount"
							class="form__packsCount short-input"
							placeholder="paczki"
							min="1"
							required />
						<span>x</span>
						<input
							type="number"
							name="packSize"
							class="form__pack-size short-input"
							placeholder="sztuki"
							min="0"
							required />
						<span>szt.</span>
					</section>
					<input type="text" name="contract" class="contractNo long-input" placeholder="klient" autocomplete="on" />
					<div class="button-bar">
						<button type="reset">Wyczyść formularz</button>
						<button type="submit" class="cta">Dodaj etykietę</button>
					</div>
				</form>
			</div>
		</section>

		<template v-if="labelsStore.items.length > 0">
			<section class="choice-break">---</section>
			<div class="button-bar narrow-box">
				<span class="paper-count">{{
					`${labelsStore.count()} ${plural('strona', 'strony', 'stron', labelsStore.count())}`
				}}</span>
				<span class="paper-count__info" data-tip="Liczba stron powinna zgadzać się z ilością paczek na CMR.">?</span>

				<button class="cta" @click="printPage">Drukuj</button>
				<button @click="labelsStore.removeAll()">Usuń wszystkie</button>
			</div>
		</template>

		<table>
			<tr
				v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
				:key="index">
				<td>{{ index + 1 }}.</td>
				<td>{{ itemSize }}</td>
				<td class="table__long-desc">{{ longDesc }}</td>
				<td>{{ itemGlue }}</td>
				<td>{{ `${packsCount}x${packSize}` }}</td>
				<td>{{ contract }}</td>
				<td>
					<button @click="removeItem(index)">Usuń</button>
				</td>
			</tr>
		</table>
	</section>

	<section class="printme">
		<template
			v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
			:key="index">
			<section v-for="n in +packsCount" class="a4-paper">
				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<div class="label__text-row">
						<span class="label__item-glue">{{ itemGlue }}</span>
						<span class="label__contract">{{ contract }}</span>
						<span class="label__pack-szie">{{ packSize }}</span>
					</div>
				</div>

				<hr class="label-divider" />

				<div class="label">
					<div class="label__item-size">{{ itemSize }}</div>
					<div class="label__long-desc">{{ longDesc }}</div>
					<div class="label__text-row">
						<span class="label__item-glue">{{ itemGlue }}</span>
						<span class="label__contract">{{ contract }}</span>
						<span class="label__pack-szie">{{ packSize }}</span>
					</div>
				</div>
			</section>
		</template>
	</section>
</template>

<style scoped>
@page {
	size: 210mm 297mm;
	/* margin: 0; */
}

.printme {
	display: none;
}
@media print {
	.noprint {
		display: none;
	}
	.printme {
		display: block;
	}

	* {
		/* box-sizing: border-box;
		position: relative; */
		padding: 0;
		border: 0;
		margin: 0;
	}

	.a4-paper {
		/* outline: solid 1px red; */

		display: grid;
		gap: 1cm;
		grid-template-rows: 1fr 1px 1fr;
		height: calc(100vh - 1mm);
		height: calc(100svh - 1mm);
		/* height: calc(100dvh - 5mm); */
		page-break-before: always;
		overflow: hidden;
	}

	.a4-paper:nth-of-type(1) {
		page-break-before: avoid;
	}

	.label {
		display: grid;
		gap: 0.5cm;
		align-self: self-end;
		font-size: 1.8cm; /* Master font size for all label childs */
		font-weight: 500;
		text-align: center;
		line-height: 1;
	}

	.label__item-size {
		font-size: 1.5em;
		font-weight: 600;
	}
	.label__long-desc {
		font-size: 1em;
		white-space: break-spaces;
		text-align: center;
		min-height: 1em;
	}

	.label__text-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}

	.label__contract {
		font-size: 0.5em;
		font-weight: 400;
	}
	.label__pack-szie::after {
		content: 'szt.';
		font-size: 0.5em;
		font-weight: 400;
	}

	.label-divider {
		border-bottom: dashed 1px gray;
		width: 100%;
	}
}
footer {
	height: 4em;
}
.choice {
	border: dashed 1px steelblue;
	padding: 1em;
}

.choice-break {
	text-align: center;
	margin-block: 2em;
}

.narrow-box {
	margin-inline: auto;
	max-width: 60ch;
}
.add-item-form {
	display: flex;
	flex-direction: column;
	gap: 1em;
}

:is(input, select, textarea) {
	padding: 0.3em 0.5em;
	border: solid 1px lightsteelblue;
	text-align: center;
}

.form__item-size {
	width: 100%;
	font-size: 22rem;
}

.form__long-desc {
	font-size: 22rem;
}

.short-fields {
	display: flex;
	gap: 0.5em;
	align-items: center;
	border: none;
}

.short-input {
	width: 10ch;
}

.form__item-glue {
	margin-right: auto;
}

.button-bar {
	display: flex;
	gap: 1em;
	justify-content: center;
	align-items: center;
}

.paper-count {
	font-size: 1.5em;
	font-weight: 500;
}

.paper-count__info {
	display: inline-flex;
	justify-content: center;
	align-items: center;

	margin-right: auto;
	width: 3ch;
	aspect-ratio: 1;
	border-radius: 100vh;
	box-shadow: 0 0 0.1em steelblue;

	color: steelblue;
	/* font-weight: 500; */
	cursor: help;
}
.paper-count__info:hover::after {
	content: attr(data-tip);
	position: absolute;
	translate: -50% 0%;
	z-index: 1;
	left: 50%;
	bottom: 150%;

	padding: 0.5em;
	width: 28ch;

	border-radius: 0.5em;
	box-shadow: 0em 0.1em 0.3em lightsteelblue;

	background-color: white;
	/* font-size: 0.9em; */
	/* font-weight: 300; */
	text-align: center;
}

table {
	margin-inline: auto;
	margin-bottom: 5em;
	width: 100%;
	border-spacing: 1em;
}

.table__long-desc {
	white-space: pre-wrap;
	text-align: center;
	line-height: 1.5;
}
</style>
