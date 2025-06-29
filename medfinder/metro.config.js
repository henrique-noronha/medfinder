// Corrige problemas de compatibilidade com Firebase Auth e Expo Router no Android
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("cjs");
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;