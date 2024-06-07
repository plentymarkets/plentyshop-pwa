<!-- CHANGES -->
<template>
  <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-16 text-center">
    <hr class="border-primary-700 mb-7" />
    <div>
      <p class="typography-headline-3 sm:typography-headline-2  mb-5">Zahlungs- & Versandarten</p>
    </div>
    <div class="flex gap-4 justify-center">
      <img v-for="paymentIcon in paymentIcons" :src="paymentIcon.imgUrl" :alt="paymentIcon.name" loading="lazy" class="w-[60px] filter grayscale" />
    </div>
    <hr class="border-primary-700 mt-7" />
  </div>

  <NuxtLazyHydrate when-visible>
    <NewsletterSubscribe />
  </NuxtLazyHydrate>
  <footer class="pt-10 bg-primary-700/60 mb-[58px] md:mb-0" data-testid="footer">
    <div
      class="grid justify-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(3,1fr)] px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto"
      data-testid="section-top"
    >
      <template v-for="{ key, subcategories } in categories">
        <template v-if="key != 'legal'">
          <div :key="key" class="min-w-[25%] xs:min-w-[50%] flex flex-col">
            <div class="ml-4 text-lg font-medium leading-7 text-neutral-900">
              {{ $t(`categories.${key}.label`) }}
            </div>
            <ul>
              <SfListItem
                v-for="{ key: subcategoryKey, link } in subcategories"
                :key="subcategoryKey"
                class="py-2 !bg-transparent typography-text-sm"
              >
                <SfLink
                  :tag="NuxtLink"
                  class="router-link-active router-link-exact-active no-underline text-neutral-600 hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
                  variant="secondary"
                  :to="localePath(link)"
                >
                  {{ $t(`categories.${key}.subcategories.${subcategoryKey}`) }}
                </SfLink>
              </SfListItem>
            </ul>
          </div>
        </template>
      </template>
    </div>
    <div class="bg-white pt-7 pb-7">
      <div class="text-center typography-headline-4 sm:typography-headline-2 mb-2">Folgen Sie uns</div>
      <div class="bg-white w-full h-auto flex items-center justify-center gap-2 flex-wrap">
        <a
          href="javascript:;"
          class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 71 72" fill="none">
            <path
              d="M46.4233 38.6403L47.7279 30.3588H39.6917V24.9759C39.6917 22.7114 40.8137 20.4987 44.4013 20.4987H48.1063V13.4465C45.9486 13.1028 43.7685 12.9168 41.5834 12.8901C34.9692 12.8901 30.651 16.8626 30.651 24.0442V30.3588H23.3193V38.6403H30.651V58.671H39.6917V38.6403H46.4233Z"
              fill="#111827"
            />
          </svg>
        </a>
        <a
          href="javascript:;"
          class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 71 72" fill="none">
            <path
              d="M27.3762 35.7808C27.3762 31.1786 31.1083 27.4468 35.7132 27.4468C40.3182 27.4468 44.0522 31.1786 44.0522 35.7808C44.0522 40.383 40.3182 44.1148 35.7132 44.1148C31.1083 44.1148 27.3762 40.383 27.3762 35.7808ZM22.8683 35.7808C22.8683 42.8708 28.619 48.618 35.7132 48.618C42.8075 48.618 48.5581 42.8708 48.5581 35.7808C48.5581 28.6908 42.8075 22.9436 35.7132 22.9436C28.619 22.9436 22.8683 28.6908 22.8683 35.7808ZM46.0648 22.4346C46.0646 23.0279 46.2404 23.608 46.5701 24.1015C46.8997 24.595 47.3684 24.9797 47.9168 25.2069C48.4652 25.4342 49.0688 25.4939 49.6511 25.3784C50.2334 25.2628 50.7684 24.9773 51.1884 24.5579C51.6084 24.1385 51.8945 23.6041 52.0105 23.0222C52.1266 22.4403 52.0674 21.8371 51.8404 21.2888C51.6134 20.7406 51.2289 20.2719 50.7354 19.942C50.2418 19.6122 49.6615 19.436 49.0679 19.4358H49.0667C48.2708 19.4361 47.5077 19.7522 46.9449 20.3144C46.3821 20.8767 46.0655 21.6392 46.0648 22.4346ZM25.6072 56.1302C23.1683 56.0192 21.8427 55.6132 20.9618 55.2702C19.7939 54.8158 18.9606 54.2746 18.0845 53.4002C17.2083 52.5258 16.666 51.6938 16.2133 50.5266C15.8699 49.6466 15.4637 48.3214 15.3528 45.884C15.2316 43.2488 15.2073 42.4572 15.2073 35.781C15.2073 29.1048 15.2336 28.3154 15.3528 25.678C15.4639 23.2406 15.8731 21.918 16.2133 21.0354C16.668 19.8682 17.2095 19.0354 18.0845 18.1598C18.9594 17.2842 19.7919 16.7422 20.9618 16.2898C21.8423 15.9466 23.1683 15.5406 25.6072 15.4298C28.244 15.3086 29.036 15.2844 35.7132 15.2844C42.3904 15.2844 43.1833 15.3106 45.8223 15.4298C48.2612 15.5408 49.5846 15.9498 50.4677 16.2898C51.6356 16.7422 52.4689 17.2854 53.345 18.1598C54.2211 19.0342 54.7615 19.8682 55.2161 21.0354C55.5595 21.9154 55.9658 23.2406 56.0767 25.678C56.1979 28.3154 56.2221 29.1048 56.2221 35.781C56.2221 42.4572 56.1979 43.2466 56.0767 45.884C55.9656 48.3214 55.5573 49.6462 55.2161 50.5266C54.7615 51.6938 54.2199 52.5266 53.345 53.4002C52.4701 54.2738 51.6356 54.8158 50.4677 55.2702C49.5872 55.6134 48.2612 56.0194 45.8223 56.1302C43.1855 56.2514 42.3934 56.2756 35.7132 56.2756C29.033 56.2756 28.2432 56.2514 25.6072 56.1302ZM25.4001 10.9322C22.7371 11.0534 20.9174 11.4754 19.3282 12.0934C17.6824 12.7316 16.2892 13.5878 14.897 14.977C13.5047 16.3662 12.6502 17.7608 12.0116 19.4056C11.3933 20.9948 10.971 22.8124 10.8497 25.4738C10.7265 28.1394 10.6982 28.9916 10.6982 35.7808C10.6982 42.57 10.7265 43.4222 10.8497 46.0878C10.971 48.7494 11.3933 50.5668 12.0116 52.156C12.6502 53.7998 13.5049 55.196 14.897 56.5846C16.289 57.9732 17.6824 58.8282 19.3282 59.4682C20.9204 60.0862 22.7371 60.5082 25.4001 60.6294C28.0687 60.7506 28.92 60.7808 35.7132 60.7808C42.5065 60.7808 43.3592 60.7526 46.0264 60.6294C48.6896 60.5082 50.5081 60.0862 52.0983 59.4682C53.7431 58.8282 55.1373 57.9738 56.5295 56.5846C57.9218 55.1954 58.7745 53.7998 59.4149 52.156C60.0332 50.5668 60.4575 48.7492 60.5768 46.0878C60.698 43.4202 60.7262 42.57 60.7262 35.7808C60.7262 28.9916 60.698 28.1394 60.5768 25.4738C60.4555 22.8122 60.0332 20.9938 59.4149 19.4056C58.7745 17.7618 57.9196 16.3684 56.5295 14.977C55.1395 13.5856 53.7431 12.7316 52.1003 12.0934C50.5081 11.4754 48.6894 11.0514 46.0284 10.9322C43.3612 10.811 42.5085 10.7808 35.7152 10.7808C28.922 10.7808 28.0687 10.809 25.4001 10.9322Z"
              fill="#111827"
            />
          </svg>
        </a>
        <a
          href="javascript:;"
          class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 71 71" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M56.5615 18.2428C58.8115 18.8504 60.58 20.6234 61.1778 22.8708C62.2654 26.9495 62.2654 35.4647 62.2654 35.4647C62.2654 35.4647 62.2654 43.98 61.1778 48.0586C60.5717 50.3144 58.8032 52.0873 56.5615 52.6866C52.4932 53.7771 36.1703 53.7771 36.1703 53.7771C36.1703 53.7771 19.8557 53.7771 15.7791 52.6866C13.5291 52.079 11.7606 50.306 11.1628 48.0586C10.0752 43.98 10.0752 35.4647 10.0752 35.4647C10.0752 35.4647 10.0752 26.9495 11.1628 22.8708C11.7689 20.615 13.5374 18.8421 15.7791 18.2428C19.8557 17.1523 36.1703 17.1523 36.1703 17.1523C36.1703 17.1523 52.4932 17.1523 56.5615 18.2428ZM44.5142 35.4647L30.9561 43.314V27.6154L44.5142 35.4647Z"
              fill="#111827"
            />
          </svg>
        </a>
      </div>
    </div>
    <div class="bg-neutral-900" data-testid="section-bottom">
      <div class="px-4 py-10 md:py-6 max-w-screen-3xl mx-auto">
        <template v-for="{ key, subcategories } in categories">
          <template v-if="key == 'legal'">
            <ul class="flex justify-center">
              <SfListItem
                v-for="{ key: subcategoryKey, link } in subcategories"
                :key="subcategoryKey"
                class="py-2 !bg-transparent typography-text-sm !w-auto"
              >
                <SfLink
                  :tag="NuxtLink"
                  class="router-link-active router-link-exact-active no-underline text-white hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
                  variant="secondary"
                  :to="localePath(link)"
                >
                  {{ $t(`categories.${key}.subcategories.${subcategoryKey}`) }}
                </SfLink>
              </SfListItem>
            </ul>
          </template>
        </template>
        <p class="flex items-center justify-center leading-5 text-center typography-text-sm text-white mt-3">
          {{ companyName }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import { categories, companyName } from '~/mocks';

const localePath = useLocalePath();

const NuxtLink = resolveComponent('NuxtLink');
const paymentIcons = [
  {
    "imgUrl": "/images/paypal.svg",
    "name": "PayPal"
  },
  {
    "imgUrl": "/images/mastercard.svg",
    "name": "Mastercard"
  },
  {
    "imgUrl": "/images/visa.svg",
    "name": "Visa"
  },
  {
    "imgUrl": "/images/banktransfer.svg",
    "name": "Überweisung"
  }
]
</script>
