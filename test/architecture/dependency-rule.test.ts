// AI Coding
/**
 * @file dependency-rule.test.ts
 * @description Sanity Dependency Rule một chiều (ADR-003, tasks 8.2): quét import tĩnh của src/core và src/domain.
 * core/ KHÔNG import ui|app|data; domain/ (innermost ring) KHÔNG import lớp nào khác.
 */
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const srcDir = join(process.cwd(), 'src')

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry)
    return statSync(fullPath).isDirectory()
      ? collectFiles(fullPath)
      : [fullPath]
  })
}

function importSpecifiers(file: string): string[] {
  const source = readFileSync(file, 'utf8')
  const pattern = /(?:import|export)[^'"]*from\s*['"]([^'"]+)['"]/g
  const specifiers: string[] = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source)) !== null) {
    specifiers.push(match[1])
  }
  return specifiers
}

function importsForbiddenLayer(specifier: string, layers: string[]): boolean {
  return layers.some(
    (layer) =>
      specifier === layer ||
      specifier.startsWith(`${layer}/`) ||
      specifier.includes(`/${layer}/`),
  )
}

function violationsIn(layerDir: string, forbidden: string[]): string[] {
  const violations: string[] = []
  for (const file of collectFiles(join(srcDir, layerDir))) {
    for (const specifier of importSpecifiers(file)) {
      if (importsForbiddenLayer(specifier, forbidden)) {
        violations.push(`${file} → ${specifier}`)
      }
    }
  }
  return violations
}

describe('Dependency Rule (one-way, ADR-003)', () => {
  it('core/ không import ui|app|data', () => {
    expect(violationsIn('core', ['ui', 'app', 'data'])).toEqual([])
  })

  it('domain/ (Shared Kernel) không import lớp nào khác', () => {
    expect(violationsIn('domain', ['ui', 'app', 'core', 'data'])).toEqual([])
  })
})
