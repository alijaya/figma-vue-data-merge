import { PluginApiMethods } from "../common/IPluginApi";
import type { IUIApi } from "../common/IUIApi";
import { RequestDetail, ResponseDetail, SceneNode } from "../common/commonType";
import pluginApi from "./pluginApi";
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
  figma.ui.postMessage({
    request,
    id,
    params,
  });
  return addTimeout(result, timeout);
}

const uiApi = new Proxy<IUIApi>({} as any, {
  get(target, prop) {
    return (...args: any[]) => requestRemote(prop as string, args);
  },
});

async function responseRemote(
  requestDetail: RequestDetail<any>,
  result: Promise<any>
) {
  const resolvedResult = await result;
  figma.ui.postMessage({
    response: requestDetail.request,
    id: requestDetail.id,
    result: resolvedResult,
  });
}

function init() {
  figma.ui.on(
    "message",
    (message: RequestDetail<any> | ResponseDetail<any>) => {
      if (message) {
        if ("request" in message) {
          // Handle Request
          if (message.request in pluginApi) {
            responseRemote(
              message,
              (pluginApi[message.request as PluginApiMethods] as any).apply(
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
    }
  );
}

export default {
  init,
  pluginApi,
  uiApi,
};
