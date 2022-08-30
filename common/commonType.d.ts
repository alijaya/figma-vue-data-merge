export interface RequestDetail<T> {
  request: string;
  id: number;
  params: T;
}

export interface ResponseDetail<T> {
  response: string;
  id: number;
  result: T;
}

export interface SceneNode {
  type: string;
  id: string;
  name: string;
}
