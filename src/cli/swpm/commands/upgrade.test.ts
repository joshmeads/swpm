import { describe, expect, it } from 'vitest'
import { testCommandResult } from '../../../../.vitest/helpers'

export const upgradeCases = [
  ['npm', 'npm add vite@latest'],
  ['yarn@classic', 'yarn upgrade vite --latest'],
  ['yarn@berry', 'yarn up vite'],
  ['pnpm', 'pnpm update vite --latest'],
  ['bun', '']
]

describe('upgrade', () => {
  it.each(upgradeCases)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm upgrade vite --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('upgrade --save-exact', () => {
  it.each([
    ['npm', 'npm add vite@latest --save-exact'],
    ['yarn@classic', 'yarn upgrade vite --exact --latest'],
    ['yarn@berry', 'yarn up vite --exact'],
    ['pnpm', 'pnpm update vite --save-exact --latest'],
    ['bun', '']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm upgrade vite --save-exact --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('upgrade --global', () => {
  it.each([
    ['npm', 'npm add vite@latest --global'],
    ['yarn@classic', 'yarn global upgrade vite --latest'],
    ['yarn@berry', 'yarn global up vite'],
    ['pnpm', 'pnpm update vite --global --latest'],
    ['bun', '']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm upgrade vite --global --test ${pkg}`)
    expect(result).toBe(expected)
  })
})
