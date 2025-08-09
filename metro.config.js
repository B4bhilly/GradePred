const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Remove unstable watcher options that cause validation warnings
if (config.watcher) {
  delete config.watcher.unstable_lazySha1;
  delete config.watcher.unstable_autoSaveCache;
}

module.exports = config;
