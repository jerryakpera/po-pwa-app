<template>
  <div style="margin-top: -90px">
    <div class="text-h4 text-weight-bold q-mb-sm">Training & tracking</div>
    <div class="text-body2 q-mt-md q-mb-md">
      Don't lapse on your progress. Record your sets while you train and have
      access to your progression
    </div>
    <div class="row items-center q-col-gutter-xs">
      <div class="col-10">
        <q-btn
          rounded
          size="lg"
          color="white"
          text-color="dark"
          label="Get Started"
          to="/landing/sign-up"
          class="full-width text-weight-bold"
        />
      </div>
      <div class="col-2">
        <q-btn
          round
          size="lg"
          color="white"
          text-color="dark"
          to="/landing/login"
          class="text-weight-bold"
        >
          <POIcon class="text-h4" icon="mdi:login" />
        </q-btn>
      </div>
    </div>
  </div>
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
