import path from 'path';
import requireIndex from 'requireindex';

module.exports = {
  rules: requireIndex(path.resolve(__dirname, 'rules')),
  configs: {
    default: {
      plugins: ['try-catch-failsafe'],
      rules: {
        'try-catch-failsafe/json-parse': 'error',
        'try-catch-failsafe/new-url': 'error',
      },
    },
  },
};
