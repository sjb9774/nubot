
    module.exports = {
      apps: [
        {
          name: 'nubot',
          script: '/home/centos/prod/releases/20210315045109/bot.js',
          watch: true,
          autorestart: true,
          restart_delay: 1000,
          env: {
            NODE_ENV: 'development'
          },
          env_production: {
            NODE_ENV: 'production'
          }
        }
      ]
    };