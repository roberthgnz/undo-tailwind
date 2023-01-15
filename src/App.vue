<script setup>
import { ref, watch } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import { createGenerator } from "unocss";
import presetUno from "@unocss/preset-uno";

import { useCSSPrettify } from "./composables/useCSSPrettify";

import CodeMirror from "./components/CodeMirror.vue";

const text = ref("w-full h-full");
const output = ref("");

const nomalizeOutput = (value) => {
  // remove /* layer: default */
  return value.replace(/\/\* layer: default \*\//g, "");
};

watch(text, async (value) => {
  const uno = createGenerator({
    presets: [presetUno({ variablePrefix: "tw-" })],
  });
  const { css } = await uno.generate(value, { preflights: false });
  const pretty = useCSSPrettify(nomalizeOutput(css));
  output.value = pretty.value;
});
</script>

<template>
  <Splitpanes ref="panel" horizontal>
    <Pane class="pane">
      <textarea v-model="text" />
    </Pane>
    <Pane class="pane">
      <CodeMirror v-model="output" mode="css" />
      {{ output }}
    </Pane>
  </Splitpanes>
</template>

<style scoped>
.pane {
  display: flex;
  flex-direction: column;
  min-height: 65px;
}
</style>
