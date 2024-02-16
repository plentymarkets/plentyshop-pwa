<template>
  <div class="flex items-center justify-center my-1">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]">
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }}</UiFormLabel>
        <SfInput
          v-model="email"
          v-bind="emailAttributes"
          :invalid="Boolean(errors['register.email'])"
          name="customerEmail"
          type="email"
          autocomplete="email"
        />
        <VeeErrorMessage as="span" name="register.email" class="flex text-negative-700 text-sm mt-2" />
      </label>

      <label>
        <UiFormLabel>{{ t('form.passwordLabel') }}</UiFormLabel>
        <UiFormPasswordInput
          :title="t('invalidPassword')"
          name="password"
          autocomplete="current-password"
          v-model="password"
          v-bind="passwordAttributes"
          :invalid="Boolean(errors['register.password'])"
        />
        <VeeErrorMessage as="span" name="register.password" class="flex text-negative-700 text-sm mt-2" />
      </label>

      <div class="flex items-center">
        <SfCheckbox
          id="privacyPolicy"
          v-model="privacyPolicy"
          v-bind="privacyPolicyAttributes"
          value="value"
          class="peer"
        />
        <label
          class="ml-3 text-base text-neutral-900 cursor-pointer peer-disabled:text-disabled-900"
          for="privacyPolicy"
        >
          <i18n-t keypath="form.privacyPolicyLabel">
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
          *
        </label>
      </div>

      <div v-if="Boolean(errors['register.privacyPolicy'])" class="text-negative-700 text-sm">
        {{ t('privacyPolicyRequired') }}
      </div>

      <SfButton type="submit" class="mt-2" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.signup.submitLabel') }}
        </span>
      </SfButton>
      <div class="text-center">
        <div class="my-5 font-bold">{{ t('auth.signup.alreadyHaveAccount') }}</div>
        <SfLink @click="$emit('change-view')" href="#" variant="primary">
          {{ t('auth.signup.logInLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfLink, SfInput, SfLoaderCircular, SfCheckbox } from '@storefront-ui/vue';
import { useForm } from 'vee-validate';
import { object, string, boolean } from 'yup';

const localePath = useLocalePath();
const router = useRouter();
const { register, loading } = useCustomer();
const { t } = useI18n();
const { send } = useNotification();
const { isDesktop } = useBreakpoints();

const emits = defineEmits(['registered', 'change-view']);

const validationSchema = toTypedSchema(
  object({
    register: object({
      email: string().email(t('errorMessages.email.valid')).required(t('errorMessages.email.required')).default(''),
      password: string()
        .required(t('errorMessages.password.required'))
        .matches(/^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/, t('errorMessages.password.valid'))
        .default(''),
      privacyPolicy: boolean().isTrue().required(),
    }),
  }),
);

const { errors, meta, defineField, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const [email, emailAttributes] = defineField('register.email');
const [password, passwordAttributes] = defineField('register.password');
const [privacyPolicy, privacyPolicyAttributes] = defineField('register.privacyPolicy');

const registerUser = async () => {
  if (!meta.value.valid) {
    return;
  }

  const response = await register({ email: email.value ?? '', password: password.value ?? '' });

  if (response?.data.code === 1) {
    send({
      message: t('auth.signup.emailAlreadyExists'),
      type: 'negative',
    });
    return;
  }

  if (response?.data.id) {
    send({
      message: t('auth.signup.success'),
      type: 'positive',
    });
    emits('registered');
    isDesktop.value ? router.push(router.currentRoute.value.path) : router.back();
  }
};

const onSubmit = handleSubmit(() => registerUser());
</script>
