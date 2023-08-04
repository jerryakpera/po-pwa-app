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
      disable
      size="sm"
      color="white"
      class="q-my-sm"
      text-color="black"
      toggle-color="blue-5"
      v-model="workoutStore.comparison"
      :options="[
        { label: 'vs last workout', value: 'last' },
        { label: 'vs average workout', value: 'average' },
      ]"
    >
      <q-tooltip class="text-body2">
        {{
          workoutStore.comparison === "last"
            ? "Will display your progression in comparison with your last workout for that exercise"
            : "Will display your progression in comparison with your average workout for that exercise"
        }}
      </q-tooltip>
    </q-btn-toggle>

    <div class="q-mt-sm">
      <ExerciseCard
        v-for="exercise in exercises"
        :key="exercise._id"
        :exercise="exercise"
      >
        <template #stats>
          <Progression
            :workouts="[...exercise.workouts].slice(-7)"
            :totalProgressiveOverload="exercise?.totalProgressiveOverload"
          />
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
import { loadWorkoutExercises, getTargetMuscles } from "src/utils";

import { Progression, ExerciseCard } from "src/components";

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
    const data = await loadWorkoutExercises(authStore.authUser?.uid);

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
