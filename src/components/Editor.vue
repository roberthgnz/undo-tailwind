<script setup>
import { ref, onMounted, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { createGenerator } from "unocss";
import { Pane, Splitpanes } from "splitpanes";
import presetUno from "@unocss/preset-uno";
import { parse } from "../utils/css.js";

import { useCSSPrettify } from "../composables/useCSSPrettify";

import CodeMirror from "./CodeMirror.vue";

const loading = ref(true);
const panel = ref(null);

const panelSizes = useStorage(
  "nested-css-to-flat-panel-sizes",
  [33.33, 33.33, 33.33],
  localStorage,
  {
    listenToStorageChanges: false,
  }
);

const input = ref("");
const output = ref("");
const formatted = ref("");

const nomalizeOutput = (value) => {
  // remove /* layer: default */
  return value.replace(/\/\* layer: default \*\//g, "");
};

const getCSSValue = (cssText) => {
  const parsed = parse(cssText);
  return parsed.stylesheet.rules?.reduce((acc, curr) => {
    if (curr.type === "media") {
      return (
        acc +
        `@media ${curr.media} { ${curr.rules.reduce((acc, curr) => {
          return (
            acc +
              curr.declarations?.reduce((acc, { property, value }) => {
                return acc + `${property}: ${value};` || "";
              }, "") || ""
          );
        }, "")} }`
      );
    }
    return (
      acc +
        curr.declarations?.reduce((acc, { property, value }) => {
          return acc + `${property}: ${value};`;
        }, "") || ""
    );
  }, "");
};

const handleResize = (event) => {
  panelSizes.value = event.map(({ size }) => size);
};

watch(input, async (value) => {
  const uno = createGenerator({
    presets: [presetUno({ variablePrefix: "tw-" })],
  });
  const { css } = await uno.generate(value, { preflights: false });
  const nomalized = nomalizeOutput(css);
  const prettyClasses = useCSSPrettify(nomalized);
  const prettyValues = useCSSPrettify(getCSSValue(nomalized));

  output.value = prettyClasses.value;
  formatted.value = prettyValues.value;
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 200);
});
</script>

<template>
  <Splitpanes ref="panel" :class="{ loading }" @resize="handleResize">
    <Pane :min="0" :max="100" :size="panelSizes[0]">
      <h2 class="title">Tailwind</h2>
      <CodeMirror v-model="input" mode="css" class="scrolls" />
    </Pane>
    <Pane :min="0" :max="100" :size="panelSizes[1]">
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          color: '#9ca3afcc',
          backgroundColor: '#222',
        }"
      >
        <h2 class="title">Class</h2>
      </div>
      <CodeMirror
        v-model="output"
        mode="css"
        class="scrolls"
        :read-only="true"
      />
    </Pane>
    <Pane :min="0" :max="100" :size="panelSizes[1]">
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          color: '#9ca3afcc',
          backgroundColor: '#222',
        }"
      >
        <h2 class="title">Output</h2>
      </div>
      <CodeMirror
        v-model="formatted"
        mode="css"
        class="scrolls"
        :read-only="true"
      />
    </Pane>
  </Splitpanes>
</template>

<style>
.splitpanes {
  display: flex;
  height: 100%;
}
.splitpanes.loading .splitpanes__pane {
  transition: none !important;
}
.splitpanes__pane {
  height: 100%;
}
.splitpanes .title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  padding: 0.5rem;
  color: #9ca3afcc;
  background: #222;
  border-bottom: 1px solid #00000020;
  user-select: none;
}
.splitpanes__splitter {
  width: 5px;
  background: #444;
}
.scrolls {
  height: 100%;
  overflow: auto;
}
</style>
