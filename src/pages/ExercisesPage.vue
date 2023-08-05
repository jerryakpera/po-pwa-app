<template>
  <div>
    <ExercisesTable :exercises="exercises" />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, onMounted } from "vue";

import { loadAllExercises } from "src/utils";
import { ExercisesTable } from "src/components";
import { useExerciseStore } from "stores/exercise-store";

const $q = useQuasar();
const exerciseStore = useExerciseStore();

const exercises = computed(() => exerciseStore.exercises);

const fetchExercises = async (q) => {
  $q.loading.show();

  try {
    const data = await loadAllExercises(q);
    exerciseStore.exercises = [...data].filter(
      (exercise) => exercise.target != "cardiovascular system"
    );
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

onMounted(async () => {
  if (exerciseStore.exercises.length > 0) return;
  await fetchExercises("");
});
</script>

<style lang="scss" scoped></style>
