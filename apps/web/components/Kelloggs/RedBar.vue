<template>
  <section class="kl-red-bar">
    <div class="kl-red-bar-wrapper">
      <div class="kl-red-bar__item">
        <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn-circled-white.svg" alt="Gratisversand ab 100 €">
        <p class="kl-red-bar__content">Gratisversand ab 100 €</p>
      </div>
      <div class="kl-red-bar__item">
        <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn-circled-white.svg" alt="Schnelle Lieferung">
        <p class="kl-red-bar__content">Schnelle Lieferung</p>
      </div>
      <div class="kl-red-bar__item">
        <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn-circled-white.svg"
             alt="Flexible Zahlungsmöglichkeiten">
        <p class="kl-red-bar__content">Flexible Zahlungsmöglichkeiten</p>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.kl-red-bar {
  background-color: #f60b45;
  padding: 30px 0;
}

@media (max-width: 1050px) {
  .kl-red-bar {
    padding: 15px 0;
  }
}

.kl-red-bar-wrapper {
  display: flex;
  justify-content: space-around;
  max-width: 950px;
  margin: 0 auto;
  gap: 8%;
}

@media (max-width: 1050px) {
  .kl-red-bar-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

.kl-red-bar__item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kl-red-bar__item img {
  width: 30px;
  height: 30px;
}

@media (max-width: 1050px) {
  .kl-red-bar__item img {
    width: 20px;
    height: 20px;
  }
}

.kl-red-bar__content {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 1050px) {
  .kl-red-bar__content {
    font-size: 16px;
  }
}
</style>
