import {createDefaultPreset} from 'ts-jest'
import type {Config} from '@jest/types'
import {defaults} from 'jest-config'

const tsJestTransformCfg = createDefaultPreset().transform;
const config: Config.InitialOptions = {
  rootDir: "app/tests",
  testEnvironment: "node",
  moduleDirectories: [...defaults.moduleDirectories, 'bower-components'],
  transform: {
    ...tsJestTransformCfg
  }
}
export default config