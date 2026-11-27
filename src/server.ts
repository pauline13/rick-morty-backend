import { createApp } from './app';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

const port = Number(process.env.PORT ?? DEFAULT_PORT);
const host = process.env.HOST ?? DEFAULT_HOST;

const app = createApp();

const server = app.listen(port, () => {
  console.log(`Listening on http://${host}:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
