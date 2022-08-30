import type { SceneNode } from "./commonType";

export interface IPluginApi {
  createRectangle(
    x: number,
    y: number,
    w: number,
    h: number
  ): Promise<SceneNode>;
  createCircle(x: number, y: number, r: number): Promise<SceneNode>;
  close(): Promise<void>;
}

export type PluginApiMethods = keyof IPluginApi;
