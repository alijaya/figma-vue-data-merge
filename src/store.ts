import type { SceneNode } from "common/commonType";
import { ref } from "vue";

export const echoOutput = ref<string | null>(null);

export const selections = ref<SceneNode[]>([]);
