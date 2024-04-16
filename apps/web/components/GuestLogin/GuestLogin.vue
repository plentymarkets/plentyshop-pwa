<template>
    <div class="md:w-full md:flex md:justify-center">
        <div class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-2/3">
            <div class="md:self-center">
                <h2 class="font-bold mb-6 text-lg">Guest Checkout</h2>
                <OrDivider>
                    <template v-slot:above>
                        <div class="w-full mb-4">
                            
                            <OrDivider>
                                <template v-slot:above>
                                    <SfButton 
                                        :tag="NuxtLink"
                                        :to="localePath(paths.checkout)" 
                                        class="w-[400px] mb-4">Continue as guest</SfButton>
                                </template>
                                <template v-slot:below>
                                    <div>
                                        <PayPalExpressButton class="mt-4" type="CartPreview" />
                                    </div>
                                </template>  
                            </OrDivider>
                        </div>
                    </template>
                    <template v-slot:below>
                        <div class="w-[400px] md:w-full mt-4">
                        <form @submit.prevent="loginUser">
                            <h1 class="font-bold text-lg">Login to checkout Faster</h1>
                            <label>
                                <UiFormLabel class="w-full mt-4">E-Mail</UiFormLabel>
                                <SfInput class="w-full" name="email" type="email" autocomplete="email" v-model="email" required />
                            </label>
                    
                            <label>
                                <UiFormLabel class="mt-6">Password</UiFormLabel>
                                <UiFormPasswordInput name="password" autocomplete="current-password" v-model="password" required />
                            </label>
                    
                            <SfButton type="submit" class="mt-4 w-full">
                                <SfLoaderCircular/>
                                <span>
                                    Login and continue
                                </span>
                            </SfButton>
                            <div class="text-center mt-6">
                            <SfLink href="#" variant="primary">
                                forgot your password?
                            </SfLink>
                            <div class="mt-6">
                                <h3 class="font-bold text-lg mb-6">Dont have an account yet?</h3>
                                <p>Dont worry. You can create an account after your order!</p>
                            </div>
                            </div>
                        </form>
                        </div>
                    </template>
                </OrDivider>
            </div>
        </div>
    </div>
</template>
  

<script setup lang="ts">
    import { SfButton, SfLink, SfInput} from '@storefront-ui/vue';

    import { AddressType } from '@plentymarkets/shop-api';
    import type { LoginProps } from './types';

    const { getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
    const { getAddresses: getShippingAddresses } = useAddress(AddressType.Shipping);
    const { getShippingMethods } = useCartShippingMethods();

    const { login, isAuthorized, getSession } = useCustomer();
    const { send } = useNotification();
    const { t } = useI18n();
    const localePath = useLocalePath();
    const NuxtLink = resolveComponent('NuxtLink');

    const props = withDefaults(defineProps<LoginProps>(), {
    isSoftLogin: false,
    });
    const emits = defineEmits(['loggedIn', 'change-view']);

    const loadAddresses = async () => {
    await getBillingAddresses();
    await getShippingAddresses();
    await getShippingMethods();
    };

    const email = ref('');
    const password = ref('');

    const loginUser = async () => {
    const success = await login(email.value, password.value);
    if (success) {
        send({ message: t('auth.login.success'), type: 'positive' });
        emits('loggedIn');
        if (!props.isSoftLogin) {
        const currentURL = window.location.href;
        if (currentURL.includes(paths.checkout)) {
            await loadAddresses();
            await getSession();
        }
        }
        redirectIfSuccessful();
    }
    };

    function redirectIfSuccessful(){
        if(isAuthorized.value){
            window.location.href = localePath(paths.checkout);
        }
    }
</script>