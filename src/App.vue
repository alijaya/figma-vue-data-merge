<script setup lang="ts">
import api from "./api";
import { echoOutput, selections } from "./store";

api.init();
let count = ref(0);
let counter = ref(0);

let corner = ref<HTMLElement | null>(null);

function resizeWindow(e: MouseEvent) {
  const width = Math.max(50, Math.floor(e.clientX + 5));
  const height = Math.max(50, Math.floor(e.clientY + 5));
  api.pluginApi.resizeWindow(width, height);
}

onMounted(() => {
  let cornerEl = corner.value;

  if (cornerEl) {
    cornerEl.onpointerdown = (e) => {
      if (cornerEl) {
        cornerEl.onpointermove = resizeWindow;
        cornerEl.setPointerCapture(e.pointerId);
      }
    };
    cornerEl.onpointerup = (e) => {
      if (cornerEl) {
        cornerEl.onpointermove = null;
        cornerEl.releasePointerCapture(e.pointerId);
      }
    };
  }
});

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
      <input v-model="count" class="border" />
      <div class="mt-4 flex space-x-4">
        <MyButton primary @click="createBox">Create Box</MyButton>
        <MyButton primary @click="createCircle">Create Circle</MyButton>
        <MyButton secondary @click="cancel">Cancel</MyButton>
      </div>
      <ul>
        <li v-for="node in selections">
          {{ node.id }}: {{ node.name }} ({{ node.type }})
        </li>
      </ul>
      <MyTweakpane />
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
