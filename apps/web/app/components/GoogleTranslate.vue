<template>
  <div class="google-translate-wrapper">
    <div id="google_translate_element" />
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from '#imports';

const route = useRoute();

const loadGoogleTranslate = async () => {
  // 1. Wait for Vue to finish its page-transition DOM updates
  await nextTick();

  // 2. Empty our target container so Vue stops fighting it
  const container = document.getElementById('google_translate_element');
  if (container) {
    container.innerHTML = '';
  }

  // 3. NUKE: Remove the old script and hidden iframes Google leaves behind
  const oldScript = document.getElementById('google-translate-script');
  if (oldScript) oldScript.remove();
  
  document.querySelectorAll('.goog-te-menu-frame').forEach(el => el.remove());

  // 4. NUKE: Delete the global translate object so Google is forced to start fresh
  if (window.google && window.google.translate) {
    delete window.google.translate;
  }

  // 5. Define the initialization callback
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'de',
        includedLanguages: 'de',
        // ar, zh-CN, zh-TW, hr, nl, en, fr, hi, it, pl, pt, ru, es, sv, tr
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  // 6. Inject the brand new script
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
};

onMounted(() => {
  // Initial load
  setTimeout(() => {
    loadGoogleTranslate();
  }, 100);
});

// The SPA Fix: Run the nuke and rebuild process on every single page change!
watch(() => route.path, () => {
  setTimeout(() => {
    loadGoogleTranslate();
  }, 200); // A 200ms delay ensures Vue's virtual DOM is completely done moving things around
});
</script>

<style>
/* 1. HIDE GOOGLE BRANDING & EXTRA TEXT */
.goog-logo-link {
    display: none !important;
}
.goog-te-gadget {
    color: transparent !important;
    font-size: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* 2. STYLE THE DROPDOWN MENU */
.goog-te-gadget .goog-te-combo {
    color: #062633 !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 4px 0 !important;
    margin: 0 !important;
    cursor: pointer !important;
    outline: none !important;
    vertical-align: middle !important;
}

/* 3. OPTIONAL: Hover effect */
.goog-te-gadget .goog-te-combo:hover {
    color: #0284c7 !important;
}

/* 4. HIDE TOP BANNER & LAYOUT-BREAKING IFRAMES */
.goog-te-banner-frame,
iframe.goog-te-banner-frame,
body > .skiptranslate {
    display: none !important;
}

.goog-te-gadget img {
    display: none !important;
}

.google-translate-wrapper {
    max-width: 100%;
    overflow: hidden;
}
</style>