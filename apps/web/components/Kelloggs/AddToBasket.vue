<template>
  <div class="kl-add-to-cart" :class="{ 'kl-loading': loading }">
    <div>
      <!-- Add to Cart Button (Only shown when quantity is 0) -->
      <button class="kl-add-first" v-if="quantity === 0" @click.stop="addItemToCart" :disabled="!available"
              :title="available ? 'Produkt in den Warenkorb legen' : 'Produkt ist ausverkauft'">
        <span>
          <svg
               class="icon icon-cart"
               aria-hidden="true"
               focusable="false"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 40 40"
               fill="none">
            <path fill="currentColor" fill-rule="evenodd"
                  d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z" />
          </svg>
        </span>
        <span>
          <svg
               xmlns="http://www.w3.org/2000/svg"
               aria-hidden="true"
               focusable="false"
               class="icon icon-plus"
               fill="none"
               viewBox="0 0 10 10">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z"
                  fill="currentColor" />
          </svg>
        </span>
      </button>

      <!-- Quantity controls (only visible if quantity > 0) -->
      <div v-else class="kl-quantity-controls">
        <button class="kl-minus" @click.stop="decreaseQuantity" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-minus"
               fill="none" viewBox="0 0 10 2">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z"
                  fill="currentColor" />
          </svg>
        </button>
        <span class="kl-quantity">{{ quantity }}</span>
        <button class="kl-plus" @click.stop="increaseQuantity" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-plus"
               fill="none" viewBox="0 0 10 10">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z"
                  fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCart } from '~/composables/useCart';
import { useNotification } from '~/composables/useNotification';
import { debounce } from 'lodash';
const { t } = useI18n();
const { addToCart, setCartItemQuantity, deleteCartItem } = useCart();
const { send } = useNotification();

const { productId, available } = defineProps({
  productId: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const loading = ref(false);
const quantity = ref(0);

const getCartItem = (productId) => {
  const { data: cart } = useCart();
  const cartItem = cart.value?.items?.find((item) => item.variationId === productId);

  return cartItem ?? null;
}

onMounted(() => {
  quantity.value = getCartItem(productId)?.quantity ?? 0;
})

const updateCart = async () => {
  const cartItem = getCartItem(productId);
  const isItemInCart = cartItem?.quantity;

  if (!isItemInCart) {
    await addToCart({ productId, quantity: quantity.value });
    send({ message: t('addedToCart'), type: 'positive' });
  } else {
    if (quantity.value === 0) {
      await deleteCartItem({ cartItemId: cartItem.id });
      send({ message: t('removedFromCart'), type: 'positive' });
    } else {
      await setCartItemQuantity({
        productId,
        quantity: quantity.value,
        cartItemId: cartItem.id,
      });
      send({ message: t('changedCartQuantity'), type: 'positive' });
    }
  }
}

const debouncedAddToCart = debounce(async () => {
  if (loading.value || !available) return;
  loading.value = true;

  try {
    await updateCart();
  } catch (error) {
    console.error('Error adding to cart:', error);
    send({ message: t('errorAddingToCart'), type: 'negative' });
  } finally {
    loading.value = false;
  }
}, 800);

const addItemToCart = async () => {
  if (loading.value || !available) return;
  quantity.value = 1;

  debouncedAddToCart();
};

const increaseQuantity = () => {
  if (loading.value) return;
  quantity.value++;
  debouncedAddToCart();
};

const decreaseQuantity = () => {
  if (!loading.value) {
    if (quantity.value > 0) quantity.value--;
    debouncedAddToCart();
  }
};
</script>

<style lang="scss">
.kl-atb {
  z-index: 150;
}

.kl-add-to-cart {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 150;
  cursor: pointer;

  button {
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
  }

  svg {
    margin-top: 3px;
    width: 13px;
    height: 13px;
  }

  .kl-add-first {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f60b45;
    color: white;
    fill: white;
    padding: 7px;
    border-radius: 25px;
    height: 42px;
    min-width: 75px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      background: #bababa;
    }

    @media only screen and (max-width: 768px) {
      height: 35px;
    }

    svg {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      margin-right: 8px;

      @media only screen and (max-width: 768px) {
        height: 16px;
      }
    }

    svg.icon-cart {
      width: 40px;
      height: 40px;
      margin-top: 6px;
      margin-right: -3px;

      @media only screen and (max-width: 768px) {
        width: 35px;
        height: 35px;
      }
    }
  }

  .kl-quantity-controls {
    display: flex;
    align-items: center;
    padding: 9px;
    border-radius: 25px;
    border: 1px solid black;

    @media only screen and (max-width: 768px) {
      padding: 6px 2px;
    }

    span {
      min-width: 35px;
      text-align: center;

      @media only screen and (max-width: 768px) {
        min-width: 18px;
      }
    }

    button {
      padding: 0px 8px;
    }
  }

  &.kl-loading {
    .kl-quantity-controls {
      background: rgb(227, 227, 227);
    }
  }
}
</style>
