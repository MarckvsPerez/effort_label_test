import express from 'express';
import http from 'http';

import { CRUD_ICONS, log } from './utils/logs';
import { HOST } from './utils/serverIP';

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use((req, _res, next) => {
  log(
    `${CRUD_ICONS[req.method as keyof typeof CRUD_ICONS]} ${req.method} ${req.path}`,
    'info',
    __filename
  );
  next();
});

const isPortAvailable = async (port: number): Promise<boolean> => {
  return await new Promise((resolve) => {
    const testServer = http.createServer();

    testServer.once('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
        resolve(false);
      }
    });

    testServer.once('listening', () => {
      testServer.close();
      resolve(true);
    });

    testServer.listen(port);
  });
};

const getAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    log(`Port ${port} is in use, trying ${port + 1}`, 'warning', __filename);
    port++;
  }
  return port;
};

app.get('/', (_req, res) => {
  res.send('Server connected');
});

const startServer = async (): Promise<void> => {
  try {
    const availablePort = await getAvailablePort(3000);

    server
      .listen(availablePort, () => {
        log(
          `📡 Server running at http://${HOST}:${availablePort}/`,
          'success',
          __filename
        );
      })
      .on('error', (err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        log(`Error al iniciar el servidor: ${errorMessage}`, 'error', 'server');
        process.exit(1);
      });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    log(`Failed to initialize services: ${errorMessage}`, 'error', 'server');
    process.exit(1);
  }
};

void startServer();
