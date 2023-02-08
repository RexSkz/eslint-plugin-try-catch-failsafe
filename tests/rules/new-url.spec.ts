import eslint from 'eslint';

const ruleTester = new eslint.RuleTester({
  parserOptions: { ecmaVersion: 10 },
});

const rule = require('../../src/rules/new-url');

ruleTester.run("json-parse-in-try-catch", rule, {
  valid: [
    {
      code: `
        try {
          new URL('');
        } catch(err) {}
      `,
    },
    {
      // new syntax (no params in `catch` block)
      code: `
        try {
          new URL('');
        } catch {}
      `,
    },
    {
      // new syntax (no `catch` block)
      code: `
        try {
          new URL('');
        } finally {}
      `,
    },
    {
      code: `
        let a = null;
        try {
          a = new URL('');
        } catch(err) {}
      `,
    },
    {
      // new URL() in `finally` block, but it's wrapped again
      code: `
        let a = null;
        try {
        } finally {
          try {
            a = new URL('');
          } finally {}
        }
      `,
    },
    {
      // no new URL() at all
      code: `
        console.log('ok');
      `,
    },
  ],
  invalid: [
    {
      code: `
        const b = new URL('');
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'NewExpression' },
      ],
    },
    {
      code: `
        new URL('');
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'NewExpression' },
      ],
    },
    {
      code: `
        try {
          /**/
        } catch {
          new URL('');
        }
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'NewExpression' },
      ],
    },
    {
      code: `
        try {
          /**/
        } finally {
          new URL('');
        }
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'NewExpression' },
      ],
    },
  ],
});
