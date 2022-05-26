// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js

// https://commitlint.js.org/#/./guides-local-setup?id=guides-local-setup

module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 1000],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 1000],
    'header-max-length': [2, 'always', 1000],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', []],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
