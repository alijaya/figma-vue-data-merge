import { IPluginApi } from "../common/IPluginApi";
import { RequestDetail, ResponseDetail, SceneNode } from "../common/commonType";

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
    figma.viewport.scrollAndZoomIntoView([rect]);
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
    figma.viewport.scrollAndZoomIntoView([circle]);
  },
  async close(): Promise<void> {
    setTimeout(() => figma.closePlugin(), 0);
  },
  async resizeWindow(width: number, height: number): Promise<void> {
    figma.ui.resize(width, height);
    figma.clientStorage
      .setAsync("windowSize", { width, height })
      .catch((err) => {});
  },
};

export default pluginApi;
