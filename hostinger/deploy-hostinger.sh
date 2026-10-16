#!/bin/bash
# Hostinger One-Click Build & Deployment Script for "News for All" (MySQL Edition)

echo "🚀 Starting News for All Production Deployment for Hostinger (MySQL)..."

# Step 1: Install Dependencies
echo "📦 Installing npm dependencies (including mysql2)..."
npm install

# Step 2: Build Frontend Assets
echo "⚡ Building Vite + React production bundle..."
npm run build

# Step 3: Check Environment
if [ ! -f .env ]; then
  echo "⚠️ .env file missing. Copying hostinger/.env.hostinger to .env..."
  cp hostinger/.env.hostinger .env
fi

# Step 4: Restart PM2 or Node Application
if command -v pm2 &> /dev/null; then
  echo "🔄 Restarting Node process with PM2..."
  pm2 reload hostinger/ecosystem.config.js || pm2 start hostinger/ecosystem.config.js
else
  echo "✅ Build complete! Start the server with: npm run start"
fi

echo "🎉 Hostinger deployment ready! Import hostinger/database.sql in phpMyAdmin if setting up a fresh DB."
