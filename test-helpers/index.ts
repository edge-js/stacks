/*
 * edge-stacks
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep, join } from 'node:path'
import { EdgeContract } from 'edge.js'
// @ts-ignore
import * as stringify from 'js-stringify'
import { readFile, readdir, stat } from 'node:fs/promises'
import Stacks from '../src/stacks'

export function subsiteFileName(basePath: string, value: string) {
  value = value.replace('{{__dirname}}', `${basePath}${sep}`)
  if (value.trim().startsWith('let $filename') || value.trim().startsWith('$filename =')) {
    return value.replace(/=\s"(.*)"/, (_, group) => `= ${stringify(group)}`)
  }
  return value
}

export async function loadFixture(fixturePath: string) {
  const state = JSON.parse(await readFile(join(fixturePath, 'index.json'), 'utf-8'))
  const rendered = await readFile(join(fixturePath, 'index.txt'), 'utf-8')
  const compiled = await readFile(join(fixturePath, 'compiled.js'), 'utf-8')

  return { state, rendered, compiled, fixturePath }
}

export async function fixturesLoader(basePath: string) {
  const list = await readdir(basePath)
  const fixtures = []

  for (let item of list) {
    const fixturePath = join(basePath, item)
    const stats = await stat(fixturePath)

    if (stats.isDirectory()) {
      fixtures.push({ name: item, ...(await loadFixture(fixturePath)) })
    }
  }

  return fixtures
}

export async function compileAndRender(
  edge: EdgeContract,
  template: string,
  state: any,
  stacks: Stacks
) {
  let compiledOutput = ''
  edge.processor.process('compiled', ({ compiled, path }) => {
    if (path.endsWith(template)) {
      compiledOutput = compiled
    }
  })

  edge.processor.process('output', ({ output, state: outputState }) => {
    return outputState.$stacks.replacePlaceholders(output)
  })

  const rendered = await edge.share({ $stacks: stacks }).render(template, state)
  return { compiled: compiledOutput, rendered }
}
