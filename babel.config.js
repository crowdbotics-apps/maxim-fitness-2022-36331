module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'import-glob-meta',
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          src: './src',
          assets: './src/assets',
          navigation: './src/navigation',
          store: './src/redux/store',
          screens: './src/screens',
          components: './src/components',
          utils: './src/utils',
          config: './src/config/app',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};