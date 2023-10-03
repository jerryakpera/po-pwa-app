<template>
  <q-card flat>
    <q-card-section
      class="q-pa-none"
      :style="`background: rgba(${hexToRgb(bgColor)}, 0.3)`"
    >
      <div class="row items-start">
        <div class="col-3">
          <router-link
            :to="
              exercise.workouts.length
                ? `/workouts/${exercise._id}`
                : `/workouts/${exercise._id}/new`
            "
          >
            <q-img
              :src="exercise.demonstration"
              style="
                height: 100%;
                border-top-left-radius: 5px;
                border-bottom-right-radius: 5px;
              "
            />
          </router-link>
        </div>

        <div class="col-9 items-center q-pa-xs q-px-sm q-mt-none q-pt-none row">
          <div class="column full-width">
            <div
              class="text-accent text-weight-medium text-body2"
              :class="exercise.workouts.length ? 'cursor-pointer' : ''"
              @click="openWorkouts(exercise._id)"
              style="
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              {{ _.capitalize(exercise.name) }}

              <q-tooltip class="text-body2" style="width: 300px">
                {{ _.capitalize(exercise.name) }}
              </q-tooltip>
            </div>
            <div class="text-light text-caption">
              {{ _.capitalize(exercise.target) }} |
              {{ _.capitalize(exercise.bodyPart) }}
            </div>

            <slot name="stats" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import _ from "lodash";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { getPercentageDiff, getColors, hexToRgb } from "src/utils";

const router = useRouter();
const props = defineProps(["exercise"]);

const poDifferenceWithAverage = computed(() => {
  if (!props.exercise?.sortedWorkouts?.length) return 0;
  const lastWorkout = props.exercise?.sortedWorkouts[0];
  const { progressive_overload: lastPO } = lastWorkout;

  const percentageDifference = getPercentageDiff(
    lastPO,
    props.exercise.averagePO
  );

  return percentageDifference;
});

const bgColor = computed(() => {
  if (poDifferenceWithAverage.value) {
    return getColors(poDifferenceWithAverage.value);
  }

  return "000000";
});

const openWorkouts = (id) => {
  if (!props.exercise?.workouts?.length) return;
  router.push(`/workouts/${id}`);
};
</script>

<style lang="scss" scoped>
.text-wrap {
  word-wrap: break-word;
}
</style>
