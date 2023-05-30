<script setup>
function onFileUpload(event) {
	console.log(event.target.files);
}
</script>

<template>
	<h1>Etykieter</h1>

	<input type="file" id="file-upload" @change="onFileUpload" multiple />
</template>

<style scoped></style>
