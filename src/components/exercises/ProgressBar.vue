<template>
  <div>
    <div class="bg-grey-9 outer-bar">
      <div
        class="inner-bar"
        :style="`height: ${innerBarHeight}px; background-color: #${innerBarColor}`"
        :class="innerBarHeight >= 45 ? 'round-top' : ''"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getColors2, getPercentageDiff } from "src/utils";

const props = defineProps(["workout", "minPO", "maxPO", "lastPO", "averagePO"]);

const minPO = computed(() => props.minPO);
const maxPO = computed(() => props.maxPO);
const averagePO = computed(() => props.averagePO);
const progressive_overload = computed(
  () => props.workout?.progressive_overload
);

const innerBarHeight = computed(() => {
  if (averagePO.value) {
    const fractionDifference = progressive_overload.value / maxPO.value;

    const height = fractionDifference * 45;
    return Number(height.toFixed(2));
  }

  return 0;
});

const innerBarColor = computed(() => {
  if (averagePO.value) {
    const percentDiff = getPercentageDiff(
      progressive_overload.value,
      props.lastPO
    );

    return getColors2(percentDiff);
  }

  return "green";
});
</script>

<style lang="scss" scoped>
.outer-bar {
  position: relative;
  width: 30px;
  height: 45px;
  border-radius: 5px;

  .inner-bar {
    bottom: 0;
    width: 30px;
    position: absolute;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    &.round-top {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
  }
}
</style>
