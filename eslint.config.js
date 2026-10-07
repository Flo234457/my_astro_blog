import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['.astro/**', 'dist/**'],
  },
  ...astro.configs['flat/recommended'],
];
