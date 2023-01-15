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

const getVariables = (cssText, preflight) => {
  const regex = /var\((--tw-[\w-]+)\)/g;
  const matches = cssText.matchAll(regex);
  return [...matches].reduce((acc, curr) => {
    const [_, variable] = curr;
    const regex = new RegExp(
      `${variable.replace("--tw", "--un")}:([^;]+);`,
      "g"
    );
    const match = preflight.match(regex);
    if (match) {
      return acc + match[0].replace("--un", "--tw");
    }
    return acc;
  }, "");
};

const nomalizeOutput = (cssText, preflight) => {
  cssText = cssText.replace(/\/\* layer: preflights \*\//g, "");

  const vairables = getVariables(cssText, preflight);

  cssText = cssText.replace(
    preflight,
    vairables ? `*,::before,::after{${vairables}}` : ""
  );

  const value = cssText.replace(/\/\* layer: default \*\//g, "");

  return value;
};

const getCSSValue = (cssText) => {
  const parsed = parse(cssText);
  const parseDeclaration = (acc, { property, value }) => {
    return acc + `${property}: ${value};`;
  };
  return parsed.stylesheet.rules?.reduce((acc, curr) => {
    if (curr.type === "media") {
      return (
        acc +
        `@media ${curr.media} { ${curr.rules.reduce((acc, curr) => {
          return acc + curr.declarations?.reduce(parseDeclaration, "") || "";
        }, "")} }`
      );
    }
    return acc + curr.declarations?.reduce(parseDeclaration, "") || "";
  }, "");
};

const handleResize = (event) => {
  panelSizes.value = event.map(({ size }) => size);
};

watch(input, async (value) => {
  const preset = presetUno({ variablePrefix: "tw-" });

  const preflight = preset.preflights[0].getCSS(preset);

  const generator = createGenerator({
    presets: [preset],
  });

  const { css } = await generator.generate(value);

  const nomalized = nomalizeOutput(css, preflight);
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
