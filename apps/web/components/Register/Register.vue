<template>
  <div class="font-medium ml-8" :class="{ 'flex flex-col items-center': !isModal }">
    <div class="text-lg">{{ t('auth.signup.heading') }}</div>
    <div class="text-base">{{ t('auth.signup.subheading') }}</div>

    <div class="mt-5 font-normal flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <SfIconPerson class="text-primary-500" />
        <div>{{ t('auth.signup.benefits.saveAddresses') }}</div>
      </div>
      <div class="flex items-center gap-2">
        <SfIconLocalShipping class="text-primary-500" />
        <div>{{ t('auth.signup.benefits.orderTracking') }}</div>
      </div>
      <div class="flex items-center gap-2">
        <SfIconFavorite class="text-primary-500" />
        <div>{{ t('auth.signup.benefits.wishlist') }}</div>
      </div>
      <div class="flex items-center gap-2">
        <SfIconSchedule class="text-primary-500" />
        <div>{{ t('auth.signup.benefits.orderHistory') }}</div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center my-1">
    <form class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]" @submit.prevent="onSubmit">
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput
          v-model="email"
          v-bind="emailAttributes"
          :invalid="Boolean(errors['register.email'])"
          name="customerEmail"
          type="email"
          autocomplete="email"
        />
        <ErrorMessage as="span" name="register.email" class="flex text-negative-700 text-sm mt-2" />
      </label>

      <label>
        <UiFormLabel>{{ t('form.passwordLabel') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="password"
          :title="t('invalidPassword')"
          name="password"
          autocomplete="current-password"
          v-bind="passwordAttributes"
          :invalid="Boolean(errors['register.password'])"
        />
        <!-- <ErrorMessage as="span" name="register.password" class="flex text-negative-700 text-sm mt-2" /> -->
      </label>
      <label>
        <UiFormLabel>{{ t('form.repeatPasswordLabel') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="repeatPassword"
          :title="t('invalidPassword')"
          name="password"
          autocomplete="current-password"
          v-bind="repeatPasswordAttributes"
          :invalid="Boolean(errors['register.repeatPassword'])"
        />
        <ErrorMessage as="span" name="register.repeatPassword" class="flex text-negative-700 text-sm mt-2" />
      </label>

      <div class="text-xs">
        <div class="flex items-center" :class="{ 'text-green-600': passwordValidationLength }">
          <SfIconCheck v-if="passwordValidationLength" size="sm" />
          <SfIconClose v-else size="sm" />
          <span class="ml-1">{{ t('auth.signup.passwordValidation.characters') }}</span>
        </div>
        <div class="flex items-center" :class="{ 'text-green-600': passwordValidationOneDigit }">
          <SfIconCheck v-if="passwordValidationOneDigit" size="sm" />
          <SfIconClose v-else size="sm" />
          <span class="ml-1">{{ t('auth.signup.passwordValidation.numbers') }}</span>
        </div>
        <div class="flex items-center" :class="{ 'text-green-600': passwordValidationOneLetter }">
          <SfIconCheck v-if="passwordValidationOneLetter" size="sm" />
          <SfIconClose v-else size="sm" />
          <span class="ml-1">{{ t('auth.signup.passwordValidation.letters') }}</span>
        </div>
      </div>

      <div class="flex items-center">
        <SfCheckbox
          id="privacyPolicy"
          v-model="privacyPolicy"
          v-bind="privacyPolicyAttributes"
          value="value"
          class="peer"
        />
        <label
          class="ml-3 text-base text-neutral-900 cursor-pointer peer-disabled:text-disabled-900 select-none"
          for="privacyPolicy"
        >
          <i18n-t keypath="form.privacyPolicyLabel" scope="global">
            <template #privacyPolicy>
              <SfLink
                :href="localePath(paths.privacyPolicy)"
                target="_blank"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ t('privacyPolicy') }}
              </SfLink>
            </template>
          </i18n-t>
          {{ t('form.required') }}
        </label>
      </div>
      <ErrorMessage as="div" name="register.privacyPolicy" class="text-negative-700 text-left text-sm" />

      <NuxtTurnstile
        v-if="turnstileSiteKey"
        v-bind="turnstileAttributes"
        ref="turnstileElement"
        v-model="turnstile"
        :options="{ theme: 'light' }"
        class="mt-4 flex justify-center"
      />

      <ErrorMessage as="div" name="register.turnstile" class="text-negative-700 text-center text-sm" />

      <UiButton type="submit" class="mt-2" :disabled="loading || migrateLoading">
        <SfLoaderCircular v-if="loading || migrateLoading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.signup.submitLabel') }}
        </span>
      </UiButton>

      <div v-if="changeableView" class="text-center">
        <div class="my-5 font-bold">{{ t('auth.signup.alreadyHaveAccount') }}</div>
        <SfLink variant="primary" class="cursor-pointer" @click="$emit('change-view')">
          {{ t('auth.signup.logInLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {
  SfLink,
  SfInput,
  SfLoaderCircular,
  SfCheckbox,
  SfIconPerson,
  SfIconLocalShipping,
  SfIconFavorite,
  SfIconSchedule,
  SfIconCheck,
  SfIconClose,
} from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, boolean, ref as yupReference } from 'yup';
import type { RegisterFormParams } from '~/components/Register/types';
import { useMigrateGuestOrder } from '~/composables/useMigrateGuestOrder';
import { paths } from '~/utils/paths';

const localePath = useLocalePath();
const router = useRouter();
const { register, loading } = useCustomer();
const { t } = useI18n();
const { send } = useNotification();
const { migrateGuestOrder, loading: migrateLoading } = useMigrateGuestOrder();
const viewport = useViewport();
const runtimeConfig = useRuntimeConfig();

const emits = defineEmits(['registered', 'change-view']);
const { emailAddress, order, isModal = false, changeableView = true } = defineProps<RegisterFormParams>();

const turnstileSiteKey = runtimeConfig.public?.turnstileSiteKey ?? '';
const turnstileElement = ref();

const validationSchema = toTypedSchema(
  object({
    register: object({
      email: string().email(t('errorMessages.email.valid')).required(t('errorMessages.email.required')).default(''),
      password: string()
        .required(t('errorMessages.password.required'))
        .matches(/^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/, t('errorMessages.password.valid'))
        .default(''),
      repeatPassword: string()
        .required(t('errorMessages.password.required'))
        .oneOf([yupReference('password'), ''], t('errorMessages.password.match'))
        .default(''),
      privacyPolicy: boolean().isTrue(t('privacyPolicyRequired')).required(t('privacyPolicyRequired')),
      turnstile:
        turnstileSiteKey.length > 0
          ? string().required(t('errorMessages.turnstileRequired')).default('')
          : string().optional().default(''),
    }),
  }),
);

const { errors, meta, defineField, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const [email, emailAttributes] = defineField('register.email');
const [password, passwordAttributes] = defineField('register.password');
const [repeatPassword, repeatPasswordAttributes] = defineField('register.repeatPassword');
const [turnstile, turnstileAttributes] = defineField('register.turnstile');
const [privacyPolicy, privacyPolicyAttributes] = defineField('register.privacyPolicy');

if (emailAddress) {
  email.value = emailAddress;
}

const clearTurnstile = () => {
  turnstile.value = '';
  turnstileElement.value?.reset();
};

const registerUser = async () => {
  if (!meta.value.valid || (!turnstile.value && turnstileSiteKey.length > 0)) {
    return;
  }

  const response = await register({
    email: email.value ?? '',
    password: password.value ?? '',
    'cf-turnstile-response': turnstile.value,
  });

  if (response?.data.code === 1) {
    send({
      message: t('auth.signup.emailAlreadyExists'),
      type: 'negative',
    });
    clearTurnstile();
    return;
  }

  if (response?.data.id) {
    send({
      message: t('auth.signup.success'),
      type: 'positive',
    });

    if (order) {
      await migrateGuestOrder({
        orderId: order?.order.id ?? -1,
        accessKey: order?.order.accessKey ?? '',
        postcode: order?.order.deliveryAddress.postalCode ?? undefined,
        name: order?.order.deliveryAddress.name3 ?? undefined,
      });
    }

    emits('registered');
    clearTurnstile();

    if (!order) {
      viewport.isGreaterOrEquals('lg') ? router.push(router.currentRoute.value.path) : router.back();
    }
  }
};

const onSubmit = handleSubmit(() => registerUser());

const passwordValidationLength = computed(() => {
  return (password?.value?.length || 0) >= 8;
});
const passwordValidationOneDigit = computed(() => {
  return /\d/.test(password?.value || '');
});
const passwordValidationOneLetter = computed(() => {
  return /[A-Za-z]/.test(password?.value || '');
});
</script>
