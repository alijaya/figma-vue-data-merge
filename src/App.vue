<script setup lang="ts">
import Pages from "./pages/index.vue";
import MyButton from "./components/MyButton.vue";
import api from "./api";
import { echoOutput } from "./store";

api.init();
let count = ref(0);
let counter = ref(0);

let nodes = ref<{ id: string; type: string; name: string }[]>([]);

let corner = ref<HTMLElement | null>(null);

// window.onmessage = (event) => {
//   const message = event.data.pluginMessage;
//   if (message) {
//     if (message.type === "selectionchange") {
//       nodes.value = message.selection;
//     }
//   }
// };

function resizeWindow(e: MouseEvent) {
  const size = {
    w: Math.max(50, Math.floor(e.clientX + 5)),
    h: Math.max(50, Math.floor(e.clientY + 5)),
  };
  // parent.postMessage({ pluginMessage: { type: "resize", size: size } }, "*");
}

// onMounted(() => {
//   let cornerEl = corner.value;

//   if (cornerEl) {
//     cornerEl.onpointerdown = (e) => {
//       if (cornerEl) {
//         cornerEl.onpointermove = resizeWindow;
//         cornerEl.setPointerCapture(e.pointerId);
//       }
//     };
//     cornerEl.onpointerup = (e) => {
//       if (cornerEl) {
//         cornerEl.onpointermove = null;
//         cornerEl.releasePointerCapture(e.pointerId);
//       }
//     };
//   }
// });

setInterval(() => {
  counter.value++;
}, 1000);

function createBox() {
  api.pluginApi.createRectangle(0, 0, 100, 100);
}

function createCircle() {
  api.pluginApi.createCircle(0, 0, 50);
}

function cancel() {
  api.pluginApi.close();
}
</script>

<template>
  <div>
    <main class="m-4">
      <ul>
        <li v-for="node in nodes">
          {{ node.id }}: {{ node.name }} ({{ node.type }})
        </li>
      </ul>
      <input v-model="count" class="border" />
      <div class="mt-4 flex space-x-4">
        <MyButton primary @click="createBox">Create Box</MyButton>
        <MyButton primary @click="createCircle">Create Circle</MyButton>
        <MyButton secondary @click="cancel">Cancel</MyButton>
      </div>

      <div>{{ echoOutput }}</div>
    </main>

    <svg
      ref="corner"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute bottom-0 right-0 cursor-nwse-resize"
    >
      <path d="M16 0V16H0L16 0Z" fill="white" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path
        d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z"
        fill="#8C8C8C"
      />
    </svg>
  </div>
</template>
