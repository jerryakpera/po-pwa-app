<template>
  <div>
    <div class="flex items-center q-gutter-md">
      <q-img
        v-if="!inDevelopment"
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

    <div class="q-mt-md">
      <Calendar
        transparent
        ref="calendar"
        :attributes="attributes"
        style="max-width: 450px"
        @dayclick="handleDayClick"
        class="full-width text-white"
        :disabled-dates="disabledDates"
      />
    </div>

    <div v-if="workouts?.length" class="q-mt-md">
      <q-list separator>
        <q-item v-for="workout in workouts" :key="workout._id">
          <q-item-section>
            <q-item-label>
              {{ moment(new Date(workout.createdAt)).format("LL") }}
            </q-item-label>
            <q-item-label caption lines="2">
              <div class="flex q-gutter-sm">
                <q-card
                  v-for="(set, i) in getSets(workout.sets)"
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
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              {{ workout.progressive_overload }}
            </q-item-label>
            <ProgressionArrow
              class="q-mt-xs"
              :stats="workout.stats"
              :progressive_overload="workout.progressive_overload"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-else>
      <div class="text-body2 font2 text-accent">
        Select a day to view your workout
      </div>
    </div>

    <q-card-actions class="q-mt-xl">
      <q-space />

      <q-btn
        label="Back"
        no-caps
        color="white"
        text-color="negative"
        @click="() => router.go(-1)"
      />
    </q-card-actions>
  </div>
</template>

<script setup>
import "v-calendar/style.css";
import { Calendar, DatePicker } from "v-calendar";

import _ from "lodash";
import moment from "moment";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";

import ProgressionArrow from "src/components/exercises/ProgressionArrow.vue";

import { loadUsersExercise } from "src/utils";
import { useAuthStore } from "stores/auth-store";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps(["exerciseId"]);

const calendar = ref(null);
const exercise = ref(null);
const disabledDates = ref([new Date("2023-07-13")]);
const attributes = ref([
  {
    highlight: "blue",
    dates: [],
  },
  {
    highlight: "gray",
    dates: [],
  },
]);

const getSets = (sets) => {
  return Object.keys(sets)
    .map((setNo) => {
      return sets[setNo];
    })
    .filter((set) => set.reps);
};

const formatDateAsStr = (date) => moment(new Date(date)).format("YYYY-MM-DD");

const setDisabledDates = (start, end) => {
  let endDate = new Date(end);
  let startDate = new Date(start);
  let days = [];
  for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    days.push(formatDateAsStr(new Date(day)));
  }

  const workoutDates = exercise.value?.workouts.map((workout) =>
    formatDateAsStr(workout.createdAt)
  );

  disabledDates.value = days.filter((day) => {
    if (!workoutDates.includes(day)) {
      return day;
    }
  });
};

const inDevelopment = computed(() => process.env.DEV);
const selectedDates = computed(() => attributes.value[0].dates);

const workouts = computed(() => {
  return exercise.value?.workouts.filter((workout) => {
    const workoutDate = formatDateAsStr(workout.createdAt);
    if (selectedDates.value.includes(workoutDate)) {
      return workout;
    }
  });
});

const selectValidDates = () => {
  exercise.value?.workouts.map((workout) => {
    const { createdAt } = workout;
    const workoutDate = new Date(createdAt);

    attributes.value[1].dates.push(workoutDate);
  });
};

const moveToDate = async (date) => {
  await calendar.value.move(date);
};

const addDateToSelection = (date) => {
  attributes.value[0].dates.push(date);
};

const removeFromSelection = (date) => {
  attributes.value[0].dates = attributes.value[0].dates.filter(
    (day) => day != date
  );
};

const handleDayClick = (e) => {
  const { id } = e;

  const invalidDates = disabledDates.value.map(formatDateAsStr);
  if (invalidDates.includes(id)) return;

  if (selectedDates.value.includes(id)) {
    removeFromSelection(id);
    return;
  }

  addDateToSelection(id);
};

const initializeCalendar = (workouts) => {
  const lastDate = workouts?.reverse()[0].createdAt;
  const workoutDate = moment(new Date(lastDate)).format("YYYY-MM-DD");

  moveToDate(workoutDate);
  selectValidDates(workouts);
  addDateToSelection(workoutDate);

  const [year, month, day] = workoutDate.split("-");
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${Number(month) + 1}-01`;

  setDisabledDates(startDate, endDate);
};

const fetchWorkout = async (id) => {
  $q.loading.show();

  try {
    exercise.value = await loadUsersExercise(id, authStore.authUser.uid);
    initializeCalendar(exercise.value?.workouts);
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

onMounted(async () => {
  await fetchWorkout(props.exerciseId);
});
</script>

<style lang="scss" scoped></style>
