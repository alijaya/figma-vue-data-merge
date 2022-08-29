import type { IPluginApi, PluginApiMethods } from "../common/iPluginApi";
import type { RequestDetail, ResponseDetail, SceneNode } from "../common/util";

const listeners: (RequestDetail<any> & { resolve: Function })[] = [];
let callId = 0;
const timeout = 1000;
const TimeoutError = Symbol("Timeout Error");

function addTimeout<T>(prom: Promise<T>, time: number): Promise<T> {
  let timer: number;
  return Promise.race([
    prom,
    new Promise<T>((_r, rej) => (timer = setTimeout(rej, time, TimeoutError))),
  ]).finally(() => clearTimeout(timer));
}

async function callRemote<T>(request: string, params: any[]): Promise<T> {
  const id = callId++;
  const result = new Promise<T>((resolve, reject) => {
    listeners.push({
      request,
      id,
      params,
      resolve,
    });
  });
  window.parent.postMessage(
    {
      pluginMessage: {
        request,
        id,
        params,
      },
    },
    "*"
  );
  return addTimeout(result, timeout);
}

const pluginApi = new Proxy<IPluginApi>({} as any, {
  get(target, prop) {
    return (...args: any[]) => callRemote(prop as string, args);
  },
});

export default pluginApi;
export function init() {
  window.addEventListener("message", (event) => {
    const message = event.data.pluginMessage as ResponseDetail<any>;
    if (message) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        const listener = listeners[i];
        if (
          message.response === listener.request &&
          message.id == listener.id
        ) {
          listeners.splice(i, 1);
          listener.resolve(message.result);
        }
      }
    }
  });
}
