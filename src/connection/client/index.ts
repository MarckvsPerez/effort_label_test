import io, { type Socket } from 'socket.io-client';
import { messageEvent } from './listener';
import { log } from '@/utils/logs';
import { EnvironmentConfig } from '@/class/EnviromentConfig';

const config = new EnvironmentConfig();

let client: Socket;

export const initializeSocketClient = (): Socket => {
  if (client !== undefined) {
    return client;
  }

  client = io(config.socketServerUrl, {
    reconnection: false,
  });

  client.on('connect', () => {
    log('🟢 Connected to socket client', 'success', __filename);
    client.emit('order:join_room', { roomId: 'cloud_tag_back' });
  });

  messageEvent(client);

  client.on('disconnect', () => {
    const reconnectionInterval = setInterval(() => {
      if (client.connected === undefined) {
        log('🔄 Reconnecting to socket client', 'info', __filename);
        client.connect();
      }
    }, 5000);
    if (client.connected !== undefined) {
      log('✅ Reconnected to socket client', 'info', __filename);
      clearInterval(reconnectionInterval);
    }
  });

  if (client.connected === undefined) {
    const reconnectionInterval = setInterval(() => {
      if (client.connected === undefined) {
        log('🔄 Reconnecting to socket client', 'info', __filename);
        client.connect();
      }
    }, 5000);
    if (client.connected !== undefined) {
      log('✅ Reconnected to socket client', 'info', __filename);
      clearInterval(reconnectionInterval);
    }
  }

  return client;
};

export const getSocketClient = (): Socket => {
  if (client === undefined) {
    log(
      '❌ SocketClient has not been initialized. Call initializeSocketClient() first.',
      'error',
      __filename
    );
    throw new Error(
      'SocketClient has not been initialized. Call initializeSocketClient() first.'
    );
  }
  return client;
};
