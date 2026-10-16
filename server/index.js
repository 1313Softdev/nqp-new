import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getActiveDatabaseEngine, getIsMySQLConnected, MYSQL_CONFIG } from './config/db.js';
import seedData from './seed.js';
import { handleRealtimeStream } from './realtime.js';

import channelRoutes from './routes/channels.js';
import newsRoutes from './routes/news.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const INITIAL_PORT = parseInt(process.env.PORT || '5005', 10);

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Real-Time Server-Sent Events (SSE) Stream Endpoint
app.get('/api/realtime/stream', handleRealtimeStream);

// API Routes
app.use('/api/channels', channelRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Healthcheck & Database Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'News for All Editorial Blog Backend',
    databaseEngine: getActiveDatabaseEngine(),
    mysqlConnected: getIsMySQLConnected(),
    mysqlHost: `${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database}`,
    timestamp: new Date()
  });
});

// Serve built frontend static assets
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server with dynamic port fallback
const listenOnPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 News for All Editorial Blog running at http://localhost:${port}`);
      console.log(`📡 Real-Time Stream available at http://localhost:${port}/api/realtime/stream`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} in use, trying port ${port + 1}...`);
        resolve(listenOnPort(port + 1));
      } else {
        reject(err);
      }
    });
  });
};

const startServer = async () => {
  await connectDB();
  await seedData();
  await listenOnPort(INITIAL_PORT);
};

startServer();
