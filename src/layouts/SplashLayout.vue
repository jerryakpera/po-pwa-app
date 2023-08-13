<template>
  <q-layout
    view="hHh lpR fFf"
    style="
      background-color: black;
      background: linear-gradient(black) url('/gym.jpg');
      background-position: center;
      background-repeat: no-repeat;
    "
  >
    <div style="height: 100vh">
      <div
        class="text-center text-weight-bold text-h3 q-pt-md font2 flex items-center"
      >
        <q-btn to="/landing" round class="q-px-sm">
          <POIcon icon="material-symbols:home-rounded" class="text-h3" />
        </q-btn>
        <span> Iron </span>
        <span class="text-accent">Diary</span>
      </div>

      <q-page-container
        style="position: fixed; bottom: 20px; width: 100%"
        class="q-px-md"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </div>
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
.splash-layout {
  height: 100vh;
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
