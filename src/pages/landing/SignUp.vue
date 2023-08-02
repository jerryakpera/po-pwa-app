<template>
  <q-card
    class="q-pa-lg full-width splash-card"
    style="background-color: rgba(0, 0, 0, 0.8)"
  >
    <q-form
      ref="formRef"
      autocomplete="off"
      class="column q-col-gutter-sm"
      @submit.prevent.stop="handleFormSubmit"
    >
      <div class="text-h4 splash-heading font1">Sign up</div>
      <q-input
        dark
        rounded
        outlined
        type="text"
        color="info"
        label="email"
        v-model="user.email"
        :rules="[isRequired, isEmail]"
      />

      <q-input
        dark
        rounded
        outlined
        type="text"
        color="info"
        label="username"
        v-model="user.username"
        :rules="[isRequired, minUsernameLength, maxUsernameLength]"
      />

      <q-input
        rounded
        outlined
        color="info"
        label="password"
        v-model="user.password"
        :type="revealPassword ? 'text' : 'password'"
        :rules="[
          hasNumber,
          isRequired,
          hasLowercase,
          hasUppercase,
          hasSpecialChar,
        ]"
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

      <q-input
        rounded
        outlined
        color="info"
        :rules="[passwordMatches]"
        label="confirm your password"
        v-model="user.confirmpassword"
        :type="revealConfirmPassword ? 'text' : 'password'"
      >
        <template #append>
          <q-btn
            dense
            round
            @click="revealConfirmPassword = !revealConfirmPassword"
          >
            <POIcon
              class="text-h5"
              :icon="
                revealConfirmPassword
                  ? 'mdi:eye-off-outline'
                  : 'mdi:eye-outline'
              "
            />
          </q-btn>
        </template>
      </q-input>

      <div class="text-light text-caption q-my-sm">
        Already have an account?
        <router-link to="/landing/login" class="text-accent">Login</router-link>
      </div>

      <div class="q-px-none q-mt-sm">
        <q-btn
          no-caps
          rounded
          type="submit"
          label="Signup"
          color="secondary"
          class="full-width q-mb-sm"
        />

        <q-btn
          no-caps
          rounded
          color="info"
          class="full-width"
          @click="handleGoogleLogin"
        >
          <div class="full-height flex items-center">
            <POIcon icon="akar-icons:google-fill" class="text-h5 q-mr-xs" />
            Signup with Google
          </div>
        </q-btn>
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "src/config/firebase.config";

import {
  useValidation,
  useConfirmation,
  useFormValidation,
} from "src/composables";
import { useAuthStore } from "stores/auth-store";

const router = useRouter();
const authStore = useAuthStore();
const provider = new GoogleAuthProvider();

const $q = useQuasar();
const {
  isEmail,
  isLength,
  hasNumber,
  isRequired,
  hasLowercase,
  hasUppercase,
  hasSpecialChar,
} = useValidation();
const { formRef, validateForm, resetForm } = useFormValidation();

const minUsernameLength = isLength.min(3);
const maxUsernameLength = isLength.max(32);

const revealPassword = ref(false);
const revealConfirmPassword = ref(false);
const user = ref({
  email: "",
  username: "",
  password: "",
  confirmpassword: "",
});

const passwordMatches = computed(() => (val) => {
  const { password } = user.value;
  return password === val || "Passwords must match";
});

const handleSuccessfulSignUp = (firebaseUser) => {
  authStore.login(firebaseUser);
  router.push("/");
};

const handleFormSubmit = async () => {
  const formIsValid = await validateForm();
  if (!formIsValid) return;

  const confirmed = await useConfirmation($q.dialog, "Signup?");
  if (!confirmed) return;

  $q.loading.show();

  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      user.value?.email,
      user.value?.password
    );

    handleSuccessfulSignUp(firebaseUser);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log({ errorCode });
    console.log({ errorMessage });

    let message = "Could not sign up";

    if (errorCode === "auth/email-already-in-use") {
      message = "Email already in use";
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
    handleSuccessfulSignUp(authUser.user);
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
