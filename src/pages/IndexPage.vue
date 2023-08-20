<template>
  <q-page>
    <WorkoutsTable :exercises="exercises" />
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar, debounce } from "quasar";

import { useAuthStore } from "stores/auth-store";
import { useWorkoutStore } from "stores/workout-store";
import { getUsersWorkouts, getTargetMuscles } from "src/utils";

import {
  Progression,
  ExerciseCard,
  WorkoutCard,
  WorkoutCardProgression,
  WorkoutsTable,
} from "src/components";

const $q = useQuasar();
const authStore = useAuthStore();
const workoutStore = useWorkoutStore();

const search = ref("");
const exercises = ref([]);

const filterWorkouts = (q) => {
  const pin = q.toLowerCase().trim();
  if (!pin) {
    exercises.value = [...workoutStore.exercises];
    return;
  }

  const filteredWorkouts = workoutStore.exercises.filter((exercise) => {
    const { target, exercise_name } = exercise;
    const targetStr = getTargetMuscles(target);

    const exerciseDetailsStr = `${targetStr} ${exercise_name}`;

    if (exerciseDetailsStr.toLowerCase().includes(pin)) {
      return exercise;
    }
  });

  exercises.value = [...filteredWorkouts];
};

const debouncedFilter = debounce(filterWorkouts, 800);

watch(search, debouncedFilter);

const fetchExercises = async () => {
  $q.loading.show();

  try {
    const data = await getUsersWorkouts(authStore.authUser?.uid);

    workoutStore.exercises = [...data];
    exercises.value = [...data];
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

onMounted(async () => {
  await fetchExercises();
});
</script>
