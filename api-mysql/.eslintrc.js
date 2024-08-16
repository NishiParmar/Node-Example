module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    ignorePatterns: [
        'node_modules/'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    ignorePatterns: [
        'node_modules/',
        '.eslintrc.js',
        'data/'
    ],
    rules: {
        eqeqeq: 'off',
        semi: ['error', 'never'], // Removing semicolons
        quotes: ['error', 'single'], // Using single quotes for strings
        'comma-spacing': ['error', { before: false, after: true }],
        'space-infix-ops': 'error', // or 'always' for requiring spaces, 'never' for disallowing spaces
        'no-unused-vars': [
            // https://eslint.org/docs/latest/rules/no-unused-vars
            'error',
            { vars: 'all', args: 'none', ignoreRestSiblings: false },
        ],
        'comma-dangle': 'off',
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' }
        ],
    }
}
