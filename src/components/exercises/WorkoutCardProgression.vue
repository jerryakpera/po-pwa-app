<template>
  <div class="q-py-sm flex q-gutter-md q-px-sm">
    <ProgressBar
      v-for="(workout, i) in exercise.workouts"
      :key="workout._id"
      :workout="workout"
      :minPO="exercise.minPO"
      :maxPO="exercise.maxPO"
      :averagePO="exercise.averagePO"
      :lastPO="
        exercise.workouts[i - 1]
          ? exercise.workouts[i - 1].progressive_overload
          : workout.progressive_overload
      "
    />
  </div>
</template>

<script setup>
const props = defineProps(["exercise"]);

import { ProgressBar } from "components";
</script>

<style lang="scss" scoped></style>
