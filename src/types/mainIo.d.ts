import { UUID } from 'crypto';

export type EventType = `${'Get' | 'Set' | 'Res'}${string}`;
export type StageTypes =
  | 'CREATION'
  | 'UPDATE'
  | 'DELETION'
  | 'REFRESH'
  | 'GET_ALL'
  | 'GET_BY_ID'
  | 'GET_TYPES'
  | 'GET_BY_LABEL'
  | 'GET';
export type DataTypes =
  | 'ARTICLE'
  | 'FLASH'
  | 'LABEL'
  | 'MATCHING'
  | 'HOOK'
  | 'EVENT'
  | 'SCENARIO'
  | 'PREVIEW';
export type StageNames = `${DataTypes}_${StageTypes}`;

export interface SocketMessageBase {
  id: UUID;
  services: string[];
  remitter: string;
  message: RequestMessageBase | ResponseMessageBase;
}

export interface SocketMessage<T extends object> extends SocketMessageBase {
  id: UUID;
  services: string[];
  remitter: string;
  message: RequestMessage<T> | ResponseMessage<T>;
}

export interface RequestMessageBase {
  event: EventType;
  data: RequestDataBase;
}

export interface RequestDataBase {
  storeId: string;
}

export interface RequestMessage<T> extends RequestMessageBase {
  event: EventType;
  data: RequestData<T>;
}

export interface RequestData<T> extends RequestDataBase {
  storeId: string;
  body: T;
}

export interface ResponseMessageBase {
  taskId: UUID;
  requestId?: UUID;
  event: EventType;
  success: boolean;
  message: string;
  data: ResponseDataBase;
  error?: unknown;
}

export interface ResponseMessage<T extends object> extends ResponseMessageBase {
  taskId: UUID;
  requestId?: UUID;
  event: EventType;
  success: boolean;
  message: string;
  data: ResponseData<T>;
  error?: unknown;
}

export interface ResponseDataBase {
  storeId: string;
  body: object;
  stageIds: object;
}

export interface ResponseData<T extends object> extends ResponseDataBase {
  storeId: string;
  body: T;
  stageIds: object;
}

export interface IncomingMatch {
  labelIds: string[];
  scenarioId: string;
  registrationCode: null;
  articleId: string[];
}
