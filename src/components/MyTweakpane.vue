<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { Pane, type InputParams } from "tweakpane";

// const props = defineProps({
//   primary: Boolean,
//   secondary: Boolean,
//   tertiary: Boolean,
//   destructive: Boolean,
// });

type WithValue<T> = { value: T };
type ConfigValue<T> = T | (WithValue<T> & InputParams);
type ExtractType<T extends ConfigValue<any>> = T extends WithValue<infer X>
  ? X
  : T;

type Config = {
  [key: string]: ConfigValue<any>;
};

const OptSymbol = Symbol("Options");

type ConfigOpt<FromConfig extends Config> = {
  [key in keyof FromConfig]?: InputParams;
};

type ConfigConvert<FromConfig extends Config> = {
  [key in keyof FromConfig]: FromConfig[key] extends WithValue<infer X>
    ? X
    : FromConfig[key];
} & { [OptSymbol]: ConfigOpt<FromConfig> };

function isWithValue<T>(
  value: ConfigValue<T>
): value is WithValue<T> & InputParams {
  return value instanceof Object && "value" in value;
}

function convert<T>(o: ConfigValue<T>): T {
  if (isWithValue(o)) {
    return o.value;
  } else {
    return o;
  }
}

function convertAll<T extends Config>(c: T): ConfigConvert<T> {
  const result = reactive<any>({ [OptSymbol]: {} });
  for (const key of Object.keys(c)) {
    if (isWithValue(c[key])) {
      result[key] = c[key].value;
      const opts: any = {};
      for (const optKey of Object.keys(c[key])) {
        if (optKey !== "value") {
          opts[optKey] = c[key][optKey];
        }
      }
      result[OptSymbol][key] = opts;
    } else {
      result[key] = c[key];
    }
  }
  return result;
}

const params = convertAll({
  factor: 123, // {value: 123}
  percentage: { value: 50, min: 0, max: 100, step: 10 },
  title: "hello",
  color: "#ff0055",
  increment: {
    title: "Increase",
    value: function () {
      params.factor += 1;
    },
  },
  // TODO: ngerjain typingnya masih blom bener
  choose: { value: 50, options: { low: 50, medium: 100, high: 200 } },
});
const opts = params[OptSymbol];

console.log(params[OptSymbol]);

// const params = reactive({
//   factor: ref(123),
//   title: "hello",
//   color: "#ff0055",
// });
const container = ref<HTMLElement | undefined>();

onMounted(() => {
  const pane = new Pane({
    container: container.value,
  });
  for (const key of Object.keys(params) as (keyof typeof params & string)[]) {
    const value = params[key];
    if (value instanceof Function) {
      const button = pane.addButton({
        title: key,
        ...opts[key],
      });
      button.on("click", value);
    } else {
      const input = pane.addInput(params, key, opts[key]);
      watch(
        () => params[key],
        () => {
          input.refresh();
        }
      );
    }
  }
});
</script>
