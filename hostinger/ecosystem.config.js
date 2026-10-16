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
        MYSQL_DATABASE: 'u796814945_nqpnew',
        MYSQL_USER: 'u796814945_nqpnew',
        MYSQL_PASSWORD: 'Kuku@5769',
        ADMIN_KEY: 'Kuku@5769'
      }
    }
  ]
};
