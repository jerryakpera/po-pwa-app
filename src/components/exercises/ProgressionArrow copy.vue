<template>
  <div
    class="flex items-center justify-center"
    :style="`font-size: 1.5em; background-color: ${arrow?.color}; width: 30px; height: 30px; border-radius: 100%;`"
  >
    <POIcon
      icon="ph:arrow-fat-up-fill"
      :style="`rotate: ${arrow?.rotation}deg;`"
      style="transform-origin: center"
    />

    <q-tooltip :style="`background-color: ${arrow.color}`">
      <div class="flex items-center nowrap flex-nowrap">
        <POIcon
          style="font-size: 1.3em"
          :icon="
            props.stats.percentageDifferenceWithLastPO < 0
              ? 'game-icons:muscle-fat'
              : 'game-icons:muscle-up'
          "
          class="q-mr-xs"
        />
        Your workout
        {{
          props.stats.percentageDifferenceWithLastPO < 0
            ? "reduced"
            : "increased"
        }}
        by {{ props.stats.percentageDifferenceWithLastPO }}%
      </div>
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useWorkoutStore } from "stores/workout-store";

const props = defineProps(["stats", "progressive_overload"]);

const workoutStore = useWorkoutStore();

const getColors = (amount, percent) => {
  const percentNumber = Number(percent);

  if (percentNumber < -75) return "#390E0A";
  if (percentNumber < -50) return "#C11101";
  if (percentNumber < -25) return "#FE3A29";
  if (percentNumber < -0) return "#FE998F";

  if (percentNumber > 75) return "#297057";
  if (percentNumber > 50) return "#33906F";
  if (percentNumber > 25) return "#3DB088";
  if (percentNumber > 0) return "#54C59D";
};

const getRotation = (percent) => {
  const deg = (Number(percent) / 100) * 90;
  if (deg > 90) return 0;
  return 90 - deg;
};

const arrow = computed(() => {
  let {
    differenceWithLastPO: amount,
    percentageDifferenceWithLastPO: percent,
  } = props.stats;

  if (workoutStore.comparison !== "last") {
    amount = props.stats.differenceWithAveragePO;
    percent = props.stats.percentageDifferenceWithAveragePO;
  }

  return {
    color: getColors(amount, percent),
    rotation: getRotation(percent),
  };
});

// const exampleStats = {
//   differenceWithLastPO: 1440,
//   differenceWithAveragePO: 1440,
//   percentageDifferenceWithLastPO: "100",
//   percentageDifferenceWithAveragePO: "100",
// };
</script>

<style lang="scss" scoped></style>
