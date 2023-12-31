<template>
  <q-form
    ref="formRef"
    autocomplete="false"
    @submit.prevent.stop="handleFormSubmit"
    class="column q-col-gutter-sm full-width"
  >
    <div class="text-h4 font1 text-weight-medium">Login</div>
    <q-input
      dark
      outlined
      type="text"
      color="info"
      label="email"
      v-model="user.email"
      :rules="[isRequired, isEmail]"
    />

    <q-input
      outlined
      color="info"
      label="password"
      v-model="user.password"
      :type="revealPassword ? 'text' : 'password'"
    >
      <template #append>
        <q-btn dense round @click="revealPassword = !revealPassword">
          <POIcon
            class="text-h5"
            :icon="revealPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
          />
        </q-btn>
      </template>
    </q-input>

    <div class="text-light text-body2 q-mb-sm">
      Dont have an account?
      <router-link to="/landing/sign-up" class="text-accent"
        >Sign up</router-link
      >
    </div>

    <div class="q-px-none q-mt-sm">
      <q-btn
        no-caps
        size="lg"
        label="Login"
        type="submit"
        color="blue-10"
        class="full-width q-mb-sm"
      />

      <q-btn
        no-caps
        size="lg"
        color="white"
        class="full-width"
        text-color="blue-10"
        @click="handleGoogleLogin"
      >
        <div class="full-height flex items-center">
          <POIcon icon="akar-icons:google-fill" class="text-h5 q-mr-xs" />
          Login with Google
        </div>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { useAuthStore } from "stores/auth-store";
import { auth } from "src/config/firebase.config";

import {
  useValidation,
  useConfirmation,
  useFormValidation,
} from "src/composables";

const $q = useQuasar();
const router = useRouter();
const provider = new GoogleAuthProvider();

const { isRequired, isEmail } = useValidation();
const { formRef, validateForm, resetForm } = useFormValidation();

const authStore = useAuthStore();

const revealPassword = ref(false);
const user = ref({
  email: "",
  password: "",
});

const handleSuccessfulLogin = (firebaseUser) => {
  authStore.login(firebaseUser);
  router.push("/");
};

const handleFormSubmit = async () => {
  const formIsValid = await validateForm();
  if (!formIsValid) return;

  const confirmed = await useConfirmation($q.dialog, "Login?");
  if (!confirmed) return;

  $q.loading.show();

  try {
    const authUser = await signInWithEmailAndPassword(
      auth,
      user.value?.email,
      user.value?.password
    );

    handleSuccessfulLogin(authStore.user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log({ errorCode });
    console.log({ errorMessage });

    let message = "Could not sign in";

    if (errorCode === "auth/wrong-password") {
      message = "Incorrect username or password";
    }

    $q.notify({
      message,
      color: "negative",
      icon: "las la-exclamation",
    });
  }

  $q.loading.hide();
};

const handleGoogleLogin = async () => {
  $q.loading.show();

  try {
    const authUser = await signInWithPopup(auth, provider);
    handleSuccessfulLogin(authUser.user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log({ errorCode });
    console.log({ errorMessage });

    let message = "Could not sign in";

    if (errorCode === "auth/wrong-password") {
      message = "Incorrect username or password";
    }

    $q.notify({
      message,
      color: "negative",
      icon: "las la-exclamation",
    });
  }

  $q.loading.hide();
};
</script>

<style lang="scss" scoped></style>
