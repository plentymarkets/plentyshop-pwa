# Form fields validation

Form fields validation contributes significantly to the overall user experience by providing real-time feedback to users as they input information. Immediate validation alerts users to errors or inaccuracies, preventing the frustration of submitting a form only to encounter errors later.

Effective form fields validation also serves as a proactive measure to prevent errors before they reach the server. This not only saves server resources but also minimizes the risk of propagating inaccuracies throughout the system.

Finally, form fields validation defends against malicious activities and security vulnerabilities. Input validation prevents common attacks such as SQL injection, cross-site scripting, and cross-site request forgery.

## Single-component validation

The most basic use case is if a single component contains the entire form template.

In this scenario, to handle submissions, you can use the `handleSubmit` function to create submission handlers for your forms. The function accepts a callback that receives the final form values. The following example demonstrates how to implement form validation:

::: details Form to validate

```vue
<template>
  <form @submit.prevent="onSubmit">
    <label>
      <UiFormLabel>{{ $t('form.emailLabel') }}</UiFormLabel>
      <SfInput
        v-model="email"
        v-bind="emailAttributes"
        :invalid="Boolean(errors['register.email'])"
        name="customerEmail"
        type="email"
        autocomplete="email"
      />
      <VeeErrorMessage as="span" name="register.email" />
    </label>

    <label>
      <UiFormLabel>{{ $t('form.passwordLabel') }}</UiFormLabel>
      <UiFormPasswordInput
        :title="$t('invalidPassword')"
        name="password"
        autocomplete="current-password"
        v-model="password"
        v-bind="passwordAttributes"
        :invalid="Boolean(errors['register.password'])"
      />
      <VeeErrorMessage as="span" name="register.password" />
    </label>

    <div class="flex items-center">
      <SfCheckbox
        id="privacyPolicy"
        v-model="privacyPolicy"
        v-bind="privacyPolicyAttributes"
        value="value"
        class="peer"
      />
      <label for="privacyPolicy">
        <i18n-t keypath="form.privacyPolicyLabel">
          <template #privacyPolicy>
            <SfLink :href="localePath(paths.privacyPolicy)" target="_blank">
              {{ $t('privacyPolicy') }}
            </SfLink>
          </template>
        </i18n-t>
        *
      </label>
    </div>

    <div v-if="Boolean(errors['register.privacyPolicy'])">
      {{ $t('privacyPolicyRequired') }}
    </div>

    <SfButton type="submit" class="mt-2" :disabled="loading || !meta.valid">
      <SfLoaderCircular v-if="loading" size="base" />
      <span v-else>
        {{ $t('auth.signup.submitLabel') }}
      </span>
    </SfButton>

    <div class="text-center">
      <div>{{ $t('auth.signup.alreadyHaveAccount') }}</div>
      <SfLink @click="$emit('change-view')" href="#" variant="primary">
        {{ $t('auth.signup.logInLinkLabel') }}
      </SfLink>
    </div>
  </form>
</template>
```

:::

::: details Validator

```ts
import { useForm } from 'vee-validate';
import { object, string, boolean } from 'yup';

const { t } = useI18n();

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
  const response = await register({
    email: email.value ?? '',
    password: password.value ?? '',
  });

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
```

:::

::: tip About invalid form submissions
The `handleSubmit` function will only execute your callback on the returned function (`registerUser` in our example) if all fields are valid. This means you don’t have to handle if the form is invalid in your logic.
:::

## Multi-component validation

To better organise your code, you might want to store parts of your form template in different components.

In this scenario, you validate form fields by using the `useValidatorAggregator` composable. The example below demonstrates how to use `useValidatorAggregator`. The example contains `PurchaseCard` as the parent and `OrderInputProperty` as the child component.

In `PurchaseCard`, `validateAllFields` registers the form field validator of the `prop-${orderPropertyId}` field from `OrderPropertyInput`. If you have form fields in multiple child components, you can register them all in the same way.

::: info Unique field identifier
In the context of the overall validation, every form field identifier has to be unique. In other words, even if your template is distributed across multiple child components, you have to choose different identifiers for each form field.
:::

::: details PurchaseCard component

```vue
<template>
  <form @submit.prevent="handleAddToCart">
    <div>
      <h1 data-testid="product-name">
        {{ productGetters.getName(product) }}
      </h1>
      <div>
        <WishlistButton v-if="isDesktop" :product="product" :quantity="quantitySelectorValue">
          {{ t('addProductToWishlist') }}
        </WishlistButton>

        <WishlistButton v-else :product="product" :quantity="quantitySelectorValue" />
      </div>
    </div>

    <OrderProperties v-if="product" :product="product" />

    <div>
      <AttributeSelect v-if="product" :product="product" />
    </div>

    <GraduatedPriceList v-if="product" :product="product" :count="quantitySelectorValue" />

    <div>
      <SfButton type="submit" :disabled="loading || !productGetters.isSalable(product)">
        <template #prefix v-if="!loading">
          <SfIconShoppingCart size="sm" />
        </template>

        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />

        <template v-else>
          {{ t('addToCart') }}
        </template>
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregatorProperties();
const { addToCart } = useCart();

resetInvalidFields();

const handleAddToCart = async () => {
  await validateAllFields();
  if (invalidFields.value.length > 0) {
    const invalidFieldsNames = invalidFields.value.map((field) => field.name);
    send({
      message: [
        t('errorMessages.missingOrWrongProperties'),
        '',
        ...invalidFieldsNames,
        '',
        t('errorMessages.pleaseFillOutAllFields'),
      ],
      type: 'negative',
    });
    return;
  }

  const params = {
    productId: Number(productGetters.getId(product.value)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  };

  if (await addToCart(params)) {
    send({ message: t('addedToCart'), type: 'positive' });
  }
};
</script>
```

:::

::: details OrderPropertyInput component

```vue
<template>
  <div>
    <label :for="`prop-${orderPropertyId}`">
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <template v-if="orderPropertyLabel.surchargeType">
        ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
        {{ n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
      </template>
      {{ orderPropertyLabel.surchargeIndicator }}
      <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
      {{ orderPropertyLabel.requiredIndicator }}
    </label>

    <div>
      <textarea
        v-if="isMultiline"
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        :class="{
          '!ring-negative-700 ring-2': isOrderPropertyRequired && Boolean(errors['value']),
        }"
      />
      <SfInput
        v-else
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        :invalid="Boolean(errors['value'])"
      />

      <div v-if="hasTooltip">
        <slot name="tooltip" />
      </div>
    </div>
    <VeeErrorMessage as="span" name="value" />
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from './types';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';

const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const { registerValidator, registerInvalidFields } = useValidatorAggregatorProperties();
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const isOrderPropertyRequired = productPropertyGetters.isOrderPropertyRequired(productProperty);
const isMultiline = productPropertyGetters.isMultiline(productProperty);

const validationSchema = toTypedSchema(
  object({
    value: string().test((value, context) => {
      if (isOrderPropertyRequired && !value) {
        return context.createError({
          message: t('errorMessages.requiredField'),
        });
      }

      if (value && value.length > 128) {
        return context.createError({
          message: t('errorMessages.maxCharacters', { max: 128 }),
        });
      }

      const isInt = productPropertyGetters.isOrderPropertyInt(productProperty);
      const isFloat = productPropertyGetters.isOrderPropertyFloat(productProperty);

      if (value && isInt && /\D/.test(value)) {
        return context.createError({ message: t('errorMessages.wholeNumber') });
      }

      if (value && isFloat && !/^\d+(?:[,.]\d*)?$/.test(value)) {
        return context.createError({
          message: t('errorMessages.decimalNumber'),
        });
      }

      return true;
    }),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [value, valueAttributes] = defineField('value');

watch(
  () => meta.value,
  () => {
    registerInvalidFields(
      meta.value.valid,
      `prop-${orderPropertyId}`,
      productPropertyGetters.getOrderPropertyName(productProperty),
    );
  },
);
</script>
```

:::

## References

- [VeeValidate documentation](https://vee-validate.logaretm.com/v4/)
- [Yup validation schema](https://github.com/jquense/yup)
- [Nuxt vee-validate Module](https://nuxt.com/modules/vee-validate)
