import { getSocketClient } from '@/connection/client';
import { onEvent } from '@/connection/event';
import { ResponseMessageBase } from '@/types/mainIo';
import { log } from '@/utils/logs';
import { randomUUID, UUID } from 'crypto';

/**
 * Función que envía un mensaje para obtener todos los escenarios cada 3 minutos
 * @param client Cliente socket para emitir mensajes
 * @param socket Socket del usuario para enviar respuestas
 * @param storeId ID de la tienda
 */
export const enviarMensajePeriodico = () => {
  // Generar un ID único para el mensaje
  const messageKey = randomUUID();
  const client = getSocketClient();

  // Función que realiza el envío del mensaje
  const enviarMensaje = () => {
    client.emit('message', {
      id: messageKey,
      services: ['ses_service'],
      remitter: 'cloud_tag_back',
      message: {
        event: 'SetFlash',
        data: {
          storeId: 'farmaconnect_es.lab_vcloud',
          body: [
            {
              labelId: 'B4174B01',
              color: 'GREEN',
              duration: 20,
              pattern: 'FLASH_4_TIMES',
            },
          ],
        },
      },
    });
  };

  onEvent(messageKey, 'ses_service', (dataResponse: ResponseMessageBase) => {
    const message = dataResponse;
    listener(message.taskId as string);
  });

  function listener(params: string): void {
    onEvent(params, 'ses_service', (dataResponse: ResponseMessageBase) => {
      const message = dataResponse;
      message.taskId = messageKey as UUID;
      log('🟢 Match label', 'success', __filename);
    });
  }

  // Enviar el mensaje inmediatamente la primera vez
  enviarMensaje();

  // Configurar el intervalo para enviar el mensaje cada 3 minutos (180000 ms)
  const intervalo = setInterval(enviarMensaje, 180000);

  // Retornar el intervalo para poder detenerlo si es necesario
  return intervalo;
};
