import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, '../data');
export const CHANNELS_FILE = path.join(DATA_DIR, 'channels.json');
export const NEWS_FILE = path.join(DATA_DIR, 'news.json');
export const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

let mysqlPool = null;
let isMySQLConnected = false;
let isMongoConnected = false;

export const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'u796814945_nqpnew',
  password: process.env.MYSQL_PASSWORD || 'Kuku@5769',
  database: process.env.MYSQL_DATABASE || 'u796814945_nqpnew',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const initStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHANNELS_FILE)) {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(NEWS_FILE)) {
    fs.writeFileSync(NEWS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(null, null, 2));
  }
};

export const initMySQLTables = async (pool) => {
  // 1. News / Blog Articles Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS news (
      _id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      subtitle TEXT,
      postType VARCHAR(100) DEFAULT 'Article',
      author VARCHAR(255) DEFAULT 'Editorial Desk',
      readTime VARCHAR(100) DEFAULT '5 min read',
      publishDate VARCHAR(50),
      publishedAt VARCHAR(100),
      url TEXT,
      youtubeUrl TEXT,
      description LONGTEXT,
      image LONGTEXT,
      category VARCHAR(150) DEFAULT 'News',
      tags JSON,
      channelName VARCHAR(255) DEFAULT 'News for All',
      channelLogo LONGTEXT,
      seoTitle VARCHAR(500),
      seoDescription TEXT,
      likes INT DEFAULT 0,
      dislikes INT DEFAULT 0,
      isFeatured BOOLEAN DEFAULT FALSE,
      postedByAdmin BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Syndicated Channels Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS channels (
      _id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      logo LONGTEXT,
      url TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Site Settings Table (Categories, Post Formats, Theme, SEO, Social)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      _id VARCHAR(64) PRIMARY KEY,
      siteName VARCHAR(255) DEFAULT 'News for All',
      siteTagline TEXT,
      siteEdition VARCHAR(255),
      logoUrl LONGTEXT,
      metaTitle VARCHAR(500),
      metaDescription TEXT,
      metaKeywords TEXT,
      ogImage LONGTEXT,
      categories JSON,
      postFormats JSON,
      theme JSON,
      socialLinks JSON,
      footerText TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
};

export const tryConnectMySQL = async () => {
  try {
    // Attempt optional database creation if user has privilege (e.g. Docker root), ignore on shared Hostinger
    try {
      const bootstrapConn = await mysql.createConnection({
        host: MYSQL_CONFIG.host,
        port: MYSQL_CONFIG.port,
        user: MYSQL_CONFIG.user,
        password: MYSQL_CONFIG.password,
        connectTimeout: 4000
      });
      await bootstrapConn.query(
        `CREATE DATABASE IF NOT EXISTS \`${MYSQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
      await bootstrapConn.end();
    } catch (e) {
      // On Hostinger shared MySQL, the database is pre-created in hPanel
    }

    mysqlPool = mysql.createPool(MYSQL_CONFIG);
    await mysqlPool.query('SELECT 1');
    await initMySQLTables(mysqlPool);
    isMySQLConnected = true;
    console.log(`✅ MySQL Connected successfully (${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database})`);
    return true;
  } catch (err) {
    isMySQLConnected = false;
    return false;
  }
};

export const connectDB = async () => {
  initStorage();

  // 1. Try MySQL first (Primary Real-time SQL Engine)
  const mysqlOk = await tryConnectMySQL();
  if (mysqlOk) {
    // Set up background health/reconnect check
    setInterval(async () => {
      if (!isMySQLConnected) {
        await tryConnectMySQL();
      } else {
        try {
          await mysqlPool.query('SELECT 1');
        } catch (e) {
          isMySQLConnected = false;
        }
      }
    }, 10000);
    return;
  }

  // 2. Fallback reconnect loop if Docker MySQL is still booting
  setInterval(async () => {
    if (!isMySQLConnected) {
      const connected = await tryConnectMySQL();
      if (connected) {
        console.log('🔄 Switched live backend storage to Docker MySQL!');
        try {
          const { seedData } = await import('../seed.js');
          await seedData();
        } catch (e) {}
      }
    }
  }, 6000);

  // 3. Optional MongoDB or Resilient File-Backed Engine while MySQL starts
  const mongoURI = process.env.MONGODB_URI;
  if (mongoURI) {
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
      isMongoConnected = true;
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (e) {
      isMongoConnected = false;
    }
  }

  console.log(`ℹ️ MySQL container not yet reachable on ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}. Using resilient local storage (will auto-connect to MySQL when container is ready).`);
};

export const getMySQLPool = () => mysqlPool;
export const getIsMySQLConnected = () => isMySQLConnected;
export const getIsMongoConnected = () => isMongoConnected;

export const getActiveDatabaseEngine = () => {
  if (isMySQLConnected) return 'MySQL 8.0 (Docker Realtime)';
  if (isMongoConnected) return 'MongoDB';
  return 'Local JSON Storage (Auto-Sync)';
};

export const readLocalData = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const writeLocalData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('File write error:', e);
  }
};
