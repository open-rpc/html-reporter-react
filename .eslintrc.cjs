module.exports = {
  root: true,

  extends: ['@metamask/eslint-config'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },

  overrides: [
    {
      files: ['*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
    },

    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'script',
      },
      extends: ['@metamask/eslint-config-nodejs'],
    },

    {
      files: ['yarn.config.cjs'],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2020,
      },
      settings: {
        jsdoc: {
          mode: 'typescript',
        },
      },
      extends: ['@metamask/eslint-config-nodejs'],
    },

    {
      files: ['*.test.ts', '*.test.js'],
      extends: [
        '@metamask/eslint-config-jest',
        '@metamask/eslint-config-nodejs',
      ],
    },
  ],

  ignorePatterns: [
    '!.eslintrc.js',
    '!.prettierrc.js',
    '.eslintrc.js',
    'postcss.config.cjs',
    'dist/',
    'docs/',
    '.yarn/',
  ],
};
