<template>
  <div>
    <ExercisesTable :exercises="exercises" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar, debounce } from "quasar";

import { loadAllExercises } from "src/utils";
import { useExerciseStore } from "stores/exercise-store";
import { ExerciseCard, ExercisesTable } from "src/components";

const $q = useQuasar();
const exerciseStore = useExerciseStore();

const search = ref("");
const exercises = computed(() => exerciseStore.exercises);

const fetchExercises = async (q) => {
  $q.loading.show();

  try {
    const data = await loadAllExercises(q);
    exerciseStore.exercises = [...data];
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

// const filterExercises = async (q) => {
//   const pin = q.toLowerCase().trim();
//   await fetchExercises(pin);
// };

// const debouncedFilter = debounce(filterExercises, 800);

// watch(search, debouncedFilter);

onMounted(async () => {
  if (exerciseStore.exercises.length > 0) return;
  await fetchExercises("");
});
</script>

<style lang="scss" scoped></style>
