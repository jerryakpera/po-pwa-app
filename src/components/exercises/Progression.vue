<template>
  <div class="q-pa-sm">
    <div class="progressions">
      <div v-for="workout in workouts" :key="workout._id">
        <ProgressionArrow
          :progressive_overload="workout.progressive_overload"
          :progression="workout.progression"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProgressionArrow from "./ProgressionArrow.vue";

const props = defineProps(["workouts"]);
</script>

<style lang="scss" scoped>
.progressions {
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
