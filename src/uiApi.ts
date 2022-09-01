import type { IUIApi, UIApiMethods } from "../common/IUIApi";
import type {
  RequestDetail,
  ResponseDetail,
  SceneNode,
} from "../common/commonType";
import { echoOutput, selections } from "./store";

const uiApi: IUIApi = {
  async echo(text: string): Promise<void> {
    echoOutput.value = text;
  },
  async selectionChangeHandler(nodes: SceneNode[]): Promise<void> {
    selections.value = nodes;
  },
};

export default uiApi;
