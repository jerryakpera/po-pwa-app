<template>
  <q-card class="q-pa-lg splash-card transparent" flat>
    <div>
      <POIcon icon="arcticons:home-workouts" class="text-h1 text-yellow-6" />
    </div>
    <div class="text-h4 splash-heading font1">Track your progression</div>
    <div class="text-h6 font2 text-yellow">
      and have access to your progression for each workout
    </div>
    <div class="q-px-none q-mt-sm row q-col-gutter-xs">
      <div class="col-6">
        <q-btn
          no-caps
          rounded
          color="info"
          label="Login"
          class="full-width"
          to="/landing/login"
        />
      </div>
      <div class="col-6">
        <q-btn
          no-caps
          rounded
          label="Sign up"
          color="secondary"
          class="full-width"
          to="/landing/sign-up"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const slide = ref("style");
</script>

<style lang="scss" scoped>
.splash-heading {
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
