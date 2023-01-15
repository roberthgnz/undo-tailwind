<script setup>
import { ref, onMounted } from "vue";
import { useVModel } from "@vueuse/core";
import { useCodeMirror } from "../composables/useCodeMirror";
import "codemirror/theme/material.css";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  mode: {
    type: String,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const el = ref(null);
const input = useVModel(props, "modelValue", emit, { passive: true });

onMounted(async () => {
  const cm = useCodeMirror(el, input, {
    ...props,
    theme: "material",
  });
  cm.setSize("100%", "100%");
  setTimeout(() => cm.refresh(), 100);
});
</script>

<template>
  <div>
    <textarea ref="el" />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");
.CodeMirror * {
  font-family: "Inconsolata", monospace;
  font-size: 14px;
}
</style>
