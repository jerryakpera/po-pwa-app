<template>
  <div
    class="flex items-center justify-center"
    :style="`font-size: 2em; background-color: ${arrow.color}; width: 30px; height: 30px; border-radius: 100%; rotate: ${arrow.deg}deg; over`"
  >
    <POIcon
      v-if="progression.amount > 0"
      icon="ic:outline-keyboard-double-arrow-up"
    />
    <POIcon v-else icon="ic:outline-keyboard-double-arrow-down" />

    <q-tooltip>
      <div>Progressive Overload: {{ progressive_overload }}</div>
      <div>Percent Change: {{ Math.floor(progression.percent) }}%</div>
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["progressive_overload", "progression"]);

const getArrowColor = ({ percent, amount }) => {
  if (amount < 0) {
    if (Math.abs(percent) > 75) return "#990000";
    if (Math.abs(percent) > 50) return "#CC3333";
    if (Math.abs(percent) > 25) return "#FF6666";
    if (Math.abs(percent) > 0) return "#FF9999";
  }

  if (amount > 0) {
    if (Math.abs(percent) > 75) return "#007200";
    if (Math.abs(percent) > 50) return "#008000";
    if (Math.abs(percent) > 25) return "#38b000";
    if (Math.abs(percent) > 0) return "#70e000";
  }

  return "green";
};

const getArrowRotation = ({ percent, amount }) => {
  const absolutePercent = Math.abs(percent);
  return 90 - Math.floor((absolutePercent / 100) * 90);
};

const arrow = computed(() => {
  const { amount, percent } = props.progression;

  return {
    color: getArrowColor({ amount, percent }),
    deg: getArrowRotation({ amount, percent }),
  };
});
</script>

<style lang="scss" scoped></style>
