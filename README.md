# eslint-plugin-try-catch-failsafe

Make sure to use try-catch to wrap up some dangerous actions!

## Installation

Use package manager to install this plugin.

```bash
npm install --save-dev eslint-plugin-try-catch-failsafe
yarn add -D eslint-plugin-try-catch-failsafe
pnpm add -D eslint-plugin-try-catch-failsafe
```

## Usage

Add this plugin to your ESLint configuration.

```json
{
  "plugins": [
    "try-catch-failsafe"
  ]
}
```

## Rules

### try-catch-failsafe/json-parse

- **Default**: `error`
- **Fixable**: `false`

Make sure to use try-catch to wrap up `JSON.parse`. Notice that the `JSON.parse` in `catch` or `finally` block may also throw an error in JavaScript, so we should wrap them up too.

```js
// ❌ Error
JSON.parse('{"foo": "bar"}');

// ❌ Error
try {
  // some code that may throw an error
} catch (e) {
  JSON.parse('{"foo": "bar"}');
}

// ❌ Error
try {
  // some code that may throw an error
} finally {
  JSON.parse('{"foo": "bar"}');
}

// ✅ OK
try {
  JSON.parse('{"foo": "bar"}');
} catch (e) {
  console.error(e);
}

// ✅ OK
try {
  // some code that may throw an error
} finally {
  try {
    JSON.parse('{"foo": "bar"}');
  } finally {}
}
```

If you are confident that the `JSON.parse` will not throw an error, you can disable this rule.
