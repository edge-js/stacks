/*
 * edge.js
 *
 * (c) Edge
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { customAlphabet } from 'nanoid/non-secure'

/**
 * Nanoid instance for variable safe unique names
 */
export const nanoid = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  10
)
