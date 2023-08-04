<template>
  <q-table
    grid
    flat
    square
    hide-header
    row-key="_id"
    :filter="filter"
    :rows="exercises"
    :columns="columns"
    :loading="loading"
    selection="multiple"
    :rows-per-page-options="[10]"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:top>
      <q-input
        dense
        outlined
        clearable
        debounce="300"
        v-model="filter"
        class="full-width"
        placeholder="Search exercises by name or body part"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:item="props">
      <div class="col-12 q-mb-xs grid-style-transition">
        <ExerciseCard :exercise="props.row" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from "vue";
import { ExerciseCard } from "./exercises";

const props = defineProps(["exercises"]);

const filter = ref("");
const loading = ref(false);

const columns = [
  { name: "name", field: "name" },
  { name: "target", field: "target" },
  { name: "bodyPart", field: "bodyPart" },
  { name: "equipment", field: "equipment" },
];
</script>

<style lang="scss">
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>
