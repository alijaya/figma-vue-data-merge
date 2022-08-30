import type { IUIApi, UIApiMethods } from "../common/IUIApi";
import type {
  RequestDetail,
  ResponseDetail,
  SceneNode,
} from "../common/commonType";
import { echoOutput } from "./store";

const uiApi: IUIApi = {
  async echo(text: string): Promise<void> {
    echoOutput.value = text;
  },
};

export default uiApi;
