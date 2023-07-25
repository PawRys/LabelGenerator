<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from './InputChoice/FileUpload.vue';
import FormInput from './InputChoice/FormInput.vue';

const currentComp = ref('FileUpload');
const components: any = { FileUpload, FormInput };
</script>

<template>
	<section class="choice">
		<menu class="choice-menu">
			<li class="choose-item" :class="{ active: currentComp === 'FileUpload' }" @click="currentComp = 'FileUpload'">
				Wybierz pliki z komputera
			</li>
			<li class="choose-item" :class="{ active: currentComp === 'FormInput' }" @click="currentComp = 'FormInput'">
				Dodaj przez formularz
			</li>
		</menu>
		<component class="" :is="components[currentComp]"></component>
	</section>
</template>

<style scoped>
.choice {
	border: dashed 1px steelblue;
	padding: 1em;
	padding-top: 0;
}

.choice-menu {
	display: flex;
	gap: 1em;
	margin-bottom: 1em;
}

.choose-item {
	list-style: none;
	border: dashed 1px lightsteelblue;
	border-top: none;
	padding: 1em;
	font-size: 1.1em;

	cursor: pointer;
}

.choose-item:where(.active) {
	z-index: 1;
	border-color: steelblue;
	box-shadow: 0 1px 1px white;
	font-weight: 600;
}
</style>
