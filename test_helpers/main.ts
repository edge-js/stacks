/*
 * edge-stacks
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import { fileURLToPath } from 'node:url'
import { Edge, edgeGlobals } from 'edge.js'
import { readFile, readdir, stat } from 'node:fs/promises'

export function subsituteFileName(basePath: URL, value: string) {
  value = value.replace('{{__dirname}}', `${fileURLToPath(basePath)}`)
  if (value.trim().startsWith('let $filename') || value.trim().startsWith('$filename =')) {
    return value.replace(/=\s"(.*)"/, (_, group) => `= ${edgeGlobals.js.stringify(group)}`)
  }
  return value
}

export function normalizeNewLines(value: string) {
  return value.replace(/\+=\s"\\n"/g, `+= ${EOL === '\n' ? `"\\n"` : `"\\r\\n"`}`)
}

export async function compileAndRender(edge: Edge, template: string, state: any) {
  let compiledOutput = ''
  edge.processor.process('compiled', ({ compiled, path }) => {
    if (path.endsWith(template)) {
      compiledOutput = normalizeNewLines(compiled)
    }
  })

  edge.processor.process('output', ({ output, state: outputState }) => {
    return outputState.$stacks.replacePlaceholders(output)
  })

  const rendered = await edge.render(template, state)
  return { compiled: compiledOutput, rendered: rendered.split(EOL).join('\n') }
}

export async function loadFixture(fixturePath: URL) {
  const state = JSON.parse(await readFile(new URL('index.json', fixturePath), 'utf-8'))
  const rendered = await readFile(new URL('index.txt', fixturePath), 'utf-8')
  const compiled = await readFile(new URL('compiled.js', fixturePath), 'utf-8')

  return {
    state,
    rendered: rendered.split(EOL).join('\n'),
    compiled: normalizeNewLines(compiled),
    fixturePath,
  }
}

export async function fixturesLoader(basePath: URL) {
  const list = await readdir(basePath)
  const fixtures = []

  for (let item of list) {
    const fixturePath = new URL(`${item}/`, basePath)
    const stats = await stat(fixturePath)

    if (stats.isDirectory()) {
      fixtures.push({ name: item, ...(await loadFixture(fixturePath)) })
    }
  }

  return fixtures
}
