import * as dotenv from 'dotenv';

export class EnvironmentConfig {
  private readonly requiredEnvVars: string[] = ['SOCKET_SERVER_URL'];

  public socketServerUrl: string;

  constructor() {
    dotenv.config();
    this.socketServerUrl = '';
    this.checkRequiredEnvVars();
  }

  private checkRequiredEnvVars(): void {
    this.requiredEnvVars.forEach((envVar) => {
      const value = process.env[envVar];
      if (value == null) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
      this.setEnvVar(envVar, value);
    });
  }

  private setEnvVar(envVar: string, value: string): void {
    switch (envVar) {
      case 'SOCKET_SERVER_URL':
        this.socketServerUrl = value;
        break;
    }
  }
}
