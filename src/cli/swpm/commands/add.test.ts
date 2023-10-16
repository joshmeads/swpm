import { it, expect, describe } from 'vitest'
import { testCommandResult } from '../../../../.vitest/helpers'

describe('add', () => {
  it.each([
    ['npm', 'npm add vite'],
    ['yarn', 'yarn add vite'],
    ['yarn@berry', 'yarn add vite'],
    ['pnpm', 'pnpm add vite'],
    ['bun', 'bun add vite']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --save-dev', () => {
  it.each([
    ['npm', 'npm add vite --save-dev'],
    ['yarn', 'yarn add vite --dev'],
    ['yarn@berry', 'yarn add vite --dev'],
    ['pnpm', 'pnpm add vite --save-dev'],
    ['bun', 'bun add vite --dev']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-dev --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --save-optional', () => {
  it.each([
    ['npm', 'npm add vite --save-optional'],
    ['yarn', 'yarn add vite --optional'],
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
    ['yarn', 'yarn add vite --peer'],
    ['yarn@berry', 'yarn add vite --peer'],
    ['pnpm', 'pnpm add vite --save-peer'],
    ['bun', ''] // not available
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-peer --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --save-exact', () => {
  it.each([
    ['npm', 'npm add vite --save-exact'],
    ['yarn', 'yarn add vite --exact'],
    ['yarn@berry', 'yarn add vite --exact'],
    ['pnpm', 'pnpm add vite --save-exact'],
    ['bun', 'bun add vite --exact']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --save-exact --test ${pkg}`)
    expect(result).toBe(expected)
  })
})

describe('add --global', () => {
  const voltaCases = [
    ['npm', 'volta install vite'],
    ['yarn', 'volta install vite'],
    ['yarn@berry', 'volta install vite'],
    ['pnpm', 'volta install vite'],
    ['bun', 'volta install vite']
  ]

  const packageCases = [
    ['npm', 'npm add vite --location=global'],
    ['yarn', 'yarn global add vite'],
    ['yarn@berry', 'yarn global add vite'],
    ['pnpm', 'pnpm add vite --global'],
    ['bun', 'bun add vite --global']
  ]

  const voltaVersion = testCommandResult('volta --version')

  it.each(voltaVersion ? voltaCases : packageCases)('%s', (pkg, expected) => {
    const result = testCommandResult(`swpm add vite --global --test ${pkg}`)
    expect(result).toBe(expected)
  })
})