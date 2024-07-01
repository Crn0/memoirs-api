import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    pluginJs.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node,
        },
    },
    {
        rules: {
            'func-names': 'off',
            'prefer-arrow-callback': 'warn',
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-undef': 'error',
        },
    },
];
