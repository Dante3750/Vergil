'use strict';

const start = require('./src/bot');
const startKeepalive = require('./src/systems/keepalive');

// Global error handling to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

if (process.argv.includes('--keepalive')) {
  startKeepalive(start);
} else {
  start();
}