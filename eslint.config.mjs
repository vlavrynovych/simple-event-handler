import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettier,
    {
        ignores: ['node_modules/', 'dist/', 'coverage/', '*.min.js'],
    },
    // Configuration for source files (script mode)
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                module: 'readonly',
                require: 'readonly',
                angular: 'readonly',
            },
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    // Configuration for test files (module mode)
    {
        files: ['test/**/*.js', '*.config.mjs', '*.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
];
