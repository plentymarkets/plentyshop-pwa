<template>
  <section class="kl-our-benefits page-width">
    <div class="kl-section-title-wrapper lg:text-center mb-8 pl-2">
      <p class="g-16 lg:g-18">Unsere Benefits</p>
      <p class="g-40 lg:g-56">Erfahre deine Vorteile auf einen Blick!</p>
    </div>
    <div class="kl-our-benefits-wrapper kl-card-slider">
      <div class="kl-slides">
        <div
             id="pringles"
             class="kl-our-benefits-card"
             tabindex="0"
             role="region">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/World@2x.png" alt="Shop">
          </div>
          <p class="kl-card-title">Ein Shop, der für alle da ist</p>
          <p class="kl-card-description">
            Egal, ob du als Individualist nach dem perfekten Frühstück suchst oder als Händler hochwertige Snacks und
            Cerealien für dein Unternehmen benötigst – unser Online-Shop ist die ideale Anlaufstelle für dich.
          </p>
        </div>
        <div
             id="poptarts"
             class="kl-our-benefits-card"
             tabindex="0"
             role="region">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/Plant@2x.png" alt="Vielfalt">
          </div>
          <p class="kl-card-title">Vielfalt für jeden Geschmack</p>
          <p class="kl-card-description">
            Unser Sortiment bietet für jeden Geschmack etwas Passendes. Ob du nun nach knusprigen Cornflakes, leckeren
            Müslis oder herzhaften Snacks suchst, bei uns wirst du fündig!
          </p>
        </div>
        <div
             id="cereal"
             class="kl-our-benefits-card"
             tabindex="0"
             role="region">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/Cereal Bowl@2x.png" alt="Familie">
          </div>
          <p class="kl-card-title">Perfekt für Familie und Büro</p>
          <p class="kl-card-description">
            Unsere Produkte eignen sich nicht nur perfekt für dich und deine Familie, sondern auch als hochwertige
            Snack-Option für dein Unternehmen. Verwöhne deine Mitarbeiter und Kunden mit den beliebten Marken.
          </p>
        </div>
        <div
             id="muesli"
             class="kl-our-benefits-card"
             tabindex="0"
             role="region">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/Person Kopie@2x.png" alt="Zufriendenheit">
          </div>
          <p class="kl-card-title">Unser Ziel: Deine Zufriedenheit</p>
          <p class="kl-card-description">
            Unser Team steht dir jederzeit zur Verfügung, um deine Fragen zu beantworten und dich bei deiner Auswahl zu
            unterstützen. Wir legen großen Wert auf Kundenzufriedenheit.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
  .kl-our-benefits {
    padding: 40px 0 50px 0;
  }

  @media (max-width: 1050px) {
    .kl-our-benefits {
      padding: 15px 0;
    }
  }

  .kl-our-benefits-wrapper {
    padding: 0 15px;
  }

  .kl-our-benefits-wrapper .kl-slides {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 10px;
    width: 100%;
    overflow: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .kl-our-benefits-wrapper .kl-our-benefits-card {
    padding: 15px;
    display: flex;
    flex-direction: column;
    color: black;
  }

  .kl-our-benefits-wrapper .kl-our-benefits-card .kl-card-title {
    font-size: 32px;
    font-weight: 800;
    margin: 40px 0 10px 0;
    line-height: 1;

    @media only screen and (min-width: 1050px) {
      max-width: 300px;
    }
  }

  .kl-our-benefits-wrapper .kl-our-benefits-card .kl-card-description {
    font-size: 16px;
    padding-bottom: 20px;
    line-height: 1.4;
    margin-top: 8px;
    font-weight: 500;
  }

  .kl-our-benefits-wrapper .kl-our-benefits-card button.kl-card-button {
    margin-top: auto;
    margin-bottom: 20px;
    outline: none;
    box-shadow: none;
  }

  .kl-our-benefits-wrapper .kl-our-benefits-card .kl-img-wrapper {
    width: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .kl-our-benefits-wrapper .kl-our-benefits-card img {
    aspect-ratio: 1/1;
    object-fit: contain;
    object-position: center center;
    max-width: 180px;
  }

  .kl-our-benefits-wrapper .kl-image-slider-controls {
    display: none;
  }

  @media only screen and (max-width: 1050px) {
    .kl-our-benefits-wrapper .kl-our-benefits-card img {
      min-width: 180px;
    }

    .kl-our-benefits-wrapper .kl-slides {
      padding-right: 50px;
    }

    .kl-our-benefits-wrapper .kl-slides > div {
      width: 90vw;
      padding: 0px 15px 0px 0px;
    }

    .kl-our-benefits-wrapper {
      padding: 0 0 0 15px;
    }

    .kl-our-benefits-wrapper .kl-image-slider-controls {
      display: block;
      padding-right: 15px;
    }
  }
</style>