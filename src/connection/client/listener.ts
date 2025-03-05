import { type Socket } from 'socket.io-client';
import {
  type ResponseMessageBase,
  type SocketMessageBase,
} from '@/types/mainIo';
import { emitEvent } from '@/connection/event';
import {
  type MainIoEvent,
  type MainIoHandlerPayloads,
  MainIOManager,
} from './manager/index';

export const messageEvent = (socket: Socket): void => {
  socket.on('message', async (data: SocketMessageBase) => {
    const response = data.message as ResponseMessageBase;
    const owner = data.remitter;

    if (!response.requestId) return;
    const requestId: string = response.requestId;

    if (response.event.includes('ResGet')) {
      emitEvent(requestId, owner, response, response.success);
      return;
    }
    if (response.event.includes('Set') && response.message != null) {
      if (
        response.message.includes('Task completed') ||
        response.message.includes('Task added to queue')
      ) {
        emitEvent(
          requestId ?? response.taskId,
          owner,
          response,
          response.success
        );
      }
    }
    const event: MainIoEvent<MainIoHandlerPayloads> | undefined =
      MainIOManager.find(
        (event: MainIoEvent<MainIoHandlerPayloads>) =>
          event.type === response.event
      );
    if (event) {
      event.handler(
        response.data.body as MainIoHandlerPayloads,
        response.data.storeId
      );
    }
  });
};
