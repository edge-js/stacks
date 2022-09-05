/*
 * edge-stacks
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Core implementation of the stacks feature in Edge
 */
export default class Stacks {
  private placeholders: Map<string, Map<string, string[]>> = new Map()

  /**
   * Returns the placeholder name for a given stack
   */
  private createPlaceholder(name: string) {
    return `<!-- @edge.stacks.${name} -->`
  }

  /**
   * Check if the contents for a unique key already exists
   * inside a given stack or not
   */
  has(name: string, uniqueKey: string) {
    const placeholder = this.placeholders.get(name)
    if (!placeholder) {
      return false
    }

    return placeholder.has(uniqueKey)
  }

  /**
   * Create a new stack placeholder. Multiple calls to this method
   * with the same name results in an exception.
   */
  create(name: string) {
    if (this.placeholders.has(name)) {
      throw new Error(`Cannot declare stack "${name}" for multiple times`)
    }

    this.placeholders.set(name, new Map())
    return this.createPlaceholder(name)
  }

  /**
   * Push content inside a given stack
   */
  pushTo(name: string, uniqueKey: string, contents: string) {
    const placeholder = this.placeholders.get(name)
    if (!placeholder) {
      throw new Error(
        `Cannot pushTo "${name}" stack. Make sure to create a stack first using "@stack"`
      )
    }

    /**
     * Instantiate unique key stack if not done already
     */
    if (!placeholder.has(uniqueKey)) {
      placeholder.set(uniqueKey, [])
    }

    /**
     * Defined content for the unique key inside a given
     * stack
     */
    placeholder.get(uniqueKey)!.push(contents)

    return this
  }

  /**
   * Replace placeholders from a string with the stacks value
   */
  replacePlaceholders(contents: string) {
    for (let [name, sources] of this.placeholders) {
      const stackContents = []
      for (let [, source] of sources) {
        stackContents.push(source.join('\n'))
      }

      contents = contents.replace(this.createPlaceholder(name), stackContents.join('\n'))
    }

    return contents
  }
}
