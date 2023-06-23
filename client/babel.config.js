module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'auto',
          },
          'jest',
        ],
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
}
