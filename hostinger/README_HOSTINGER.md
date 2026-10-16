# 🚀 Hostinger Deployment Guide with MySQL Database (`database.sql`)

This folder contains everything needed to deploy the **News for All — Modern-Vintage Editorial Blog & News CMS** to **Hostinger** (hPanel Node.js Web Hosting, Cloud Hosting, or VPS) with a **MySQL Database**.

---

## 📁 Included Hostinger Files

| File | Purpose |
| :--- | :--- |
| **`hostinger/database.sql`** | Complete MySQL 8.0 / MariaDB database dump (`settings`, `channels`, and `news` tables + initial editorial stories, categories, post formats, and theme presets). Ready to import in **Hostinger phpMyAdmin**. |
| **`hostinger/.env.hostinger`** | Production `.env` template pre-configured for Hostinger MySQL (`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`). |
| **`hostinger/.htaccess`** | Apache reverse-proxy and Gzip compression rules for Hostinger shared/cloud hosting. |
| **`hostinger/ecosystem.config.js`** | PM2 process manager configuration for Hostinger VPS deployments. |
| **`hostinger/deploy-hostinger.sh`** | One-click build and deployment script for SSH/VPS. |

---

## 🗄️ Step 1: Create & Import the MySQL Database on Hostinger

1. Log in to **Hostinger hPanel** → Go to **Databases** → **Management**.
2. Create a new MySQL Database and User:
   - **Database Name**: e.g. `u123456789_newsforall`
   - **Database Username**: e.g. `u123456789_newsuser`
   - **Password**: Choose a strong password and save it.
3. Click **Enter phpMyAdmin** next to your newly created database.
4. Click the **Import** tab at the top of phpMyAdmin.
5. Click **Choose File** and select **`hostinger/database.sql`**.
6. Click **Import / Go** at the bottom.
   - This creates the 3 tables (`settings`, `channels`, `news`) with all custom **Categories**, **Post Formats**, **Theme Colors**, **Syndicated Channels**, and **Initial Stories**.
   - *(Note: Even if you skip importing `database.sql`, the Node.js backend automatically creates the tables and seeds initial data on first startup!)*

---

## 🌐 Step 2: Deploy the Node.js App on Hostinger hPanel

1. **Upload Project Files**:
   - Compress the project root folder (excluding `node_modules`) into a `.zip` archive, or push to your GitHub repository.
   - Upload and extract into `public_html` via **Hostinger File Manager**.

2. **Configure Node.js Application**:
   - In Hostinger hPanel, go to **Advanced** → **Node.js** (or **Websites** → **Node.js**).
   - **Node.js Version**: `20.x` or `22.x` (or latest available)
   - **Application Mode**: `Production`
   - **Application Root**: `public_html`
   - **Application Startup File**: `server/index.js`

3. **Set MySQL Environment Variables** (either in `.env` or in hPanel Node.js Environment Variables):
   ```env
   NODE_ENV=production
   PORT=5005
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   MYSQL_DATABASE=u123456789_newsforall
   MYSQL_USER=u123456789_newsuser
   MYSQL_PASSWORD=YOUR_HOSTINGER_MYSQL_PASSWORD
   ADMIN_KEY=admin123
   ```

4. **Install Dependencies & Build Frontend** (if `dist/` is not already uploaded):
   ```bash
   npm install
   npm run build
   ```
5. Click **Restart Application** in Hostinger hPanel.

---

## 🐳 Local Docker MySQL Setup (Development)

To run the MySQL 8.0 database locally with Docker:
```bash
docker compose up -d mysql
npm run start
```
- **Local Website & Editorial Studio**: `http://localhost:5005`
- **Local Docker MySQL Port**: `127.0.0.1:3309` (Database: `newsforall`, User: `root`, Password: `rootpassword`)
- **Default Editor Passkey**: `admin123`
