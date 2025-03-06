import io, { type Socket } from 'socket.io-client';
import { messageEvent } from './listener';
import { log } from '@/utils/logs';
import { EnvironmentConfig } from '@/class/EnviromentConfig';
import { enviarMensaje101 } from '@/vusion/1.5_BWRY_101';
import { enviarMensaje102 } from '@/vusion/1.5_BWRY_102';
import { enviarMensaje103 } from '@/vusion/1.5_BWRY_103';
import { enviarMensaje104 } from '@/vusion/2.6_BWR_104';
import { enviarMensaje105 } from '@/vusion/2.6_BWR_105';
import { enviarMensaje106 } from '@/vusion/2.6_BWR_106';
import { enviarMensaje107 } from '@/vusion/4.2_BWRy_107';
import { enviarMensaje108 } from '@/vusion/4.2_BWRy_108';
import { enviarMensaje109 } from '@/vusion/4.2_BWRy_109';

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
    enviarMensaje101();
    enviarMensaje102();
    enviarMensaje103();
    enviarMensaje104();
    enviarMensaje105();
    enviarMensaje106();
    enviarMensaje107();
    enviarMensaje108();
    enviarMensaje109();
  });

  messageEvent(client);

  client.on('disconnect', () => {
    const reconnectionInterval = setInterval(() => {
      if (client.connected === undefined) {
        log('🔄 Reconnecting to socket client', 'info', __filename);
        client.connect();
        enviarMensaje101();
        enviarMensaje102();
        enviarMensaje103();
        enviarMensaje104();
        enviarMensaje105();
        enviarMensaje106();
        enviarMensaje107();
        enviarMensaje108();
        enviarMensaje109();
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
