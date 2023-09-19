<template>
    <div class="w-full bg-white flex items-center justify-center flex-col shadow-xl md:hidden">
        <SfButton v-for="locale in localeObj" variant="tertiary" square :aria-label="$t('lang.' + locale.code?.toString())" class="py-3 cursor-pointer"
            @click="switchLocale(locale.code?.toString())">{{ $t('lang.' + locale.code.toString()) }}</SfButton>
    </div>
    <div class="hidden md:flex w-full bg-white items-center justify-center absolute z-[99999] top-[10%] shadow-xl">
        <SfButton v-for="locale in localeObj" variant="tertiary" square :aria-label="$t('lang.' + locale.code?.toString())" class="px-10 py-10 cursor-pointer"
            @click="switchLocale(locale.code?.toString())">{{ $t('lang.' + locale.code?.toString()) }}</SfButton>
    </div>
</template>
<script setup lang="ts">
import type {
  LocaleObject
} from 'vue-i18n-routing'

const { locales, setLocaleCookie, getLocaleCookie } = useI18n();
const localeObj = (locales as unknown) as LocaleObject[];
const router = useRouter();
const route = useRoute();
const switchLocalePath = useSwitchLocalePath();

const switchLocale = (language: any) => {
      setLocaleCookie(language);
      console.log(getLocaleCookie())
        router.push(switchLocalePath(language));
    };
</script>