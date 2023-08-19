/*
 * edge-stacks
 *
 * (c) Harminder Virk
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PluginFn } from 'edge.js/types'
import Stacks from './src/stacks.js'
import { stack } from './src/tags/stack.js'
import { pushTo } from './src/tags/push_to.js'
import { pushOnceTo } from './src/tags/push_once_to.js'

/**
 * Edge plugin to implement stacks
 */
export const edgeStacks: PluginFn<undefined> = (edge) => {
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
