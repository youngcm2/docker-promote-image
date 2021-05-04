import csvparse from 'csv-parse/lib/sync'
import * as core from '@actions/core'
import {issueCommand} from '@actions/core/lib/command'

export interface Inputs {
  src: string
  destinations: string[]
}

export async function getInputs(): Promise<Inputs> {
  return {
    src: core.getInput('src'),
    destinations: await getInputList('destinations')
  }
}

export async function getPullArgs(src: string): Promise<string[]> {
  const args: string[] = ['pull']

  args.push(src)

  return args
}

export async function getTagArgs(
  src: string,
  destination: string
): Promise<string[]> {
  const args: string[] = ['tag']
  if (src) {
    args.push(src)
  }

  args.push(destination)

  return args
}

export async function getPushArgs(destination: string): Promise<string[]> {
  const args: string[] = ['push']

  args.push(destination)

  return args
}

export async function getInputList(
  name: string,
  ignoreComma?: boolean
): Promise<string[]> {
  const res: string[] = []

  const items = core.getInput(name)
  if (items === '') {
    return res
  }

  for (const output of (await csvparse(items, {
    columns: false,
    relaxColumnCount: true,
    skipLinesWithEmptyValues: true
  })) as string[][]) {
    if (output.length === 1) {
      res.push(output[0])
      continue
    } else if (!ignoreComma) {
      res.push(...output)
      continue
    }
    res.push(output.join(','))
  }

  return res.filter(item => item).map(pat => pat.trim())
}

// FIXME: Temp fix https://github.com/actions/toolkit/issues/777
export function setOutput(name: string, value: unknown): void {
  issueCommand('set-output', {name}, value)
}
