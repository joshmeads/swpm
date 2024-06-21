import { describe, expect, it } from 'vitest'
import { getSwpmInfo } from './info.js'

describe('getSwpmInfo()', () => {
  it('should return an object literal with project information', async () => {
    const projectInfo = {
      name: '@joshmeads/swpm',
      description: 'Switch Package Manager'
    }
    const versionProperty = 'version'

    const result = await getSwpmInfo()
    const { name, description } = result

    expect({ name, description }).toMatchObject(projectInfo)
    expect(result).toHaveProperty(versionProperty)
  })
})
