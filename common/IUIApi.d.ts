import type { SceneNode } from "./commonType";

export interface IUIApi {
  echo(text: string): Promise<void>;
  selectionChangeHandler(nodes: SceneNode[]): Promise<void>;
}

export type UIApiMethods = keyof IUIApi;
