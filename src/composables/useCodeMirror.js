import { watch } from "vue";
import CodeMirror from "codemirror";
import "codemirror/mode/css/css";
import "codemirror/lib/codemirror.css";

export function useCodeMirror(textarea, input, options = {}) {
  const cm = CodeMirror.fromTextArea(textarea.value, {
    theme: "vars",
    ...options,
  });

  let skip = false;

  cm.on("change", () => {
    if (skip) {
      skip = false;
      return;
    }
    console.log("change", cm.getValue());
    input.value = cm.getValue();
  });

  watch(
    input,
    (v) => {
      if (v !== cm.getValue()) {
        skip = true;
        const selections = cm.listSelections();
        cm.replaceRange(v, cm.posFromIndex(0), cm.posFromIndex(Infinity));
        cm.setSelections(selections);
      }
    },
    { immediate: true }
  );

  return cm;
}
