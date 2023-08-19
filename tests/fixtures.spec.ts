/*
 * edge-stacks
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Edge } from 'edge.js'
import { test } from '@japa/runner'

import { edgeStacks } from '../index.js'
import { pushTo } from '../src/tags/push_to.js'
import { pushOnceTo } from '../src/tags/push_once_to.js'
import { subsituteFileName, fixturesLoader, compileAndRender } from '../test_helpers/main.js'

const basePath = new URL('../fixtures/', import.meta.url)

test.group('Fixtures', (group) => {
  group.setup(() => {
    let counter = 1
    const originalIdGenerator = pushTo.generateId
    pushTo.generateId = () => `stack_${counter++}`
    return () => {
      pushTo.generateId = originalIdGenerator
    }
  })

  group.setup(() => {
    let counter = 1
    const originalIdGenerator = pushOnceTo.generateId
    pushOnceTo.generateId = () => `stack_${counter++}`
    return () => {
      pushOnceTo.generateId = originalIdGenerator
    }
  })

  test('{name}')
    .with(() => fixturesLoader(basePath))
    .run(async ({ assert }, fixture) => {
      const edge = new Edge()
      edge.use(edgeStacks)
      edge.mount(fixture.fixturePath)

      const renderer = await compileAndRender(edge, 'index.edge', fixture.state)

      assert.deepEqual(
        renderer.compiled.split('\n'),
        fixture.compiled.split('\n').map((line) => subsituteFileName(fixture.fixturePath, line))
      )

      assert.deepEqual(renderer.rendered.split('\n'), fixture.rendered.split('\n'))
    })
})
