<template>
  <div>
    <h1>Test Route Response</h1>
    <button @click="fetchData">Fetch Data</button>
    <p v-if="loading">Loading...</p>
    <pre v-if="data">{{ data }}</pre>
    <p v-if="error">Error: {{ error.message }}</p>
  </div>
</template>

<script setup>
// NOTE
// This is a test component that illustrates how we can register custom routes on the express backend of this nuxt project (e.g. for wrapping API requests)

import { ref } from 'vue';

const data = ref(null);
const error = ref(null);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  data.value = null;

  try {
    const response = await $fetch('http://localhost:8181/test');
    data.value = response.message;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};
</script>