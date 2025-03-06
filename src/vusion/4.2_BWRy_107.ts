import { getSocketClient } from '@/connection/client';
import { onEvent } from '@/connection/event';
import { ResponseMessageBase } from '@/types/mainIo';
import { formatDateTime } from '@/utils/date';
import { log } from '@/utils/logs';
import { randomUUID, UUID } from 'crypto';

/**
 * Función que envía un mensaje para obtener todos los escenarios cada 3 minutos
 * @param client Cliente socket para emitir mensajes
 * @param socket Socket del usuario para enviar respuestas
 * @param storeId ID de la tienda
 */
export const enviarMensaje107 = () => {
  // Generar un ID único para el mensaje
  let messageKey: string | undefined;
  const client = getSocketClient();

  const timeInit = new Date();
  const timeInitFormatted = formatDateTime(timeInit);
  let timeTotalCurrentChange = 0;
  let count = 0;
  let timeTotal = 0;

  // Función que realiza el envío del mensaje
  const enviarMensaje = () => {
    messageKey = randomUUID();
    count++;
    timeTotalCurrentChange = new Date().getTime();
    const actualTime = new Date();
    const actualTimeFormatted = formatDateTime(actualTime);
    const averageTime =
      timeTotal !== 0 ? (timeTotal / (count - 1) / 1000).toFixed(2) : '0.00';
    client.emit('message', {
      id: messageKey,
      services: ['ses_service'],
      remitter: 'cloud_tag_back',
      message: {
        event: 'SetUpdateArticle',
        data: {
          storeId: 'farmaconnect_es.lab_vcloud',
          body: [
            {
              id: '107',
              name: 'LECITINA DE SOJA ARKOPHARMA 400 MG 100 CAPS',
              price: 11.75,
              inPromotion: false,
              custom: {
                title: timeInitFormatted,
                size: `Cambio: ${count}`,
                location: `Media: ${averageTime}s`,
                content: actualTimeFormatted,
              },
            },
          ],
        },
      },
    });

    onEvent(messageKey, 'ses_service', (dataResponse: ResponseMessageBase) => {
      const message = dataResponse;
      listener(message.taskId as string);
    });

    function listener(params: string): void {
      onEvent(params, 'ses_service', (dataResponse: ResponseMessageBase) => {
        const message = dataResponse;
        message.taskId = messageKey as UUID;
        timeTotalCurrentChange = new Date().getTime() - timeTotalCurrentChange;
        timeTotal = timeTotal + timeTotalCurrentChange;
        log(
          `🟢 Match label - Tiempo: ${timeTotalCurrentChange}ms`,
          'success',
          __filename
        );
      });
    }
  };

  // Enviar el mensaje inmediatamente la primera vez
  enviarMensaje();

  // Configurar el intervalo para enviar el mensaje cada 3 minutos (180000 ms)
  const intervalo = setInterval(enviarMensaje, 180000);

  // Retornar el intervalo para poder detenerlo si es necesario
  return intervalo;
};
