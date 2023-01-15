<script setup>
import { ref, onBeforeUnmount } from "vue";

const props = defineProps(["title", "value"]);

const text = ref(props.title.split(" ")[0]);

const timer = ref(null);

const onCopy = () => {
  navigator.clipboard.writeText(props.value);
  text.value = "Copied!";
  timer.value = setTimeout(() => {
    text.value = props.title.split(" ")[0];
  }, 1000);
};

onBeforeUnmount(() => {
  navigator.clipboard.writeText("");
  clearTimeout(timer.value);
});
</script>

<template>
  <button type="button" class="copy-button" @click="onCopy" :title="title">
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 20 20"
      height="1.25rem"
      width="1.25rem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
      <path
        fill-rule="evenodd"
        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
        clip-rule="evenodd"
      ></path>
    </svg>
    {{ text }}
  </button>
</template>

<style>
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.5rem;
  margin: 0;
  cursor: pointer;
  outline: none;
  color: #9ca3afcc;
  transition: color 0.2s ease;
}
.copy-button:hover {
  color: #fff;
}
.copy-button svg {
  margin-right: 0.25rem;
}
</style>
