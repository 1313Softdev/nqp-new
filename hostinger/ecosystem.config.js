module.exports = {
  apps: [
    {
      name: 'news-for-all',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
        MYSQL_HOST: '127.0.0.1',
        MYSQL_PORT: 3306,
        MYSQL_DATABASE: 'u123456789_newsforall',
        MYSQL_USER: 'u123456789_newsuser',
        MYSQL_PASSWORD: 'YOUR_HOSTINGER_MYSQL_PASSWORD',
        ADMIN_KEY: 'admin123'
      }
    }
  ]
};
