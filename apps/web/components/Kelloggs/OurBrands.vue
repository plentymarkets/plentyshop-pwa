<template>
  <section class="kl-our-brands">
    <section class="kl-our-brands__text">
      <p class="kl-our-brands__small-title">Unsere Marken</p>
      <h3 class="kl-our-brands__large-title">Erkunde die Vielfalt bei uns</h3>
    </section>
    <section class="kl-our-brands__brand kl-our-brands__kelloggs">
      <img
           class="kl-our-brands__brand__logo"
           alt="Kelloggs"
           width="150"
           height="150"
           src="https://kelloggs-shop.de/cdn/shop/t/26/assets/kelloggs-logo.svg">
      <nav>
        <a href="https://www.facebook.com/kelloggs.deutschland/">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--facebook.svg"
               alt="Facebook - Kelloggs Deutschland">
        </a>
        <a href="https://www.instagram.com/kelloggs_de">
          <img
               width="20"
               height="20"
               src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--instagram.svg"
               alt="Instagram - Kelloggs Deutschland">
        </a>
        <a href="https://www.youtube.com/user/KELLOGGDeutschland">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--youtube.svg"
               alt="Youtube - Kelloggs Deutschland">
        </a>
        <a href="https://www.tiktok.com/@kelloggs_de">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--tiktok.svg"
               alt="TikTok - Kelloggs Deutschland">
        </a>
      </nav>
    </section>
    <section class="kl-our-brands__brand kl-our-brands__pringles">
      <img
           class="kl-our-brands__brand__logo"
           alt="Pringles"
           width="150"
           height="150"
           src="https://kelloggs-shop.de/cdn/shop/t/26/assets/pringles-logo.png">
      <nav>
        <a href="https://www.facebook.com/PringlesDeutschland/">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--facebook.svg"
               alt="Facebook - Pringles Deutschland">
        </a>
        <a href="https://www.instagram.com/pringles_de/">
          <img
               width="20"
               height="20"
               src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--instagram.svg"
               alt="Instagram - Pringles Deutschland">
        </a>
        <a href="https://www.youtube.com/channel/UCzwrjVlnMRynB80igUyAioQ">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--youtube.svg"
               alt="Youtube - Pringles Deutschland">
        </a>
        <a href="https://www.tiktok.com/@pringles_de">
          <img width="20" height="20" src="https://kelloggs-shop.de/cdn/shop/t/26/assets/icn--tiktok.svg"
               alt="TikTok - Pringles Deutschland">
        </a>
      </nav>
    </section>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.kl-our-brands {
  display: flex;
  justify-content: center;
  padding: 70px 30px;
  background: #f60b45;

  @media only screen and (max-width: 1050px) {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
  }

  &__text {
    color: white;
    font-weight: 800;
    max-width: 300px;
    margin-right: 80px;

    @media only screen and (max-width: 1050px) {
      grid-column: 1/3;
      max-width: none;
      margin-bottom: 20px;
      margin-right: 0;
    }

    * {
      margin: 0;
    }
  }

  &__small-title {
    font-size: 16px;
    margin-bottom: 8px;
  }

  &__large-title {
    font-size: 56px;
    line-height: 1;
    margin: 0;
    color: white;
    font-weight: 800;

    @media only screen and (max-width: 1050px) {
      font-size: 40px;
    }
  }

  &__brand {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: white;
    aspect-ratio: 1/1;
    height: 300px;
    overflow: hidden;
    margin-right: 40px;

    @media only screen and (max-width: 1050px) {
      height: auto;
      margin-right: 0;
    }

    &__logo {
      width: 80%;
      height: 50%;
      margin-top: auto;
      margin-bottom: -70px;
      object-fit: contain;
      object-position: center center;
      transition: all 250ms ease-out;

      @media only screen and (max-width: 780px) {}

      @media only screen and (max-width: 1050px) {
        margin-bottom: -10px;
      }
    }

    nav {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: auto auto;
      transition: all 350ms ease-out;
      overflow: hidden;
      transform: translatey(60px);
      opacity: 0;
      margin-bottom: 20px;

      @media only screen and (max-width: 1050px) {
        transform: translatey(0px);
        opacity: 1;
        margin-bottom: 10px;
      }

      a {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        text-decoration: none;

        img {
          width: 80%;
          height: 80%;
          aspect-ratio: 1/1;
          margin: 3px;
        }
      }
    }

    &:hover {
      .kl-our-brands__brand__logo {
        margin-bottom: 0;
      }

      nav {
        transform: translatey(0px);
        opacity: 1;
      }
    }
  }
}
</style>
