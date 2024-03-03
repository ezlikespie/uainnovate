module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}', './custom_plugins/**/*.ts'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    prject: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['react', 'react-refresh', 'react-hooks'],
  ignorePatterns: [
    'dist',
    'vite.config.ts',
    'functions/**/*',
    '.eslintrc.cjs',
    'postcss.config.js',
    'tailwind.config.js',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
    'react/prop-types': 0,
    'no-trailing-spaces': 1,
  },
}
