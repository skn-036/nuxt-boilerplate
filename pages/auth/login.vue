<script setup lang="ts">
import { object, string } from 'yup';

const { postRequest: loginRequest, postRequestLoading: loading } =
  useClientRequest('/auth/login');

const formData = ref({
  email: '',
});
const formErrors = ref<YupValidationError>({});

const schema = object().shape({
  email: string().email().required(),
});
const onSubmit = async () => {
  const { validated, data, errors } = await validateData(
    schema,
    formData.value,
  );
  if (!validated) {
    formErrors.value = errors;
    console.error('Validation errors:', formErrors.value);
    return;
  }
  formErrors.value = {};

  await loginRequest({ body: data });
};
</script>

<template>
  <NuxtLayout name="full-centered-content">
    <Card class="w-[400px] space-y-8">
      <CardHeader class="flex flex-col items-center justify-center gap-2.5">
        <NuxtImg src="/assets/images/banke-logo.png" width="200" />
        <CardDescription>{{ $t('login.welcome') }}</CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-6" @submit.prevent="onSubmit">
          <FormWrapper
            v-slot="{ id }"
            :label="$t('login.emailLabel')"
            :error="formErrors?.email"
            required
          >
            <Input
              :id="id"
              v-model="formData.email"
              :placeholder="$t('login.emailPlaceholder')"
            />
          </FormWrapper>

          <Button class="w-full" :loading="loading">{{
            $t('login.buttonTitle')
          }}</Button>
        </form>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
