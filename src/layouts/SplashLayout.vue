<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="splash-page flex flex items-end justify-end">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/auth-store";

const $q = useQuasar();
const authStore = useAuthStore();

$q.dark.set(true);
</script>

<style lang="scss" scoped>
.splash-page {
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)),
    url("./images/splash-bg-2.jpg");
  background-size: 250%;
  background-position: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
