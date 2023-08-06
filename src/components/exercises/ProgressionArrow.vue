<template>
  <div
    class="flex items-center justify-center"
    :style="`font-size: 1.3em; background: rgba(${hexToRgb(
      bgColor(percentDifferenceWithLastPO)
    )}, 1); color: white; width: 30px; height: 30px; border-radius: 100%;`"
  >
    <POIcon
      icon="ph:arrow-fat-up-fill"
      :style="`rotate: ${getRotation(percentDifferenceWithLastPO)}deg;`"
      style="transform-origin: center"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getPercentageDiff, hexToRgb, getColors } from "src/utils";

const props = defineProps(["lastPO", "progressive_overload"]);

const percentDifferenceWithLastPO = computed(() => {
  if (!props.lastPO) return 100;
  return getPercentageDiff(props.progressive_overload, props.lastPO);
});

const getRotation = (percent) => {
  const deg = (Number(percent) / 100) * 90;
  if (deg > 90) return 0;
  return 90 - deg;
};

const bgColor = (percent) => getColors(percent);
</script>

<style lang="scss" scoped></style>
