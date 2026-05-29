<template>
  <section class="w-full px-4 md:px-6 lg:px-8 2xl:px-0 pb-4" data-testid="home-intro">
    <div class="mx-auto max-w-screen-3xl space-y-4">
      <div class="text-center space-y-2 sm:space-y-3">
        <h1 :class="h1Class" data-testid="home-intro-title">
          Zuverlässiger Anbieter für Industriebedarf, Lagertechnik
        </h1>

        <h2 :class="h2Class" data-testid="home-intro-subtitle">
          und Gebrauchtmaschinen in Deutschland
        </h2>
      </div>

      <div class="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5">
        <p :class="paragraphClass" data-testid="home-intro-lead">
          Mit über 100.000 Produkten aus den Bereichen Industriebedarf, Automatisierungstechnik und Lagertechnik sind
          wir Ihr Komplettanbieter für alles, was Ihr Unternehmen benötigt. Bestellen Sie noch heute und profitieren
          Sie von einer schnellen, zuverlässigen Lieferung in ganz Deutschland und weltweit.
        </p>

        <h2 :class="[h2Class, 'text-center']" data-testid="home-intro-about-heading">Über uns</h2>

        <p :class="paragraphClass" data-testid="home-intro-about">
          Komplett Konzept ist seit 1997 tätig und unterstützt Unternehmen bei der Anlagenverwertung, bei
          Betriebsschließungen sowie beim Abbau und Wiederaufbau komplexer Industrieanlagen. Ob Sie
          Automatisierungstechnik oder komplette Lagertechniksysteme benötigen – wir bieten alles aus einer Hand. Unser
          Team beschafft und verkauft zudem Gebrauchtmaschinen zu fairen Preisen. Für jede Art von Industriebedarf sorgt
          unser engagiertes Logistikteam für eine flexible Abholung und Lieferung sowohl von Einzelteilen als auch von
          kompletten Anlagen – deutschlandweit und weltweit. Nehmen Sie Kontakt mit uns auf, wir sind für Sie da.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const h1Class = 'text-2xl sm:text-2xl font-semibold';
const h2Class = 'text-lg sm:text-xl font-semibold';
const paragraphClass = 'text-sm sm:text-base leading-relaxed';
</script>
