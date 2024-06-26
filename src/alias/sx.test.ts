import { describe, expect, it } from 'vitest';
import { testCommandResult } from '../../.vitest/helpers';

describe('sx', () => {
  it.each([
    ['npm', 'npx vitest'],
    ['yarn@classic', 'yarn dlx vitest'],
    ['yarn@berry', 'yarn dlx vitest'],
    ['pnpm', 'pnpm dlx vitest'],
    ['bun', 'bunx vitest']
  ])('%s', (pkg, expected) => {
    const result = testCommandResult(`sx vitest --test ${pkg}`)
    expect(result).toBe(expected)
  })
})
