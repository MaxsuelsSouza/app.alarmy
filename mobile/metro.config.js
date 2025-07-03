const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  // Enable SWC compiler
  config.transformer = {
    ...config.transformer,
    unstable_transformProfile: 'hermes-stable',
  };
  return config;
})();
