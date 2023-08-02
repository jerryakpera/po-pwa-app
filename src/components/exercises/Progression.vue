<template>
  <div class="q-pa-sm">
    <div class="stats">
      <div v-for="workout in workouts" :key="workout._id">
        <ProgressionArrow
          :stats="workout.stats"
          :progressive_overload="workout.progressive_overload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProgressionArrow from "./ProgressionArrow.vue";

const props = defineProps(["workouts", "totalProgressiveOverload"]);
</script>

<style lang="scss" scoped>
.stats {
  gap: 12px;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
