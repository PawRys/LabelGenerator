<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
const labelsStore = useLabelsStore();

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
</script>

<template>
	<section>
		<div class="narrow-box">
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
</template>

<style scoped>
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
</style>
