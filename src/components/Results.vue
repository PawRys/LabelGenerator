<script setup lang="ts">
import { useLabelsStore } from '@/stores/labels';
import LabelForm from './InputChoice/LabelForm.vue';
import TextInput from './InputChoice/TextInput.vue';

const labelsStore = useLabelsStore();
function logme(e: any): void {
	console.log(e);
}
</script>
<template>
	<section>
		<table>
			<tr
				v-for="({ contract, longDesc, itemSize, itemGlue, packsCount, packSize }, index) in labelsStore.items"
				:key="index">
				<td>{{ index + 1 }}.</td>
				<td>
					<TextInput :index="index" :datakey="'itemSize'" />
				</td>
				<td class="table__long-desc">{{ longDesc }}</td>
				<td>{{ itemGlue }}</td>
				<td>{{ `${packsCount}x${packSize}` }}</td>
				<td>
					<TextInput :index="index" :datakey="'contract'" />
				</td>
				<td class="button-bar">
					<button @click="labelsStore.removeItem(index)">Usuń</button>
					<button @click="logme(index)">Zmień</button>
				</td>
				<!-- <td>
					<textarea style="width: 100%; white-space: nowrap">{{
						`${itemSize} | ${longDesc} | ${itemGlue} | ${packsCount}x${packSize} | ${contract}`
					}}</textarea>
					<LabelForm /> 
				</td> -->
			</tr>
		</table>
		<hr class="divider narrow-box" />
	</section>
</template>

<style scoped>
table {
	margin-inline: auto;
	/* margin-bottom: 5em; */
	width: 100%;
	border-spacing: 1em;
}

.table__long-desc {
	white-space: pre-wrap;
	text-align: center;
	line-height: 1.5;
}
.divider {
	margin-block: 2em 4em;
	border: none;
	border-bottom: dotted 1px lightsteelblue;
}
</style>
