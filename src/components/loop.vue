<script setup lang="ts">
import {} from 'vue';
const props = defineProps({
	item: Array,
});

const item = props.item;
</script>

<template>
	<li v-for="n of +item[4]">
		<slot></slot>
	</li>
</template>
