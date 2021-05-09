<template>
  <q-field :label="label" borderless stack-label label-color="primary">
    <template v-slot:label>
      <div class="label">
        {{ label }}
      </div>
    </template>
    <template v-slot:control>
      <div class="q-mt-sm">
        {{ value }}
      </div>
    </template>
  </q-field>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DetailsFields',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.label {
  text-decoration: underline;
}
</style>
