'use strict';

const createGeneralCommands = require('./general');
const createGiveawayCommands = require('./giveaway');
const createStaffCommands = require('./staff');
const createNukeCommands = require('./nuke');

function createCommandRouter() {
  const handlers = new Map([
    ...Object.entries(createGeneralCommands()),
    ...Object.entries(createGiveawayCommands()),
    ...Object.entries(createStaffCommands()),
    ...Object.entries(createNukeCommands()),
  ]);

  return {
    async handleMessage(ctx) {
      const handler = handlers.get(ctx.cmd);
      if (!handler) return false;
      await handler(ctx);
      return true;
    },
  };
}

module.exports = { createCommandRouter };