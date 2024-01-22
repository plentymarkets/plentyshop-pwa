# Form fields validation

Form fields validation contributes significantly to the overall user experience by providing real-time feedback to users as they input information. Immediate validation alerts users to errors or inaccuracies, preventing the frustration of submitting a form only to encounter errors later. Form fields validation is a critical aspect of web development that ensures the integrity and accuracy of data submitted through online forms.

This process involves implementing checks and constraints on user input to prevent erroneous or malicious data from being processed by the server. The importance of form fields validation cannot be overstated, as it contributes significantly to data quality, user experience, and overall system security.

## Use cases

Effective form fields validation serves as a proactive measure to prevent errors before they reach the server. This not only saves server resources but also minimizes the risk of propagating inaccuracies throughout the system.

Form fields validation serves as a crucial line of defense against malicious activities and security vulnerabilities. Input validation prevents common attacks such as SQL injection, cross-site scripting, and cross-site request forgery.

PlentyShop PWA makes use of [VeeValidate](https://vee-validate.logaretm.com/v4/) and [Yup validation schema](https://github.com/jquense/yup) for validation. 

- **Regular (AJAX) form submission**: In this scenario, to handle submissions, you can use the `handleSubmit` function to create submission handlers for your forms; the function accepts a callback that receives the final form values. The following example demonstrates how to implement form validation:
  1. Assuming a form has the following code structure.
      ```ts
      <form @submit.prevent="onSubmit">
        <div>
          <SfInput
              v-model="firstField"
              v-bind="firstFieldAttributes"
              :invalid="Boolean(errors['firstField'])"
              type="text"
              :placeholder="t('placeholder.firstField')"
          />
          <VeeErrorMessage as="div" name="firstField" />
        </div>
      
        <div>
          <SfInput
              v-model="secondField"
              v-bind="secondFieldAttributes"
              :invalid="Boolean(errors['secondField'])"
              type="text"
              :placeholder="t('placeholder.secondField')"
          />
          <VeeErrorMessage as="div" name="secondField" />
        </div>
      
        <SfButton type="submit" :disabled="!meta.valid">
          {{ t('button.label') }}
        </SfButton>
      </form>
      ```

  2. The `handleSubmit` function will only execute your callback once the returned function (`onSubmit` in our example) if all fields are valid, meaning you don’t have to handle if the form is invalid in your logic.
      ```ts
      import { useForm } from 'vee-validate';
      import { object, string } from 'yup';
      
      const { t } = useI18n();
      
      const validationSchema = toTypedSchema(
          object({
              firstField: string().required(t('field.error')).default(''),
              secondField: string().email(t('field.error')).required(t('field.error')).default(''),
          }),
      );
      
      const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
          validationSchema: validationSchema,
      });
      
      const [firstField, firstFieldAttributes] = defineField('firstField');
      const [secondField, secondFieldAttributes] = defineField('secondField');
      
      const apiCall = async () => {
          const response = await doApiCall({ firstField, secondField });
          resetForm();
      };
      
      const onSubmit = handleSubmit(() => apiCall());
      ```

- **Custom (AJAX) form submission**: In this scenario, assuming we have multiple components building a form, we would validate our selected fields by using `useValidatorAggregator` composable:
  1. Assuming a `ParentComponent` form has the following code structure.
      ```ts
      <form @submit.prevent="onSubmit">
        <FirstChildComponent>
          <SfInput
              v-model="firstField"
              v-bind="firstFieldAttributes"
              :id="`field-${firstFieldUniqueId}`"
              :invalid="Boolean(errors['firstField'])"
              :placeholder="t('placeholder.firstField')"
              type="text"
          />
          <VeeErrorMessage as="div" name="firstField" />
        </FirstChildComponent>

        <SecondChildComponent>
          <SfInput
              v-model="secondField"
              v-bind="secondFieldAttributes"
              :id="`field-${secondFieldUniqueId}`"
              :invalid="Boolean(errors['secondField'])"
              :placeholder="t('placeholder.secondField')"
              type="text"
          />
          <VeeErrorMessage as="div" name="secondField" />
        </SecondChildComponent>
    
        <SfButton type="submit" :disabled="invalidFields.length > 0">
          {{ t('button.label') }}
        </SfButton>
      </form>

      <script setup lang="ts">
      import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';
      const { validateAllFields, invalidFields } = useValidatorAggregatorProperties();

      const onSubmit = async () => {
        if (await validateAllFields().then((validatedFields) => validatedFields.some((field) => !field.valid))) return;
        await doApiCall({ firstField, secondField })  
      };
      </script>
      ```
  
  2. Then `FirstChildComponent` would contain the following code.
      ```ts
      import { useForm } from 'vee-validate';
      import { object, string } from 'yup';
      import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';
  
      const { registerValidator, registerInvalidFields } = useValidatorAggregatorProperties();
      const { t } = useI18n();
    
      const validationSchema = toTypedSchema(
        object({
          firstField: string().required(t('field.error')).default(''),
        }),
      );
    
      const { errors, meta, defineField } = useForm({
        validationSchema: validationSchema,
      });
  
      // Function for registering validator of this field
      registerValidator(validate);
    
      const [firstField, firstFieldAttributes] = defineField('firstField');
  
      watch(
        () => meta.value,
        () => {
          // Function for maintaining validator's invalid fields
          registerInvalidFields(meta.value.valid, `field-${firstFieldUniqueId}`);
        }
      );
      ```
     
  3. And `SecondChildComponent` would contain the following code.
      ```ts
      import { useForm } from 'vee-validate';
      import { object, string } from 'yup';
      import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';
  
      const { registerValidator, registerInvalidFields } = useValidatorAggregatorProperties();
      const { t } = useI18n();
    
      const validationSchema = toTypedSchema(
        object({
          secondField: string().email(t('field.error')).required(t('field.error')).default(''),
        }),
      );
    
      const { errors, meta, defineField } = useForm({
        validationSchema: validationSchema,
      });
  
      // Function for registering validator of this field
      registerValidator(validate);
    
      const [secondField, secondFieldAttributes] = defineField('secondField');
  
      watch(
        () => meta.value,
        () => {
          // Function for maintaining validator's invalid fields
          registerInvalidFields(meta.value.valid, `field-${secondFieldUniqueId}`);
        }
      );
      ```

  Note:
  - Where `field-${firstFieldUniqueId}` is a unique form field identifier.
  - Where `field-${seconfFieldUniqueId}` is a unique form field identifier.

## References

- [VeeValidate documentation](https://vee-validate.logaretm.com/v4/)
- [Yup validation schema](https://github.com/jquense/yup)
- [Nuxt vee-validate Module](https://nuxt.com/modules/vee-validate)