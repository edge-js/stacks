/*
 * edge.js
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TagContract } from 'edge.js'
import { EdgeError } from 'edge-error'
import { expressions } from 'edge-parser'
import { customAlphabet } from 'nanoid/non-secure'

/**
 * Nanoid instance for variable safe unique names
 */
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10)

/**
 * Stack tag to define stack placeholders
 */
export const pushOnceTo: TagContract & { generateId(): string } = {
  tagName: 'pushOnceTo',
  block: true,
  seekable: true,
  noNewLine: true,
  generateId() {
    return `stack_${nanoid()}`
  },
  compile(parser, buffer, token) {
    const parsed = parser.utils.transformAst(
      parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
      token.filename,
      parser
    )

    /**
     * Disallow sequence expressions
     */
    if (expressions.SequenceExpression.includes(parsed.type)) {
      throw new EdgeError(
        `"${token.properties.jsArg}" is not a valid argument type for the @pushTo tag`,
        'E_UNALLOWED_EXPRESSION',
        {
          ...parser.utils.getExpressionLoc(parsed),
          filename: token.filename,
        }
      )
    }

    /**
     * Each stack must be unique
     */
    const stackId = this.generateId()
    const stackName = parser.utils.stringify(parsed)

    /**
     * Create a custom buffer for the stack. Since we do not want to the write
     * to the main buffer
     */
    const stackBuffer = buffer.create(token.filename, { outputVar: stackId })
    buffer.writeStatement(
      `if (!state.$stacks.has(${stackName}, '${stackId}')) {`,
      token.filename,
      token.loc.start.line
    )

    /**
     * Process children
     */
    for (let child of token.children) {
      parser.processToken(child, stackBuffer)
    }

    /**
     * Flush the stack buffer content to the main buffer
     */
    buffer.writeStatement(
      stackBuffer
        .disableFileAndLineVariables()
        .disableReturnStatement()
        .disableTryCatchBlock()
        .flush(),
      token.filename,
      token.loc.start.line
    )

    buffer.writeExpression(
      `state.$stacks.pushTo(${parser.utils.stringify(parsed)}, '${stackId}', ${stackId})`,
      token.filename,
      token.loc.start.line
    )

    buffer.writeStatement('}', token.filename, token.loc.start.line)
  },
}
