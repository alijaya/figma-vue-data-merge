import type { IPluginApi } from "../common/IPluginApi";
import type { UIApiMethods } from "../common/IUIApi";
import type {
  RequestDetail,
  ResponseDetail,
  SceneNode,
} from "../common/commonType";
import uiApi from "./uiApi";
import { addTimeout } from "../common/util";

const listeners: (RequestDetail<any> & { resolve: Function })[] = [];
let callId = 0;
const timeout = 1000;

async function requestRemote<T>(request: string, params: any[]): Promise<T> {
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
    return (...args: any[]) => requestRemote(prop as string, args);
  },
});

async function responseRemote(
  requestDetail: RequestDetail<any>,
  result: Promise<any>
) {
  const resolvedResult = await result;
  window.parent.postMessage(
    {
      pluginMessage: {
        response: requestDetail.request,
        id: requestDetail.id,
        result: resolvedResult,
      },
    },
    "*"
  );
}

function init() {
  window.addEventListener("message", (event) => {
    const message = event.data.pluginMessage as
      | RequestDetail<any>
      | ResponseDetail<any>;
    if (message) {
      if ("request" in message) {
        // Handle Request
        if (message.request in uiApi) {
          responseRemote(
            message,
            (uiApi[message.request as UIApiMethods] as any).apply(
              undefined,
              message.params
            )
          );
        }
      } else if ("response" in message) {
        // Handle Response
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
    }
  });
}

export default {
  init,
  pluginApi,
  uiApi,
};
