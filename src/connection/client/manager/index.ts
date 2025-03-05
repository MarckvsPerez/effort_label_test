export interface MainIoEvent<T> {
  type: string;
  handler: (payload: T, storeId: string) => void;
}

const handlers = [] as const;
type ExtractPayload<T> = T extends MainIoEvent<infer U> ? U : never;
type HandlerPayloads = ExtractPayload<(typeof handlers)[number]>;

export type MainIoHandlerPayloads = HandlerPayloads;
export const MainIOManager: ReadonlyArray<MainIoEvent<MainIoHandlerPayloads>> =
  handlers;
