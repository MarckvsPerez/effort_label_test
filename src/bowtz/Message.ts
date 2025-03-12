import { getSocketClient } from '@/connection/client';
import { onEvent } from '@/connection/event';
import { formatDateTime } from '@/utils/date';
import { log } from '@/utils/logs';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io-client';
import Redis from 'ioredis';

class MensajeBowtz {
  private service: string;
  private storeId: string;
  private label: string;
  private articleId: string;
  private client: Socket;
  private messageKey: string | undefined;
  private timeInit: Date;
  private timeInitFormatted: string;
  private timeTotalCurrentChange: number;
  private count: number;
  private timeTotal: number;
  private intervalo: NodeJS.Timeout;
  private redis: Redis;

  constructor(
    service: string,
    storeId: string,
    label: string,
    articleId: string
  ) {
    this.service = service;
    this.storeId = storeId;
    this.label = label;
    this.articleId = articleId;
    this.client = getSocketClient();
    this.timeInit = new Date();
    this.timeInitFormatted = formatDateTime(this.timeInit);
    this.timeTotalCurrentChange = 0;
    this.count = 0;
    this.timeTotal = 0;
    this.redis = new Redis();
    this.enviarMensaje();
    this.intervalo = setInterval(() => this.enviarMensaje(), 180000);
  }

  private async enviarMensaje() {
    this.messageKey = randomUUID();
    this.count++;
    const startTime = Date.now();
    const actualTime = new Date();
    const actualTimeFormatted = formatDateTime(actualTime);
    const averageTime =
      this.timeTotal !== 0
        ? (this.timeTotal / (this.count - 1) / 1000).toFixed(2)
        : '0.00';

    await this.redis.set(`article:${this.articleId}:averageTime`, averageTime);

    this.client.emit('message', {
      id: this.messageKey,
      services: [this.service],
      remitter: 'cloud_tag_back',
      message: {
        event: 'SetMatchLabel',
        data: {
          storeId: this.storeId,
          body: {
            match: [
              {
                labelIds: [this.label],
                scenarioId: 'LISTADO',
                registration_code: null,
                articleId: [this.articleId],
              },
            ],
            articles: [
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
      },
    });

    onEvent(this.messageKey, this.service, async () => {
      this.timeTotalCurrentChange = Date.now() - startTime;
      this.timeTotal += this.timeTotalCurrentChange;
      log(
        `🟢 Match label - Tiempo: ${this.timeTotalCurrentChange}ms`,
        'success',
        __filename
      );
      await this.redis.set(
        `article:${this.articleId}:averageTime`,
        averageTime
      );
    });
  }

  public detenerEnvio() {
    clearInterval(this.intervalo);
    this.redis.quit();
  }
}

export { MensajeBowtz };
