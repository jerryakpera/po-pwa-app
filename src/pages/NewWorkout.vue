<template>
  <div>
    <div class="flex items-center q-gutter-md">
      <q-img
        :src="exercise?.demonstration"
        style="width: 80px; height: 80px; border-radius: 10px"
      />

      <div>
        <div class="text-h6 font1 text-weight-medium">
          {{ _.capitalize(exercise?.name) }}
        </div>
        <div class="text-light text-body2 flex q-col-gutter-sm">
          <div>
            {{ _.capitalize(exercise?.target) }}
          </div>
          <div>|</div>
          <div>
            {{ _.capitalize(exercise?.bodyPart) }}
          </div>
          <div>|</div>
          <div>
            {{ _.capitalize(exercise?.equipment) }}
          </div>
        </div>
      </div>
    </div>

    <q-card flat bordered class="bg-dark q-mt-sm" v-if="highestWorkout">
      <q-card-section class="q-pa-xs q-px-sm">
        <div class="q-my-xs">
          {{ moment(new Date(highestWorkout.createdAt)).format("LL") }} - your
          best workout
        </div>
        <div class="flex q-gutter-sm">
          <q-card
            flat
            v-for="(set, i) in getSets(highestWorkout.sets)"
            :key="set"
            class="bg-secondary"
          >
            <q-card-section class="q-pa-xs">
              {{ set.weight }}
              {{ set.weight === 1 ? "" : "kgs" }}
            </q-card-section>
            <q-card-section
              class="bg-white text-secondary text-weight-bold q-pa-sm"
            >
              {{ set.reps }} reps
            </q-card-section>
          </q-card>
        </div>

        <q-linear-progress
          rounded
          size="25px"
          class="q-mt-sm"
          :color="progressColor"
          v-if="workoutsData?._id"
          :value="workoutProgress"
        >
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="dark"
              :label="progressLabel"
              class="text-weight-bold"
            />
          </div>
        </q-linear-progress>
      </q-card-section>
    </q-card>

    <q-card class="bg-dark q-mt-sm" flat>
      <q-card-actions>
        <div class="text-body1">Record your sets</div>

        <q-space />

        <q-btn
          round
          dense
          icon="add"
          color="white"
          text-color="positive"
          @click="handleAddWorkout"
        />
      </q-card-actions>

      <q-card-section class="text-white font2 q-pa-sm">
        <q-form>
          <q-list :key="componentKey">
            <q-item dense>
              <q-item-section class="text-caption text-uppercase"
                >Set</q-item-section
              >
              <q-item-section class="text-caption text-uppercase"
                >Kgs</q-item-section
              >
              <q-item-section class="text-caption text-uppercase"
                >Reps</q-item-section
              >
              <q-item-section class="text-caption text-uppercase">
                <div class="flex justify-end">Overload</div>
              </q-item-section>
            </q-item>
            <q-slide-item
              v-for="(set, i) in sets"
              :key="set"
              right-color="red"
              left-color="positive"
              @right="(e) => handleRemove(e, set)"
              @left="(e) => handleDuplicate(e, set)"
            >
              <template v-slot:right v-if="sets.length > 1">
                <q-icon name="delete" />
              </template>
              <template v-slot:left v-if="Number(workout[set]?.overload) > 0">
                <q-icon name="las la-copy" />
              </template>

              <q-item dense>
                <q-item-section>
                  {{ set }}
                </q-item-section>
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    color="positive"
                    text-color="dark"
                    class="full-width"
                    :type="workout[set].type"
                    v-model="workout[set].weight"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    type="number"
                    color="info"
                    text-color="dark"
                    class="full-width"
                    v-model="workout[set].reps"
                  />
                </q-item-section>
                <q-item-section>
                  <div class="flex justify-end">
                    {{ String(workout[set].overload) || 0 }}
                  </div>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </q-list>
        </q-form>
        <q-separator class="q-mt-md q-mb-sm" color="grey-10" />
        <q-item class="text-accent">
          <q-item-section class="col-3 q-pr-md">
            {{ String(sets.length - 1) }}
          </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section></q-item-section>
          <q-item-section>
            <div class="flex justify-end">
              {{ totalOverload || 0 }}
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions>
        <q-space />

        <q-btn
          label="Save"
          color="info"
          @click="handleFormSubmit"
          :disable="Number(totalOverload) === 0"
        />

        <q-btn
          unelevated
          label="Cancel"
          color="white"
          text-color="negative"
          @click="() => router.go(-1)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";

import { useAuthStore } from "stores/auth-store";
import { useConfirmation } from "src/composables";
import {
  loadExercise,
  createWorkout,
  fetchUsersExerciseWorkouts,
} from "src/utils";

import { ProgressionArrow } from "src/components";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps(["exerciseId"]);

const exercise = ref(null);
const componentKey = ref(0);
const workoutsData = ref(null);
const workout = ref({
  1: {
    weight: "",
    reps: "",
    overload: "",
    type: "number",
  },
});

const minPO = computed(() => workoutsData.value?.minPO);
const maxPO = computed(() => workoutsData.value?.maxPO);
const averagePO = computed(() => workoutsData.value?.averagePO);
const sortedWorkouts = computed(() => workoutsData.value?.sortedWorkouts);

const sortedPOWorkouts = computed(() => {
  return workoutsData.value?.workouts.sort((a, b) => {
    return a.progressive_overload - b.progressive_overload;
  });
});
const lowestWorkout = computed(() => {
  if (!sortedPOWorkouts.value) return;
  return sortedPOWorkouts.value[0];
});
const highestWorkout = computed(() => {
  if (!sortedPOWorkouts.value) return;
  return sortedPOWorkouts.value[sortedPOWorkouts.value?.length - 1];
});

const sets = computed(() => Object.keys(workout.value));
const totalOverload = computed(() => {
  let total = 0;
  sets.value.forEach((set) => {
    const { overload } = workout.value[set];
    total += overload;
  });

  return String(total);
});

const progressLabel = computed(() => {
  const progress = Number(totalOverload.value);

  if (progress < workoutsData.value?.minPO) {
    return "vs lowest";
  }

  return "vs highest";
});

const progressColor = computed(() => {
  const progress = Number(totalOverload.value);

  if (progress < workoutsData.value?.minPO) {
    return "negative";
  }

  if (progress < workoutsData.value?.averagePO) {
    return "accent";
  }

  return "green-7";
});

const currentWorkout = computed(() => {
  const progress = Number(totalOverload.value);

  if (progress < workoutsData.value?.minPO) {
    return lowestWorkout.value;
  }

  return highestWorkout.value;
});

const workoutProgress = computed(() => {
  const progress = Number(totalOverload.value);

  if (progress < workoutsData.value?.minPO) {
    return Number(progress / workoutsData.value?.minPO);
  }

  if (progress < workoutsData.value?.averagePO) {
    return Number(progress / workoutsData.value?.averagePO);
  }

  if (progress < workoutsData.value?.maxPO) {
    return Number(progress / workoutsData.value?.maxPO);
  }

  return 1;
});

const getSets = (sets) => {
  return Object.keys(sets)
    .map((setNo) => {
      return sets[setNo];
    })
    .filter((set) => set.reps);
};

const handleRemove = ({ reset }, set) => {
  const filteredWorkout = {};
  const updatedWorkouts = sets.value.filter((st) => st != set);
  updatedWorkouts.forEach((set, i) => {
    filteredWorkout[i + 1] = workout.value[set];
  });

  workout.value = { ...filteredWorkout };
  reset();

  componentKey.value += 1;
};

const handleDuplicate = ({ reset }, set) => {
  const indexToDuplicate = sets.value.indexOf(set);
  const newSets = [
    ...sets.value.slice(0, indexToDuplicate),
    set,
    ...sets.value.slice(indexToDuplicate),
  ];

  const newWorkout = {};
  newSets.forEach((setNo, index) => {
    newWorkout[index + 1] = { ...workout.value[setNo] };
  });

  workout.value = null;
  workout.value = { ...newWorkout };
  reset();

  componentKey.value += 1;
};

const calculateOverload = (workout) => {
  const { weight, reps } = workout;

  if (weight === "body") return Number(reps) * 1;
  return Number(weight) * Number(reps);
};

const handleAddWorkout = async () => {
  const lastWorkoutIndex = Object.keys(workout.value).reverse()[0];
  const nextWorkoutIndex = Number(lastWorkoutIndex) + 1;

  const { reps: lastReps, weight: lastWeight } =
    workout.value[lastWorkoutIndex];
  if (!lastReps) {
    $q.notify({
      message: "Enter your reps",
      color: "dark",
      timeout: 2500,
    });
    return;
  }

  if (!lastWeight) {
    workout.value[lastWorkoutIndex].type = "text";
    workout.value[lastWorkoutIndex].weight = "body";
  }

  const lastWorkout = workout.value[lastWorkoutIndex];
  const overload = calculateOverload(lastWorkout);

  workout.value[lastWorkoutIndex].overload = overload;

  workout.value[nextWorkoutIndex] = {
    reps: "",
    weight: "",
    overload: "",
    type: "number",
  };
};

const fetchWorkout = async (id) => {
  $q.loading.show();

  try {
    exercise.value = await loadExercise(id);
    workoutsData.value = await fetchUsersExerciseWorkouts(
      id,
      authStore.authUser.uid
    );
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

const handleFormSubmit = async () => {
  if (totalOverload.value === 0) return;

  const confirmed = await useConfirmation($q.dialog, "Record workout?");
  if (!confirmed) return;

  try {
    const payload = {
      sets: workout.value,
      uid: authStore.authUser.uid,
      exerciseId: props.exerciseId,
    };

    await createWorkout(payload);
    router.push("/");
  } catch (e) {
    console.log(e);
  }
};

watch(sets, (current) => {});

onMounted(async () => {
  await fetchWorkout(props.exerciseId);
});
</script>

<style lang="scss" scoped></style>
