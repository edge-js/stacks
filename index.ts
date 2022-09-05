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

export function edgeStacks(edge: EdgeContract) {
  /**
   * Replace placeholders with actual stacks content
   */
  edge.processor.process('output', ({ output, state }) => {
    return state.$stacks.replacePlaceholders(output)
  })

  /**
   * Share stacks with every template
   */
  edge.onRender((renderer) => {
    renderer.share({ $stacks: new Stacks() })
  })
}
