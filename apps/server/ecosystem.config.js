module.exports = {
  apps: [
    {
      name: 'plentyshop-middleware',
      script: 'dist/index.js',
      interpreter: 'node',
      interpreter_args: '--max-old-space-size=1800',
      
      kill_timeout: 10000,       
      wait_ready: true,           
      listen_timeout: 10000,      
      
      max_memory_restart: '1800M',
      
      instances: 1,                
      exec_mode: 'fork',         
      
      autorestart: true,
      max_restarts: 5,          
      min_uptime: '60s',         
      restart_delay: 4000,      
      
      env_production: {
        NODE_ENV: 'production',
        PORT: 8181,
      },
      
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      shutdown_with_message: true, 
    },
  ],
};
