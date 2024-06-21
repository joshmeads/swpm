import { describe, expect, it } from 'vitest'
import { testCommandResult } from '../../../../.vitest/helpers'
import { commandVerification } from '../../../../bin/src/helpers/get'

export const addCases = [
  ['npm', 'npm add vite'],
  ['yarn@classic', 'yarn add vite'],
  ['yarn@berry', 'yarn add vite'],
  ['pnpm', 'pnpm add vite'],
  ['bun', 'bun add vite']
]

describe('add', () => {
  it.each(addCases)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

export const addDevCases = [
  ['npm', 'npm add vite --save-dev'],
  ['yarn@classic', 'yarn add vite --dev'],
  ['yarn@berry', 'yarn add vite --dev'],
  ['pnpm', 'pnpm add vite --save-dev'],
  ['bun', 'bun add vite --dev']
]

describe('add --save-dev', () => {
  it.each(addDevCases)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-dev --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --save-optional', () => {
  it.each([
    ['npm', 'npm add vite --save-optional'],
    ['yarn@classic', 'yarn add vite --optional'],
    ['yarn@berry', 'yarn add vite --optional'],
    ['pnpm', 'pnpm add vite --save-optional'],
    ['bun', 'bun add vite --optional']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-optional --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --save-peer', () => {
  it.each([
    ['npm', 'npm add vite --save-peer'],
    ['yarn@classic', 'yarn add vite --peer'],
    ['yarn@berry', 'yarn add vite --peer'],
    ['pnpm', 'pnpm add vite --save-peer'],
    ['bun', ''] // not available
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-peer --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

export const addSaveExact = [
  ['npm', 'npm add vite --save-exact'],
  ['yarn@classic', 'yarn add vite --exact'],
  ['yarn@berry', 'yarn add vite --exact'],
  ['pnpm', 'pnpm add vite --save-exact'],
  ['bun', 'bun add vite --exact']
]

describe('add --save-exact', () => {
  it.each(addSaveExact)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-exact --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

export const addVoltaCases = [
  ['npm', 'volta install vite'],
  ['yarn@classic', 'volta install vite'],
  ['yarn@berry', 'volta install vite'],
  ['pnpm', 'volta install vite'],
  ['bun', 'volta install vite']
]

export const addPackageCases = [
  ['npm', 'npm add vite --global'],
  ['yarn@classic', 'yarn global add vite'],
  ['yarn@berry', 'yarn global add vite'],
  ['pnpm', 'pnpm add vite --global'],
  ['bun', 'bun add vite --global']
]

const isVoltaInstalled = await commandVerification('volta')

describe('add --global', () => {
  it.each(isVoltaInstalled ? addVoltaCases : addPackageCases)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --global --test ${pkg}`)
    expect(result).toBe(expected)
  })
})
