import { IPluginApi, PluginApiMethods } from "../common/iPluginApi";
import { RequestDetail, ResponseDetail, SceneNode } from "../common/util";

const pluginApi: IPluginApi = {
  async createRectangle(
    x: number,
    y: number,
    w: number,
    h: number
  ): Promise<SceneNode> {
    var rect = figma.createRectangle();
    rect.resize(w, h);
    rect.x = x;
    rect.y = y;
    return {
      type: rect.type,
      id: rect.id,
      name: rect.name,
    };
  },
  async createCircle(x: number, y: number, r: number): Promise<SceneNode> {
    var circle = figma.createEllipse();
    circle.resize(2 * r, 2 * r);
    circle.x = x;
    circle.y = y;
    return {
      type: circle.type,
      id: circle.id,
      name: circle.name,
    };
  },
  async close(): Promise<void> {
    setTimeout(() => figma.closePlugin(), 0);
  },
};

async function responseRemote(requestDetail: any, result: Promise<any>) {
  const resolvedResult = await result;
  figma.ui.postMessage({
    response: requestDetail.request,
    id: requestDetail.id,
    result: resolvedResult,
  });
}

export default pluginApi;
export function init() {
  figma.ui.on("message", (requestDetail: RequestDetail<any>) => {
    if (requestDetail.request in pluginApi) {
      responseRemote(
        requestDetail,
        (pluginApi[requestDetail.request as PluginApiMethods] as any).apply(
          undefined,
          requestDetail.params
        )
      );
    }
  });
}
