import eslint from 'eslint';

const ruleTester = new eslint.RuleTester({
  parserOptions: { ecmaVersion: 10 },
});

const rule = require('../../src/rules/json-parse');

ruleTester.run("json-parse-in-try-catch", rule, {
  valid: [
    {
      code: `
        try {
          JSON.parse('{}');
        } catch(err) {}
      `,
    },
    {
      // new syntax (no params in `catch` block)
      code: `
        try {
          JSON.parse('{}');
        } catch {}
      `,
    },
    {
      // new syntax (no `catch` block)
      code: `
        try {
          JSON.parse('{}');
        } finally {}
      `,
    },
    {
      code: `
        let a = null;
        try {
          a = JSON.parse('{}');
        } catch(err) {}
      `,
    },
    {
      // JSON.parse in `finally` block, but it's wrapped again
      code: `
        let a = null;
        try {
        } finally {
          try {
            a = JSON.parse('{}');
          } finally {}
        }
      `,
    },
    {
      // no JSON.parse at all
      code: `
        console.log('ok');
      `,
    },
  ],
  invalid: [
    {
      code: `
        const a = '{"a":"b"}';
        const b = JSON.parse(a);
        const c = '{"a":"b"}';
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'CallExpression' },
      ],
    },
    {
      code: `
        JSON.parse('{"a":"b"}');
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'CallExpression' },
      ],
    },
    {
      code: `
        try {
          /**/
        } catch {
          JSON.parse('{"a":"b"}');
        }
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'CallExpression' },
      ],
    },
    {
      code: `
        try {
          /**/
        } finally {
          JSON.parse('{"a":"b"}');
        }
      `,
      errors: [
        { messageId: 'shouldWrap', type: 'CallExpression' },
      ],
    },
  ],
});
