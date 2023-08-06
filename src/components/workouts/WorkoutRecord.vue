<template>
  <q-slide-item
    @right="(e) => onRight(e, workout._id)"
    right-color="red"
    class="q-mb-sm"
  >
    <template v-slot:right>
      <div class="row items-center">
        <q-icon right name="delete" />
      </div>
    </template>
    <q-item>
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
          :lastPO="lastPO"
          :progressive_overload="progressive_overload"
        />
      </q-item-section>
    </q-item>
  </q-slide-item>
</template>

<script setup>
import moment from "moment";
import { useQuasar } from "quasar";

import { deleteWorkout } from "src/utils";
import { ProgressionArrow } from "components";
import { useConfirmation } from "src/composables";

const $q = useQuasar();
const emit = defineEmits(["refresh"]);
const props = defineProps(["workout", "lastPO", "progressive_overload"]);

const getSets = (sets) => {
  return Object.keys(sets)
    .map((setNo) => {
      return sets[setNo];
    })
    .filter((set) => set.reps);
};

const onLeft = () => {};
const onRight = async ({ reset }, workoutId) => {
  const confirmed = await useConfirmation(
    $q.dialog,
    "Delete this workout? Action cannot be reversed"
  );
  if (!confirmed) {
    reset();
    return;
  }

  $q.loading.show();

  try {
    await deleteWorkout(workoutId);
    emit("refresh");
  } catch (e) {
    console.log(e);
    $q.notify({
      message: e.error || "Could not delete workout",
      color: "negative",
      icon: "las la-exclamation",
    });
  }

  $q.loading.hide();
  reset();
};
</script>

<style lang="scss" scoped></style>
