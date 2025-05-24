// config.js - Adding React Native platform
const styleDictionaryConfig = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{
        destination: 'variables.js',
        format: 'javascript/es6'
      }]
    },
    // Add React Native platform
    reactNative: {
      transformGroup: 'js',
      buildPath: 'build/react-native/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/object'
      }]
    }
  }
};

module.exports = styleDictionaryConfig;