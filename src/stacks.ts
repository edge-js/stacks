/*
 * edge-stacks
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'

/**
 * Core implementation of the stacks feature in Edge
 */
export default class Stacks {
  #placeholders: Map<string, string[]> = new Map()

  /**
   * Returns the placeholder name for a given stack
   */
  #createPlaceholder(name: string) {
    return `<!-- @edge.stacks.${name} -->`
  }

  /**
   * Create a new stack placeholder. Multiple calls to this method
   * with the same name results in an exception.
   */
  create(name: string) {
    if (this.#placeholders.has(name)) {
      throw new Error(`Cannot declare stack "${name}" for multiple times`)
    }

    this.#placeholders.set(name, [])
    return this.#createPlaceholder(name)
  }

  /**
   * Push content inside a given stack
   */
  pushTo(name: string, contents: string) {
    const placeholder = this.#placeholders.get(name)
    if (!placeholder) {
      throw new Error(
        `Cannot push to non-existing stack named "${name}". Use "@stack('${name}')" to first create a stack`
      )
    }

    /**
     * Defined content for the unique key inside a given
     * stack
     */
    placeholder.push(contents)
    return this
  }

  /**
   * Replace placeholders from a string with the stacks value
   */
  replacePlaceholders(contents: string) {
    for (let [name, sources] of this.#placeholders) {
      contents = contents.replace(this.#createPlaceholder(name), sources.join(EOL))
    }

    return contents
  }
}
