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
      code: `
        try {
          JSON.parse('{}');
        } catch {}
      `,
    },
    {
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
