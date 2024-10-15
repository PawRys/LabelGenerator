<script setup lang="ts">
import { useLabelsStore, type LabelInterface } from '@/stores/labels';
const labelsStore = useLabelsStore();

function addItem(input: Event): void {
	input.preventDefault();
	const form = input.target as HTMLFormElement;
	const formData = new FormData(form);
	const result = Object.fromEntries([...formData.entries()]) as unknown;
	labelsStore.addItem(result as LabelInterface);
}
</script>

<template>
	<section>
		<div class="narrow-box">
			<form class="add-item-form" @submit.prevent="addItem" autocomplete="on">
				<input type="text" name="itemSize" class="item-size" placeholder="duży tekst" />
				<textarea name="longDesc" class="long-desc" placeholder="średni tekst"></textarea>

				<section class="inputs-in-row">
					<select name="itemGlue" class="item-glue">
						<option value="">Klej</option>
						<option value="EXT">EXT</option>
						<option value="WD">WD</option>
						<option value="INT">INT</option>
						<option value="MR">MR</option>
					</select>

					<input type="number" name="packsCount" class="packs-count" placeholder="paczki" min="1" value="1" />
					<span>x</span>
					<input type="number" name="packSize" class="pack-size" placeholder="sztuki" min="0" value="0" />
					<span>szt.</span>
				</section>

				<input type="text" name="contract" class="contract-number" placeholder="mały tekst" />

				<div class="button-bar">
					<button type="reset">Wyczyść formularz</button>
					<button type="submit" class="cta">Dodaj etykietę</button>
				</div>
			</form>
		</div>
	</section>
</template>

<style scoped>
.add-item-form {
	display: grid;
	gap: 1em;
}

:is(input, select, textarea) {
	padding: 0.3em 0.5em;
	border: solid 1px lightsteelblue;
	text-align: center;
}

.item-size {
	width: 100%;
	font-size: 1.2rem;
}

.long-desc {
	font-size: 1.2rem;
}

.item-glue {
	margin-right: auto;
}

.inputs-in-row {
	display: flex;
	gap: 0.5em;
	align-items: center;
	border: none;
}

.inputs-in-row :where(input, select, textarea) {
	width: 8ch;
}
</style>
