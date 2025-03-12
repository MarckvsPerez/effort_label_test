import io, { type Socket } from 'socket.io-client';
import { messageEvent } from './listener';
import { log } from '@/utils/logs';
import { EnvironmentConfig } from '@/class/EnviromentConfig';
import { MensajeVusion } from '@/vusion/Message';
import { MensajeBowtz } from '@/bowtz/Message';
import { createClient } from 'redis';

const config = new EnvironmentConfig();

let client: Socket;

// Crea y configura el cliente de Redis
const redisClient = createClient({
  url: 'redis://localhost:6379', // Cambia la URL si tu servidor Redis está en otro host o puerto
});

// Maneja eventos de conexión y errores
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Conéctate al servidor Redis
redisClient
  .connect()
  .then(() => {
    log('Conectado a Redis', 'success', __filename);
  })
  .catch(console.error);

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
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '101');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '102');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '103');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '104');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '105');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '106');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '107');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '108');
    new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '109');

    new MensajeBowtz('bowtz_service', '403', '0010000289', '101');
    new MensajeBowtz('bowtz_service', '403', '0010551699', '102');
    new MensajeBowtz('bowtz_service', '403', '0010000250', '103');
    new MensajeBowtz('bowtz_service', '403', '0010004273', '104');
    new MensajeBowtz('bowtz_service', '403', '0010525162', '105');
    new MensajeBowtz('bowtz_service', '403', '0010525165', '106');
    new MensajeBowtz('bowtz_service', '403', '0010505292', '107');
    new MensajeBowtz('bowtz_service', '403', '0010530825', '108');
  });

  messageEvent(client);

  client.on('disconnect', () => {
    const reconnectionInterval = setInterval(() => {
      if (client.connected === undefined) {
        log('🔄 Reconnecting to socket client', 'info', __filename);
        client.connect();
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '101');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '102');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '103');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '104');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '105');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '106');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '107');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '108');
        new MensajeVusion('ses_service', 'farmaconnect_es.lab_vcloud', '109');

        new MensajeBowtz('bowtz_service', '403', '0010000289', '101');
        new MensajeBowtz('bowtz_service', '403', '0010551699', '102');
        new MensajeBowtz('bowtz_service', '403', '0010000250', '103');
        new MensajeBowtz('bowtz_service', '403', '0010004273', '104');
        new MensajeBowtz('bowtz_service', '403', '0010525162', '105');
        new MensajeBowtz('bowtz_service', '403', '0010525165', '106');
        new MensajeBowtz('bowtz_service', '403', '0010505292', '107');
        new MensajeBowtz('bowtz_service', '403', '0010530825', '108');
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

// Exporta el cliente para usarlo en otros módulos
export { redisClient };
