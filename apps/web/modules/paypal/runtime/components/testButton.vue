<template>
  <div>
    <button class="w-10 h-10 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" @click="handleClick">Test PayPal Button</button>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  alert('Test PayPal Button clicked!');
};
</script>