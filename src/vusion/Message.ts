import { getSocketClient } from '@/connection/client';
import { onEvent } from '@/connection/event';
import { ResponseMessageBase } from '@/types/mainIo';
import { formatDateTime } from '@/utils/date';
import { log } from '@/utils/logs';
import { randomUUID, UUID } from 'crypto';
import { Socket } from 'socket.io-client';

class MensajeVusion {
  private service: string;
  private storeId: string;
  private articleId: string;
  private client: Socket;
  private messageKey: string | undefined;
  private timeInit: Date;
  private timeInitFormatted: string;
  private timeTotalCurrentChange: number;
  private count: number;
  private timeTotal: number;
  private intervalo: NodeJS.Timeout;

  constructor(service: string, storeId: string, articleId: string) {
    this.service = service;
    this.storeId = storeId;
    this.articleId = articleId;
    this.client = getSocketClient();
    this.timeInit = new Date();
    this.timeInitFormatted = formatDateTime(this.timeInit);
    this.timeTotalCurrentChange = 0;
    this.count = 0;
    this.timeTotal = 0;
    this.enviarMensaje();
    this.intervalo = setInterval(() => this.enviarMensaje(), 180000);
  }

  private enviarMensaje() {
    this.messageKey = randomUUID();
    this.count++;
    const startTime = Date.now();
    const actualTime = new Date();
    const actualTimeFormatted = formatDateTime(actualTime);
    const averageTime =
      this.timeTotal !== 0
        ? (this.timeTotal / (this.count - 1) / 1000).toFixed(2)
        : '0.00';

    this.client.emit('message', {
      id: this.messageKey,
      services: [this.service],
      remitter: 'cloud_tag_back',
      message: {
        event: 'SetUpdateArticle',
        data: {
          storeId: 'farmaconnect_es.lab_vcloud',
          body: [
            {
              id: this.articleId,
              name: 'LECITINA DE SOJA ARKOPHARMA 400 MG 100 CAPS',
              price: 11.75,
              inPromotion: false,
              custom: {
                title: this.timeInitFormatted,
                size: `Cambio: ${this.count}`,
                location: `Media: ${averageTime}s`,
                content: actualTimeFormatted,
              },
            },
          ],
        },
      },
    });

    onEvent(
      this.messageKey,
      this.service,
      (dataResponse: ResponseMessageBase) => {
        const message = dataResponse;
        listener(message.taskId as string);
      }
    );

    const listener = (params: string): void => {
      onEvent(params, 'ses_service', (dataResponse: ResponseMessageBase) => {
        const message = dataResponse;
        message.taskId = this.messageKey as UUID;
        this.timeTotalCurrentChange = Date.now() - startTime;
        this.timeTotal += this.timeTotalCurrentChange;
        log(
          `🟢 Match label - Tiempo: ${this.timeTotalCurrentChange}ms`,
          'success',
          __filename
        );
      });
    };
  }

  public detenerEnvio() {
    clearInterval(this.intervalo);
  }
}

export { MensajeVusion };
