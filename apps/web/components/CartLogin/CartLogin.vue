<template>
    <div class="flex flex-col gap-4 p-2 md:p-6 rounded-md">
        <div class="w-full md:w-1/2 md:self-center">
            <p class="font-bold mb-6 md:hidden">Guest Checkout</p>
            <OrDivider>
                <template v-slot:above>
                    <div class="w-full">
                        
                        <OrDivider>
                            <template v-slot:above>
                                <SfButton class="w-[400px]">Continue as guest</SfButton>
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
                    <div class="w-[400px]">
                    <form>
                        <p class="font-bold">Login to checkout Faster</p>
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
                        <SfLink @click="$emit('change-view')" href="#" variant="primary">
                            forgot password?
                        </SfLink>
                        <div class="mt-6">
                            <h3 class="font-bold">Dont have an account yet?</h3>
                            <p>Dont worry. You can create an account after your order!</p>
                        </div>
                        </div>
                    </form>
                    </div>
                </template>
            </OrDivider>
        </div>
       
    </div>
</template>
  

<script setup lang="ts">
    import { SfButton, SfLink, SfInput} from '@storefront-ui/vue';
    // import type { CartLoginProps } from '~/components/CartLogin/types';
    // const props = defineProps<CartLoginProps>();

    const email = ref('');
    const password = ref('');
</script>