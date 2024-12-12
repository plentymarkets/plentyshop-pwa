<template>
  <section class="kl-our-products !mb-16">
    <div class="kl-section-title-wrapper lg:text-center mb-8 pl-2">
      <p class="g-16 lg:g-18" id="our-products">Unsere Produkte</p>
      <p class="g-40 lg:g-56">Entdecke köstliche Snacks und Frühstücksfreuden</p>
    </div>
    <div class="kl-our-products-wrapper kl-card-slider">
      <div class="kl-slides">
        <div
             id="pringles"
             class="kl-our-products-card"
             tabindex="0"
             role="region"
             aria-labelledby="pringles-title"
             aria-describedby="pringles-description">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/img-pringles@2x.png" alt="Pringles">
          </div>
          <p id="pringles-title" class="kl-card-title">Pringles</p>
          <p id="pringles-description" class="kl-card-description">
            Ob der intensive Kick von Salt & Vinegar oder die köstlich saure Note von Sour Cream & Onion: Du wirst
            garantiert deinen perfekten Pringles Moment finden.
          </p>
          <NuxtLink
                    to="/snacks/pringles"
                    class="bg-white rounded-full p-3 mx-4 text-black text-center g-16 mb-4">
            Alle ansehen
          </NuxtLink>
        </div>

        <div
             id="cereal"
             class="kl-our-products-card"
             tabindex="0"
             role="region"
             aria-labelledby="cereal-title"
             aria-describedby="cereal-description">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/img-cerealien@2x.png" alt="Cerealien">
          </div>
          <p id="cereal-title" class="kl-card-title">Cerealien</p>
          <p id="cereal-description" class="kl-card-description">
            Kellogg's Tresor, Kellogg's Smacks, Kellogg's Frosties oder doch Special K? Du hast die Wahl - bei dem
            vielfältigen Cerealien-Sortiment findet jeder was!
          </p>
          <NuxtLink
                    to="/fruehstueck/cerealien"
                    class="bg-white rounded-full p-3 mx-4 text-black text-center g-16 mb-4">
            Alle ansehen
          </NuxtLink>
        </div>
        <div
             id="muesli"
             class="kl-our-products-card"
             tabindex="0"
             role="region"
             aria-labelledby="muesli-title"
             aria-describedby="muesli-description">
          <div class="kl-img-wrapper">
            <img src="https://kelloggs-shop.de/cdn/shop/t/26/assets/img-muesli@2x.png" alt="Müsli">
          </div>
          <p id="muesli-title" class="kl-card-title">Müsli</p>
          <p id="muesli-description" class="kl-card-description">
            Das Problem ist, dass sie zu gut schmecken! Von Schokolade bis Nüssen - unser Müsli-Sortiment ist nicht nur
            zum Frühstück ein Highlight!
          </p>
          <NuxtLink
                    to="/fruehstueck/muesli"
                    class="bg-white rounded-full p-3 mx-4 text-black text-center g-16 mb-4">
            Alle ansehen
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.kl-our-products {
  padding: 30px 0 0 0;
  max-width: 1160px;
  margin: 0 auto;
}

@media (max-width: 1050px) {
  .kl-our-products {
    padding: 15px 0 0 0;
  }
}

.kl-our-products-wrapper {
  padding: 0 15px;
}

.kl-our-products-wrapper .kl-slides {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 30px;
  width: 100%;
  overflow: auto;
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
}

.kl-our-products-wrapper .kl-our-products-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.kl-our-products-wrapper .kl-our-products-card .kl-card-title {
  font-size: 32px;
  font-weight: 800;
  margin: 30px 0 8px 0;
  line-height: 1;
}

.kl-our-products-wrapper .kl-our-products-card .kl-card-description {
  font-size: 16px;
  padding-bottom: 20px;
  line-height: 1.4;
  margin-top: 8px;
  font-weight: 500;
  margin-bottom: 0;
}

.kl-our-products-wrapper .kl-our-products-card a.kl-card-button {
  text-align: center;
  text-decoration: none;
  display: block;
  margin-top: auto;
  margin-bottom: 20px;
  outline: none;
  box-shadow: none;
}

.kl-our-products-wrapper .kl-our-products-card#pringles {
  background: #f60b45;
  color: white;
}

.kl-our-products-wrapper .kl-our-products-card#poptarts {
  background: #8000ff;
  color: white;
}

.kl-our-products-wrapper .kl-our-products-card#cereal {
  background: #205cdd;
  color: white;
}

.kl-our-products-wrapper .kl-our-products-card#muesli {
  background: #ffc426;
  color: black;
}

.kl-our-products-wrapper .kl-our-products-card .kl-img-wrapper {
  width: 100%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  max-width: 100%;
}

.kl-our-products-wrapper .kl-our-products-card img {
  aspect-ratio: 1/1;
  object-fit: contain;
  object-position: center center;
  max-width: 100%;
  transition: transform 300ms ease;
}

.kl-our-products-wrapper .kl-our-products-card:hover img {
  transform: scale(1.12);
}

.kl-our-products-wrapper .kl-image-slider-controls {
  display: none;
}

@media only screen and (max-width: 1050px) {
  .kl-our-products-wrapper .kl-our-products-card img {
    min-width: 280px;
  }

  .kl-our-products-wrapper .kl-slides {
    padding-right: 50px;
  }

  .kl-our-products-wrapper {
    padding: 0 0 0 15px;
  }

  .kl-our-products-wrapper .kl-image-slider-controls {
    display: block;
    padding-right: 15px;
  }
}
</style>