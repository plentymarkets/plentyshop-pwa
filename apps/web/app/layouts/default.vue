<template>
  <div :class="{ 'category-page-overflow-clip': route.meta.type === 'category' }">
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="pt-3 pb-2 md:pt-4">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main class="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    
    <ClientOnly>
      <FooterBlock
        v-if="!route.meta.isBlockified"
        :content="globalFooterData"
        class="max-lg:pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]"
      />
    </ClientOnly>
    
    <QuickCheckout v-if="isOpen" :product="product" />

    <StickyContact />
    
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
// Import your exact CMS footer component
import FooterBlock from '../components/blocks/Footer/Footer.vue';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();

useHead({
  htmlAttrs: {
    class: computed(() => (route.meta.type === 'category' ? 'category-page-overflow-clip' : undefined)),
  },
  bodyAttrs: {
    class: computed(() => (route.meta.type === 'category' ? 'category-page-overflow-clip' : undefined)),
  },
});

setLogoMeta();

// --- HARDCODED FOOTER DATA FOR NON-CMS PAGES ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalFooterData: any = {
  backgroundColor: '#333333',
  textColor: '#ffffff',
  columns: [
    {
      id: 'col-1',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Logo_KK_dp_25K.png',
      title: 'Komplett Konzept Verwertungs GmbH',
      links: [
        { text: 'Über uns', url: '/ueberuns' },
        { text: 'Abbau und Demontage', url: '/abbau-und-demontage' },
        { text: 'Reparatur und Instandsetzung', url: '/reparatur-und-instandhaltung' },
        { text: 'Team', url: '/team' },
        { text: 'Stellenangebote', url: '/Stellenangebote' },
        { text: 'Partner', url: '/partner' },
        { text: 'Kontakt', url: '/Kontakt' },
        { text: 'Impressum', url: '/impressum' },
        { text: 'Warenankauf', url: 'http://www.waren-ankauf.de/' }
      ],
      socials: [
        { icon: 'facebook', url: 'https://www.facebook.com/Komplett.Konzept.GmbH/' },
        { icon: 'instagram', url: 'https://www.instagram.com/komplettkonzept/' },
        { icon: 'youtube', url: 'https://www.youtube.com/@konzeptkomplett4034' },
        { icon: 'linkedin', url: 'https://www.linkedin.com/in/mario-parlitz-77b66239/' }
      ]
    },
    {
      id: 'col-2',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Bezahlarten.png',
      title: 'Zahlung und Versand',
      links: [
        { text: 'Widerrufsrecht', url: '/widerruf' },
        { text: 'Datenschutzerklärung', url: '/datenschutz' },
        { text: 'Datenverarbeitung', url: '/datenverarbeitung' },
        { text: 'AGB', url: '/agb' }
      ],
      content: '<a href="/widerruf" style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:7px 13px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.18);border-radius:4px;color:#fff;text-decoration:none;font-size:0.8rem;font-weight:600;opacity:0.75;transition:opacity 0.15s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.75">↩ Vertrag widerrufen</a>'
    },
    {
      id: 'col-3',
      title: 'Im Shop',
      links: [
        { text: 'Produktions & Industriebedarf', url: '/kategorie/produktions-industriebedarf' },
        { text: 'Elektronik', url: '/kategorie/Elektronik-Elektrotechnik' },
        { text: 'Gastrotechnik', url: '/kategorie/gastronomie' },
        { text: 'Labor & Medizintechnik', url: '/kategorie/labor-medizintechnik' },
        { text: 'Automation, Antrieb & Steuerung', url: '/kategorie/automation-antrieb-steuerung' },
        { text: 'Regale', url: '/' },
        { text: 'Pumpen & Rohrleitungsbau', url: '/kategorie/pumpen-rohrleitungsbau' },
        { text: 'Auto, Motorrad & Zubehör', url: '/kategorie/auto-zubehoer' },
        { text: 'Maschinen & Anlagen', url: '/kategorie/maschinen-anlagen' },
        { text: 'Werkzeuge', url: '/' },
        { text: 'Transport & Logistik', url: '/' },
        { text: 'Filter & Hydraulik', url: '/' }
      ]
    }
  ],
  footnote: '© Copyright 2024 Komplett Konzept Verwertungs GmbH. All rights reserved.'
};
// -----------------------------------------------
</script>
