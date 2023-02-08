import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

const findTryStatementRange = (
  node: ESTree.Node & Partial<Rule.NodeParentExtension>,
): [number, number] | null => {
  if (!node.parent) {
    return null;
  }
  if (node.parent.type === 'TryStatement') {
    /**
     * The `try` statement should not be the only condition to determine
     * whether the `new URL()` call is wrapped in `try-catch` block,
     * because the following code will not throw an error in JavaScript:
     *
     * ```js
     * try {
     *   // some code that throws an error
     * } catch {
     *   new URL('');
     * } finally {
     *   new URL('');
     * }
     *
     * So if node is wrapped in `catch` or `finally` block, we shoud
     * still report the error.
     */
    if (node.parent?.handler === node || node.parent?.finalizer === node) {
      return null;
    }
    return node.range;
  }
  return findTryStatementRange(node.parent);
};

module.exports = {
  meta: {
    docs: {
      description: 'Use try-catch to wrap new URL()',
    },
    fixable: null,
    messages: {
      shouldWrap: 'new URL() should be wrapped in try-catch',
    },
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    return {
      NewExpression: node => {
        if (node.callee.type === 'Identifier' && node.callee.name === 'URL') {
          const range = findTryStatementRange(node);
          if (!range) {
            context.report({ node, messageId: 'shouldWrap' });
            return;
          }
          // range should be bigger than node.range
          if (range[0] < node.range[0] && node.range[1] < range[1]) {
            return;
          }
          context.report({ node, messageId: 'shouldWrap' });
        }
      },
    };
  },
};
