/*
 * edge.js
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeError } from 'edge-error'
import type { TagContract } from 'edge.js/types'

/**
 * Stack tag to define stack placeholders
 */
export const stack: TagContract = {
  tagName: 'stack',
  block: false,
  seekable: true,
  noNewLine: false,
  compile(parser, buffer, token) {
    const parsed = parser.utils.transformAst(
      parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
      token.filename,
      parser
    )

    /**
     * Disallow sequence expressions
     */
    if (parsed.type === 'SequenceExpression') {
      throw new EdgeError(
        `"${token.properties.jsArg}" is not a valid argument type for the "@stack" tag`,
        'E_UNALLOWED_EXPRESSION',
        {
          ...parser.utils.getExpressionLoc(parsed),
          filename: token.filename,
        }
      )
    }

    /**
     * Create stack
     */
    buffer.outputExpression(
      `state.$stacks.create(${parser.utils.stringify(parsed)})`,
      token.filename,
      token.loc.start.line,
      false
    )
  },
}
