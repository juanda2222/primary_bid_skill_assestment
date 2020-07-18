// we will use babel to test integrations of the vue modules and the server

    // babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@vue/cli-plugin-babel/preset'
  ],
};
    