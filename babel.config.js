module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 57) auto-injects the react-native-worklets plugin
    // when the package is installed, so Reanimated needs no manual plugin here.
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
