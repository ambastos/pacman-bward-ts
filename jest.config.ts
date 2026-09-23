import {createDefaultPreset} from 'ts-jest'
import type {Config} from '@jest/types'
import {defaults} from 'jest-config'

const tsJestTransformCfg = createDefaultPreset().transform;
const config: Config.InitialOptions = {
  rootDir: "app/tests",
  testEnvironment: "node",
  moduleDirectories: [...defaults.moduleDirectories, 'bower-components'],
  moduleNameMapper: {
    '^(\\.\\./(scripts|mods|@types|style)/.*)\\.js$': '$1.ts',
  },
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }],
  }
}
export default config