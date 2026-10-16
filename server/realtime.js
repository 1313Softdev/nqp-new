import { getActiveDatabaseEngine, getIsMySQLConnected, MYSQL_CONFIG } from './config/db.js';

const sseClients = new Set();

export const handleRealtimeStream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected status with active database engine info
  const initialPayload = JSON.stringify({
    type: 'connected',
    engine: getActiveDatabaseEngine(),
    mysqlConnected: getIsMySQLConnected(),
    mysqlHost: `${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database}`,
    timestamp: new Date().toISOString()
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);

  const heartbeat = setInterval(() => {
    const ping = JSON.stringify({
      type: 'heartbeat',
      engine: getActiveDatabaseEngine(),
      mysqlConnected: getIsMySQLConnected(),
      mysqlHost: `${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database}`,
      timestamp: new Date().toISOString()
    });
    res.write(`data: ${ping}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
};

export const broadcastRealtimeEvent = (eventType, payload = {}) => {
  const message = JSON.stringify({
    type: eventType,
    engine: getActiveDatabaseEngine(),
    mysqlConnected: getIsMySQLConnected(),
    data: payload,
    timestamp: new Date().toISOString()
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${message}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  }
};
