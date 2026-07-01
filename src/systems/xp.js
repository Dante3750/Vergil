'use strict';
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/xp.json');

function createXpSystem() {
  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load existing data
  let xpStore = new Map();
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      if (content) {
        const data = JSON.parse(content);
        xpStore = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Error loading XP data:', error.message);
    }
  }

  const cooldown = new Set();

  const save = () => {
    try {
      const data = Object.fromEntries(xpStore);
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving XP data:', error.message);
    }
  };

  return {
    award(userId, amount = 5) {
      if (cooldown.has(userId)) return false;

      const currentXp = xpStore.get(userId) || 0;
      xpStore.set(userId, currentXp + amount);

      cooldown.add(userId);
      setTimeout(() => cooldown.delete(userId), 60_000);

      save(); // Persist changes
      return true;
    },
    get(userId) {
      return xpStore.get(userId) || 0;
    },
    top(limit = 10) {
      return [...xpStore.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
    },
  };
}

module.exports = { createXpSystem };