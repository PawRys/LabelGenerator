<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

import { useLabelsStore, type LabelInterface } from '@/stores/labels';
const labelsStore = useLabelsStore();

const regExp_ItemSize: RegExp = /\b\d+x\d+x\d+\b/i; // 12x1250x2500
const regExp_InvoiceNo: RegExp = /\bLF[0-9]{2} M[0-9]{6}\b/i;
const regExp_ContarctNo: RegExp = /\bBPL20[0-9]{2}-[0-9]{4,5}\b/i;
const regExp_ItemPacking: RegExp = /\b\d+x\d+\b/i; // 16x50
const regExp_ItemGlueing: RegExp = /\b(EXT|WD|INT|MR)\b/i;
const regExp_ItemDescription: RegExp = /\b(Birch plywood|EXT|WD|INT|MR)\b/i;

async function addItemsFromFiles(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement;
	const pdfFiles = target.files as FileList;
	const textFiles = await extractTextFromPDF(pdfFiles);
	const usefullData = filterUselessData(textFiles);
	const dataToDisplay = buildDataToDisplay(usefullData);

	labelsStore.addItem(...dataToDisplay);
	target.value = ''; /**reset input */
}

async function extractTextFromPDF(files: FileList): Promise<string[]> {
	const filesCount = files.length;
	let result = [];
	for (let fileNo = 0; fileNo < filesCount; fileNo++) {
		const file = files[fileNo];
		if (file.type !== 'application/pdf') {
			console.log(`Invalid file type: ${file.type}`, file);
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

function filterUselessData(textFile: String[]): Array<String> {
	let output = [];
	const textFileLenght = textFile.length;
	for (let i = 0; i < textFileLenght; i++) {
		let lastOutput = output[output.length - 1] as string;
		let currentItem = textFile[i] as string;
		let testSum = 0;

		testSum += regExp_ItemSize.test(currentItem) ? 1 : 0;
		testSum += regExp_InvoiceNo.test(currentItem) ? 1 : 0;
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

function buildDataToDisplay(items: String[]): LabelInterface[] {
	let result = [];
	const itemsLength = items.length;
	let itemSize: string = '';
	let invoiceNo: string = getPurifiedInvoiceNo(items.join('\t'));
	let contractNo: string = getPurifiedContractNo(items.join('\t'));
	let itemPacksCount: string = '';
	let itemPackSize: string = '';
	let itemGlueing: string = '';
	let itemDescription: string = '';
	let itemType: string = '';

	for (let i = 0; i < itemsLength; i++) {
		const item = items[i] as string;

		// if (regExp_InvoiceNo.test(item)) {
		// 	invoiceNo = getPurifiedInvoiceNo(item);
		// 	itemType = 'invoiceNo';
		// }

		// if (regExp_ContarctNo.test(item)) {
		// 	contractNo = getPurifiedContractNo(item);
		// 	itemType = 'contractNo';
		// }

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
				invoice: invoiceNo,
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

	console.log(result);

	return result;
}

function getPurifiedDescription(input: string | null): string {
	const destructuredName: Array<string> = input?.split(', ') || [];
	let purifiedName: Array<string> = [];
	for (let text of destructuredName) {
		// Ommit junk chunks
		if (text.match(/(edges sealed|Const|Spec|441233\d\d|\(1\)\(2\)|RAL|EXT|WD|INT|MR)/i)) continue;
		// Erase junk words
		text = text
			.replace(/\b(Birch plywood RIGA|MEL|TEX|FORM|PLY|COMPOSITE)\b/gi, '')
			.replace(/\b(CODE|WPC|SP1|1F45M|R7010|without|\d{5,})\b/gi, '')
			.trim();
		purifiedName.push(text);
	}
	return purifiedName.join(' ') || "it's null";
}

function getPurifiedSize(input: string): string {
	const match = input?.match(/\b\d+([,.]\d+)?x\d+x\d+\b/i) || ['0x0x0'];
	return match[0];
}

function getPackingInfo(input: string): Array<string> {
	const matching = input.match(/\b\d+x\d+\b/i) || ['1x0'];
	return matching[0].split('x');
}

function getPurifiedInvoiceNo(input: string): string {
	const match = input.match(regExp_InvoiceNo);
	return match ? match[0].trim() : '';
}

function getPurifiedContractNo(input: string): string {
	const match = input.match(regExp_ContarctNo);
	return match ? match[0].trim() : '';
}

function getItemGlueing(input: string): string {
	const matching = input.match(/\b(EXT|WD|INT|MR)\b/i) || [''];
	return matching[0];
}
</script>

<template>
	<section>
		<div class="narrow-box">
			<p>Wczytaj faktury z Latvijas Finieris w formacie pdf.</p>
			<p>Możesz wybrać kilka plików jednocześnie.</p>
			<div class="button-bar"><label for="file-upload" class="button cta">Dodaj pliki</label></div>
			<input type="file" name="file-upload" id="file-upload" class="" multiple @change="addItemsFromFiles" hidden />
		</div>
	</section>
</template>

<style scoped>
section {
	margin-block: 2em;
}
</style>
