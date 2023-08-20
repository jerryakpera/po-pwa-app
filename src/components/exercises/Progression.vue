<template>
  <div>
    <!-- <div>
      <q-chip square dense>
        <q-avatar
          text-color="white"
          :style="`background: rgba(${hexToRgb(
            bgColor(percentageDifferenceWithMaxPO)
          )}, 1)`"
        >
          <POIcon
            icon="ph:arrow-fat-up-fill"
            :style="`rotate: ${getRotation(percentageDifferenceWithMaxPO)}deg;`"
            style="transform-origin: center"
          />
        </q-avatar>
        vs best
      </q-chip>

      <q-chip square dense>
        <q-avatar
          text-color="white"
          :style="`background: rgba(${hexToRgb(
            bgColor(percentageDifferenceWithAveragePO)
          )}, 1)`"
        >
          <POIcon
            icon="ph:arrow-fat-up-fill"
            :style="`rotate: ${getRotation(
              percentageDifferenceWithAveragePO
            )}deg;`"
            style="transform-origin: center"
          />
        </q-avatar>
        vs average
      </q-chip>
    </div> -->

    <div class="stats q-py-xs" style="overflow-x: hidden !important">
      <div v-for="(workout, i) in workoutsToDisplay" :key="workout._id">
        <ProgressionArrow
          :progressive_overload="workout.progressive_overload"
          :lastPO="workoutsToDisplay[i - 1]?.progressive_overload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ProgressionArrow from "./ProgressionArrow.vue";
import { getPercentageDiff, hexToRgb, getColors } from "src/utils";

// const props = defineProps(["workouts", "totalProgressiveOverload"]);
const props = defineProps(["exercise"]);

const workoutsToDisplay = computed(() => props.exercise.workouts?.slice(-6));

const percentageDifferenceWithAveragePO = computed(() => {
  const lastWorkout = props.exercise?.sortedWorkouts[0];
  const { progressive_overload: lastPO } = lastWorkout;

  const percentageDifference = getPercentageDiff(
    lastPO,
    props.exercise.averagePO
  );

  return percentageDifference;
});

const percentageDifferenceWithMinPO = computed(() => {
  const lastWorkout = props.exercise?.sortedWorkouts[0];
  const { progressive_overload: lastPO } = lastWorkout;

  const percentageDifference = getPercentageDiff(lastPO, props.exercise.minPO);

  return percentageDifference;
});

const percentageDifferenceWithMaxPO = computed(() => {
  const lastWorkout = props.exercise?.sortedWorkouts[0];
  const { progressive_overload: lastPO } = lastWorkout;

  const percentageDifference = getPercentageDiff(lastPO, props.exercise.maxPO);

  return percentageDifference;
});

const bgColor = (percent) => getColors(percent);

const getRotation = (percent) => {
  const deg = (Number(percent) / 100) * 90;
  if (deg > 90) return 0;
  return 90 - deg;
};
</script>

<style lang="scss" scoped>
.stats,
.chips {
  gap: 12px;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
}

.chips {
  gap: 5px;
}
</style>
