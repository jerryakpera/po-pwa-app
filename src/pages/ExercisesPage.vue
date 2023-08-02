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

    <div class="q-mt-md" v-for="exercise in exercises" :key="exercise._id">
      <ExerciseCard :exercise="exercise">
        <template #progression v-if="exercise?.workouts.length">
          <Progression
            :workouts="[...exercise.workouts, ...exercise.workouts].slice(-7)"
          />
        </template>
      </ExerciseCard>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar, debounce } from "quasar";

import { loadExercises } from "src/utils";
import { useExerciseStore } from "stores/exercise-store";
import { ExerciseCard, Progression } from "src/components";

const $q = useQuasar();
const exerciseStore = useExerciseStore();

const search = ref("");
const exercises = ref([]);

const fetchExercises = async (q) => {
  $q.loading.show();

  try {
    const data = await loadExercises(q);
    exerciseStore.exercises = [...data];
    exercises.value = [...data];
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

const filterExercises = async (q) => {
  const pin = q.toLowerCase().trim();
  await fetchExercises(pin);
};

const debouncedFilter = debounce(filterExercises, 800);

watch(search, debouncedFilter);

onMounted(async () => {
  await fetchExercises("");
});
</script>

<style lang="scss" scoped></style>
