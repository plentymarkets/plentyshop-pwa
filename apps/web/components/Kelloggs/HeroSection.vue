<template>
  <section class="kl-hero-section">
    <div class="kl-hero-section__content page-width">
      <h1 class="kl-hero-section__title">
        Ihr Partner für<br> 
        Frühstücks und-<br>
        Snackmomente
      </h1>
      <p class="kl-hero-section__description">Bestelle das komplette Kellogg’s und Pringles Sortiment jederzeit und von überall!</p>
      <a href="#our-products" class="kl-button">Produkte entdecken</a>
    </div>

    <video autoplay muted loop id="kl-hero-section__video">
      <source src="https://kelloggs-shop.de/cdn/shop/t/26/assets/KelloggsChaotischesFruuehstuueck_klein.mp4?v=170548333371075359361724073548"
              type="video/mp4">
    </video>
  </section>
</template>

<script setup>
</script>

<style scoped>
.kl-hero-section {
  position: relative;
  background-image: url("https://kelloggs-shop.de/cdn/shop/t/26/assets/KelloggsChaotischesFruuehstuueck_klein.mp4?v=170548333371075359361724073548");
  background-size: cover;
  background-position: center;
  color: white;
  padding: 200px 50px 70px 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

@media (min-width: 1440px) {
  .kl-hero-section {
    aspect-ratio: auto;
    height: 83vh;
  }
}

@media (max-width: 1050px) {
  .kl-hero-section {
    padding: 350px 12px 50px 12px;
    aspect-ratio: auto;
    margin-top: 0px;
  }
}

.kl-hero-section #kl-hero-section__video {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  object-position: center 63%;
  aspect-ratio: 16 / 9;
  z-index: 0;
}

.kl-hero-section:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #0000004d;
}

.kl-hero-section .kl-hero-section__content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0;
}

.kl-hero-section .kl-hero-section__content .kl-hero-section__title {
  font-size: 90px;
  margin-bottom: 10px;
  font-weight: 800;
  line-height: 1;
  color: white;
}

@media (max-width: 1050px) {
  .kl-hero-section .kl-hero-section__content .kl-hero-section__title {
    font-size: 48px;
  }
}

.kl-hero-section .kl-hero-section__content .kl-hero-section__description {
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 30px;
  line-height: 1.2;
  max-width: 600px;
  color: white;
}

@media (max-width: 1050px) {
  .kl-hero-section .kl-hero-section__content .kl-hero-section__description {
    font-size: 14px;
  }

  .kl-hero-section .kl-hero-section__content .kl-button {
    width: 100%;
  }
}

.kl-button {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: #f60b45;
  border: 2px solid #f60b45;
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0;
  outline: none;
  padding: 12px 35px;
  text-align: center;
  text-decoration: none;
}
</style>