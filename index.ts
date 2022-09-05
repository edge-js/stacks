/*
 * edge-stacks
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeContract } from 'edge.js'

import Stacks from './src/stacks'
import { stack } from './src/tags/stack'
import { pushTo } from './src/tags/push_to'
import { pushOnceTo } from './src/tags/push_once_to'

declare module 'edge.js' {
  interface TemplateContract {
    stackSources: any
  }
}

export function edgeStacks(edge: EdgeContract) {
  /**
   * Replace placeholders with actual stacks content
   */
  edge.processor.process('output', ({ output, state }) => {
    return state.$stacks.replacePlaceholders(output)
  })

  /**
   * Register tags
   */
  edge.registerTag(stack)
  edge.registerTag(pushTo)
  edge.registerTag(pushOnceTo)

  /**
   * Share stacks with every template
   */
  edge.onRender((renderer) => {
    renderer.share({ $stacks: new Stacks() })
  })
}
