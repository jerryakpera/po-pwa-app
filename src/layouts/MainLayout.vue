<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="font2 text-accent">
          <q-avatar>
            <POIcon
              icon="arcticons:home-workouts"
              class="text-h5 text-accent"
            />
          </q-avatar>
          <!-- <span class="text-subtitle1 text-weight-bold">POverload</span> -->
          {{ authStore.authUser?.displayName }}
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense @click="handleLogout" text-color="accent">
          <POIcon icon="mdi-light:logout" class="text-h5" />
        </q-btn>
      </q-toolbar>

      <q-tabs align="justify" dense :breakpoint="0">
        <q-route-tab to="/" exact exact-active-class="bg-accent text-dark">
          <POIcon icon="material-symbols:home" class="text-h5" />
          <span class="text-caption text-weight-medium"> My workouts </span>
        </q-route-tab>
        <q-route-tab
          to="/exercises"
          exact
          exact-active-class="bg-accent text-dark"
        >
          <POIcon icon="healthicons:exercise-weights" class="text-h5" />
          <span class="text-caption text-weight-medium"> All Exercises </span>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <q-page-container class="bg-black">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <q-page class="q-px-md">
            <component :is="Component" />
          </q-page>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { signOut } from "firebase/auth";

import { useAuthStore } from "stores/auth-store";
import { auth } from "src/config/firebase.config";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await signOut(auth);

    authStore.logout();
    router.push("/landing");
  } catch (e) {
    console.log(e);
  }
};

$q.dark.set(true);
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
