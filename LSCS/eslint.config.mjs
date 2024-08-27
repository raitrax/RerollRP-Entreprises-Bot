import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"]
    },
    {
        ignores: ['node_modules', 'eslint.config.js', 'prettier.config.js']
    },
    {
        languageOptions: {
            globals: globals.node
        }
    },
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // Side effect imports.
                        ['^\\u0000'],
                        // Packages.
                        // Things that start with a lowercase letter (or digit or underscore), or `@` followed by a letter.
                        ['^@?[a-z0-9]'],
                        // Components.
                        // Things that start with an uppercase.
                        ['^[A-Z]'],
                        // Absolute imports and other imports such as Vue-style `@/foo`.
                        // Anything that does not start with a dot.
                        ['^[^.]'],
                        // Relative imports.
                        // Anything that starts with a dot.
                        ['^\\.'],
                    ],
                },
            ],
        }
    },
    pluginJs.configs.recommended,
    {
        rules: {
            'no-console': [
                'warn',
                {
                    allow: ['error'],
                },
            ],
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            semi: 'error',
            quotes: ['error', 'single'],
            'no-var': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-multi-spaces': 'error',
            'space-in-parens': 'error',
            'prefer-const': 'error',
            'no-use-before-define': 'error',
            eqeqeq: 'error',
            curly: ['error'],
        }
    },
    eslintConfigPrettier,
    {
        rules: {
            'prettier/prettier': 'error',
        }
    }
];
