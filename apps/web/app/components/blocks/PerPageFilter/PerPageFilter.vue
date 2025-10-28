<template v-if="key === 'perPage' && props.content?.fields.perPage">
  <CategoryItemsPerPage class="mb-6" :total-products="productsCatalog.pagination?.totals ?? 0" />
</template>
<script setup lang="ts">
const { data: productsCatalog } = useProducts();

</script>
