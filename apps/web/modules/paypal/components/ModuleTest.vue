<template>
  <div class="my-5">
    <UiButton> My Modules Test button</UiButton>
    <div>This text is from module side: {{ $t('paypalModule.paypal') }}</div>
  </div>
</template>
<script setup lang="ts">
try {
  const { data: cart } = useCart();
  console.log('cart', cart.value);
} catch (error) {
  console.error(error);
}
</script>
