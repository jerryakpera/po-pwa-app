<template>
  <q-layout
    view="hHh lpR fFf"
    style="
      background-color: black;
      background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.62),
          rgba(0, 0, 0, 0.93)
        ),
        url('https://images.unsplash.com/photo-1491756975177-a13d74ed1e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=415&q=80');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    "
  >
    <div style="height: 100vh">
      <div
        class="text-center text-weight-bold text-h3 q-pt-md font2 flex items-center"
      >
        <q-btn flat to="/landing" round class="q-px-sm">
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

const $q = useQuasar();

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
