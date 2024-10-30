<template>
  <div class="mx-auto p-5">
    <div ref="container" class="flex items-start border rounded-md overflow-hidden shadow-lg max-h-96">
      <div class="bg-primary-500 text-white text-right pr-4 pt-2 font-mono text-sm w-10">
        <div v-for="line in lineCount" :key="line">{{ line }}</div>
      </div>
      <textarea
        v-model="jsonText"
        @input="handleInput"
        @paste="handlePaste"
        @keydown.tab.prevent="insertTab"
        ref="textarea"
        class="w-full h-full p-2 font-mono text-sm border-none resize-none outline-none"
        placeholder="Edit JSON here..."
      ></textarea>
    </div>
    <UiButton @click="formatJson" class="mt-4 px-4 py-2 text-white rounded-md"> Format JSON </UiButton>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';

const jsonText = ref(
  JSON.stringify(
    {
      id: 22,
      hero: [
        {
          image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
          tagline: 'Feel the music harder',
          heading: 'Your Sound, Elevated',
          description:
            "Immerse yourself in rich, crystal-clear audio with our cutting-edge headphones. Designed for the ultimate listening experience, whether you're a casual listener or an audiophile. Discover the perfect blend of style, comfort, and sound quality that elevates your music to new heights.",
          callToAction: 'Order Now',
          link: '',
        },
        {
          image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
          tagline: 'Experience Sound Freedom',
          heading: 'Wireless. Effortless. Seamless.',
          description:
            'Unleash your audio with our state-of-the-art wireless earbuds. Designed for all-day comfort and uncompromised sound quality, these earbuds deliver crisp highs and deep bass, letting you enjoy your music without any distractions. Discover freedom with a perfect fit, long battery life, and intuitive controls.',
          callToAction: 'Shop Earbuds',
          link: '',
        },
        {
          image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/homepage-hero-headphones.avif',
          tagline: 'Amplify Your Space',
          heading: 'Big Sound, Compact Design',
          description:
            "Transform your space with our portable speakers that pack a punch. Crafted for superior sound performance, these speakers are perfect for home or on the go. With easy connectivity and a sleek design, elevate your listening experience whether you're indoors or outdoors.",
          callToAction: 'Browse Speakers',
          link: '',
        },
      ],
      valueProposition: [
        {
          text: "<div class='flex flex-col mt-5 sm:mt-20 mt-0 sm:p-0 p-5 text-center sm:text-left'><span class='text-xl font-bold mb-2'>Experience the Future of Sound</span><h2 class='text-2xl font-semibold mb-4'>Redefine Your Listening Experience</h2><p class='text-base mb-6 padding-right-desktop typography-text-sm md:typography-text-lg '>Our latest collection of headphones is designed to deliver unparalleled audio precision, with deep bass, clear highs, and an immersive experience for every genre of music. Combining sleek design, comfort, and cutting-edge technology, these headphones are made for those who refuse to compromise on sound quality.</p><ul class='list-disc list-inside typography-text-sm md:typography-text-lg'><li>Premium, studio-quality sound</li><li>Comfortable fit for extended listening</li><li>Long-lasting battery life</li><li>Seamless wireless connectivity</li></ul></div>",
          image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/headphones-mediacard.avif',
          alignment: 'left',
        },
      ],
      featured: [
        {
          headline: '',
          categoryId: 1,
        },
        {
          headline: '',
          categoryId: 2,
        },
      ],
    },
    null,
    2,
  ),
);
const errorMessage = ref('');
const textarea = ref(null);
const container = ref<HTMLElement | null>(null);

const lineCount = computed(() => {
  return jsonText.value ? jsonText.value.split('\n').length : 1;
});

const resizeTextarea = () => {
  if (textarea.value) {
    const textareaElement = textarea.value as HTMLElement;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
  }
};

const validateJson = () => {
  try {
    JSON.parse(jsonText.value);
    errorMessage.value = '';
  } catch (error: any) {
    errorMessage.value = 'Invalid JSON: ' + error.message;
  }
};

const handleInput = () => {
  validateJson();
  resizeTextarea();
};

const handlePaste = () => {
  nextTick(() => {
    validateJson();
    resizeTextarea();
  });
};

const formatJson = () => {
  try {
    const json = JSON.parse(jsonText.value);
    jsonText.value = JSON.stringify(json, null, 2);
    errorMessage.value = '';
    nextTick(resizeTextarea);
  } catch (error: any) {
    errorMessage.value = 'Invalid JSON: ' + error.message;
  }
};

const insertTab = (event: KeyboardEvent) => {
  const target = event.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  jsonText.value = jsonText.value.slice(0, Math.max(0, start)) + '  ' + jsonText.value.slice(Math.max(0, end));
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 2;
  });
};

onMounted(() => {
  resizeTextarea();
  if (container.value) {
    container.value.style.overflow = 'auto';
  }
});
</script>
