import * as core from '@actions/core'
import { exec } from './exec'
import { asyncForEach } from './utils'
import {
  getInputs,
  getPullArgs,
  getPushArgs,
  getTagArgs,
  Inputs
} from './context'

export async function run(): Promise<void> {
  try {
    core.startGroup(`Docker info`)
    await exec('docker', ['version'])
    await exec('docker', ['info'])
    core.endGroup()

    const inputs: Inputs = getInputs()

    await asyncForEach(inputs.destinations, async (destination: string) => {
      core.info(`Pulling...`)

      const pullArgs = getPullArgs(inputs.src)

      let res = await exec('docker', pullArgs)

      if (res.stderr !== '' && !res.success) {
        throw new Error(
          `docker call failed with: ${res.stderr.match(/(.*)\s*$/)![0]}`
        )
      }

      const tagArgs = getTagArgs(inputs.src, destination)

      res = await exec('docker', tagArgs)

      if (res.stderr !== '' && !res.success) {
        throw new Error(
          `docker call failed with: ${res.stderr.match(/(.*)\s*$/)![0]}`
        )
      }

      const pushArgs = getPushArgs(destination)

      res = await exec('docker', pushArgs)
      if (res.stderr !== '' && !res.success) {
        throw new Error(
          `docker call failed with: ${res.stderr.match(/(.*)\s*$/)![0]}`
        )
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    core.setFailed(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
