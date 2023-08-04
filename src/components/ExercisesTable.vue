<template>
  <q-table
    grid
    flat
    square
    hide-header
    :rows="rows"
    row-key="_id"
    :filter="filter"
    :columns="columns"
    :loading="loading"
    selection="multiple"
    :filter-method="filterFn"
    :rows-per-page-options="[10]"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:top>
      <q-card flat bordered class="full-width">
        <q-expansion-item
          dense
          expand-separator
          class="full-width"
          label="Filter exercises"
        >
          <q-card-section class="q-pa-xs column q-col-gutter-xs">
            <q-select
              dense
              multiple
              outlined
              use-chips
              color="white"
              label="Body part"
              class="full-width"
              :options="bodyParts"
              v-model="bodyPartsFilter"
            >
              <template #prepend>
                <POIcon icon="ic:baseline-filter-alt" />
              </template>
            </q-select>

            <q-select
              dense
              multiple
              outlined
              use-chips
              color="white"
              label="Equipment"
              class="full-width"
              :options="equipments"
              v-model="equipmentsFilter"
            >
              <template #prepend>
                <POIcon icon="ic:baseline-filter-alt" />
              </template>
            </q-select>

            <q-input
              dense
              outlined
              clearable
              debounce="800"
              v-model="filter"
              class="full-width"
              placeholder="Search exercises"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>
        </q-expansion-item>
      </q-card>
    </template>

    <template v-slot:item="props">
      <div class="col-12 q-mb-xs grid-style-transition">
        <ExerciseCard :exercise="props.row" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import _ from "lodash";
import { computed, ref } from "vue";
import { ExerciseCard } from "./exercises";

const props = defineProps(["exercises"]);

const filter = ref("");
const loading = ref(false);
const bodyPartsFilter = ref([]);
const equipmentsFilter = ref([]);

const filterFn = (rows, terms) => {
  const pins = terms?.toLowerCase().trim().split(" ");
  const trimmedPins = pins.map((pin) => pin.trim());

  return rows.filter((exercise) => {
    const { name } = exercise;

    let matches = 0;
    for (let i = 0; i < trimmedPins.length; i++) {
      const pin = trimmedPins[i];

      if (name.toLowerCase().includes(pin)) {
        matches += 1;
        continue;
      }
    }

    if (matches > trimmedPins.length - 1) return exercise;
  });
};

const rows = computed(() => {
  if (
    bodyPartsFilter.value.length === 0 &&
    equipmentsFilter.value.length === 0
  ) {
    return [...props.exercises];
  }

  const filteredExercises = [...props.exercises].filter((exercise) => {
    const { target, equipment } = exercise;
    const bodyPartsArray = [...bodyPartsFilter.value].map((bodyPart) =>
      bodyPart.toLowerCase()
    );
    const equipmentsArray = [...equipmentsFilter.value].map((equipment) =>
      equipment.toLowerCase()
    );

    if (
      bodyPartsArray.includes(target) ||
      equipmentsArray.includes(equipment)
    ) {
      return exercise;
    }
  });

  return filteredExercises;
});

const columns = [
  { name: "name", field: "name" },
  { name: "target", field: "target" },
  { name: "bodyPart", field: "bodyPart" },
  { name: "equipment", field: "equipment" },
];

const bodyParts = [
  "abs",
  "quads",
  "lats",
  "calves",
  "pectorals",
  "glutes",
  "hamstrings",
  "adductors",
  "triceps",
  "cardiovascular system",
  "spine",
  "upper back",
  "biceps",
  "delts",
  "forearms",
  "traps",
  "serratus anterior",
  "abductors",
  "levator scapulae",
]
  .sort()
  .map((bodyPart) => _.capitalize(bodyPart));

const equipments = [
  "body weight",
  "cable",
  "leverage machine",
  "assisted",
  "medicine ball",
  "stability ball",
  "band",
  "barbell",
  "rope",
  "dumbbell",
  "ez barbell",
  "sled machine",
  "upper body ergometer",
  "kettlebell",
  "olympic barbell",
  "weighted",
  "bosu ball",
  "resistance band",
  "roller",
  "skierg machine",
  "hammer",
  "smith machine",
  "wheel roller",
  "stationary bike",
  "tire",
  "trap bar",
  "elliptical machine",
  "stepmill machine",
]
  .sort()
  .map((equipment) => _.capitalize(equipment));
</script>

<style lang="scss">
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>
