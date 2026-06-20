'use strict';

const { spawn } = require('child_process');

module.exports = function startWithKeepalive(startBot) {
  if (!process.argv.includes('--keepalive') || process.env.DANTE_CHILD) {
    return startBot();
  }

  let attempts = 0;

  function start() {
    console.log(`\n🔄 [Keep-Alive] Starting bot (attempt ${++attempts})...`);
    const args = process.argv.slice(2).filter((arg) => arg !== '--keepalive');
    const child = spawn(process.execPath, [require.resolve('../../index.js'), ...args], {
      stdio: 'inherit',
      env: { ...process.env, DANTE_CHILD: '1' },
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✅ [Keep-Alive] Bot stopped cleanly.');
        process.exit(0);
      }

      const delay = Math.min(5000 * attempts, 60000);
      console.log(`\n⚠️  [Keep-Alive] Crashed (code ${code}). Restarting in ${delay / 1000}s...`);
      setTimeout(start, delay);
    });
  }

  start();
};