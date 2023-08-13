<template>
  <q-layout view="hHh lpR fFf" style="background-color: black">
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
      <q-img
        src="/gym.jpg"
        style="
          height: 50%;
          margin-top: 150px;
          box-shadow: 1px 2px 3px rgba(0, 0, 0, 0, 0.3);
        "
      />
      <q-card flat square class="transparent">
        <q-card-section>
          <q-page-container>
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </q-page-container>
        </q-card-section>
      </q-card>
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
