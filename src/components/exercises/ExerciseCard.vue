<template>
  <q-card class="q-mb-sm" flat>
    <div class="row">
      <div class="col-3" v-if="!inDevelopment">
        <q-img :src="exercise.demonstration" style="height: 100%" />
      </div>

      <div
        :class="inDevelopment ? 'col-12' : 'col-9'"
        class="items-center q-pa-xs q-mt-none q-pt-none row"
      >
        <div class="col-10 q-px-sm">
          <div
            class="text-accent text-weight-medium text-body2"
            :class="exercise.workouts.length ? 'cursor-pointer' : ''"
            @click="openWorkouts(exercise._id)"
          >
            {{ _.capitalize(exercise.name) }}
          </div>
          <div class="text-light text-caption">
            {{ _.capitalize(exercise.target) }} |
            {{ _.capitalize(exercise.bodyPart) }}
          </div>
        </div>
        <div class="col-2">
          <q-btn
            no-caps
            color="positive"
            class="full-width"
            icon="las la-dumbbell"
            :to="`/workouts/${exercise._id}/new`"
          />
        </div>
      </div>
    </div>

    <slot name="stats" />
  </q-card>
</template>

<script setup>
import _ from "lodash";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["exercise"]);

const inDevelopment = process.env.DEV;

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

<!-- [ "_id", "name", "id", "gifUrl", "target", "bodyPart", "equipment", "createdAt", "updatedAt", "demonstration", "workouts" ] -->
