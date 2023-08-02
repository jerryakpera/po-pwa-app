<template>
  <div>
    <div class="flex items-center q-gutter-md">
      <q-img
        :src="exercise?.demonstration"
        style="width: 80px; height: 80px; border-radius: 10px"
      />

      <div>
        <div class="text-h6 font1 text-weight-medium">
          {{ _.capitalize(exercise?.name) }}
        </div>
        <div class="text-light text-body2 flex q-col-gutter-sm">
          <div>
            {{ _.capitalize(exercise?.target) }}
          </div>
          <div>|</div>
          <div>
            {{ _.capitalize(exercise?.bodyPart) }}
          </div>
          <div>|</div>
          <div>
            {{ _.capitalize(exercise?.equipment) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";

import { loadExercise } from "src/utils";
import { useAuthStore } from "stores/auth-store";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps(["exerciseId"]);

const exercise = ref(null);

const fetchWorkout = async (id) => {
  $q.loading.show();

  try {
    exercise.value = await loadExercise(id);
  } catch (e) {
    console.log(e);
  }

  $q.loading.hide();
};

onMounted(async () => {
  await fetchWorkout(props.exerciseId);
});
</script>

<style lang="scss" scoped></style>
