<template>
  <div>
    <q-input
      dense
      rounded
      outlined
      bottom-slots
      color="accent"
      v-model="search"
      placeholder="search"
      hint="Search your workouts"
    >
      <template v-slot:append>
        <q-icon
          name="close"
          v-if="search !== ''"
          @click="search = ''"
          class="cursor-pointer"
        />
        <q-icon name="search" />
      </template>
    </q-input>

    <div v-if="!exercises.length" class="q-my-md text-body1 font1">
      Go to
      <router-link to="/exercises" class="link">exercises</router-link> to
      record your first workout
    </div>

    <q-btn-toggle
      spread
      no-caps
      color="white"
      class="q-my-sm"
      text-color="black"
      toggle-color="blue-7"
      v-model="workoutStore.comparison"
      :options="[
        { label: 'Use arrows', value: 'arrows' },
        { label: 'Use bars', value: 'bars' },
      ]"
    />

    <div class="q-mt-sm" v-if="workoutStore.comparison === 'bars'">
      <WorkoutCard
        v-for="exercise in exercises"
        :key="exercise._id"
        :exercise="exercise"
        class="q-mb-md q-mt-sm"
      >
        <template #stats>
          <WorkoutCardProgression :exercise="exercise" />
        </template>
      </WorkoutCard>
    </div>

    <div class="q-mt-sm" v-if="workoutStore.comparison === 'arrows'">
      <ExerciseCard
        v-for="exercise in exercises"
        :key="exercise._id"
        :exercise="exercise"
        class="q-mb-md q-mt-sm"
      >
        <template #stats>
          <Progression :exercise="exercise" />
        </template>
      </ExerciseCard>
    </div>
  </div>
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
