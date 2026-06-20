'use strict';

const start = require('./src/bot');
const startKeepalive = require('./src/systems/keepalive');

if (process.argv.includes('--keepalive')) {
  startKeepalive(start);
} else {
  start();
}