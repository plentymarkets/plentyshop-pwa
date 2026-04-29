module.exports = {
  apps: [
    {
      name: 'plentyshop-nuxt',
      script: './.output/server/index.mjs',
      interpreter: 'node',
      interpreter_args: '--max-old-space-size=1800',
      
      // CRITICAL: Restart at 1800MB before hitting 2GB pod limit
      max_memory_restart: '1800M',
      
      // Graceful shutdown configuration
      kill_timeout: 10000, // Wait 10s for connections to close
      wait_ready: false,   // Nuxt doesn't send ready signal
      
      // Single instance (scale at pod level instead)
      instances: 1,
      exec_mode: 'fork',
      
      // Restart protection
      autorestart: true,
      max_restarts: 10,
      min_uptime: '30s',
      restart_delay: 2000,
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NITRO_PORT: 3000,
      },
      
      // Logs
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
