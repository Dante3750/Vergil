'use strict';

function createXpSystem() {
  const xpStore = new Map();
  const cooldown = new Set();

  return {
    award(userId, amount = 5) {
      if (cooldown.has(userId)) return false;
      xpStore.set(userId, (xpStore.get(userId) || 0) + amount);
      cooldown.add(userId);
      setTimeout(() => cooldown.delete(userId), 60_000);
      return true;
    },
    get(userId) {
      return xpStore.get(userId) || 0;
    },
    top(limit = 10) {
      return [...xpStore.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
    },
  };
}

module.exports = { createXpSystem };