import {parse} from 'csv-parse/sync'
import * as core from '@actions/core'
import {issueCommand} from '@actions/core/lib/command'

export interface Inputs {
  src: string
  destinations: string[]
}

export function getInputs(): Inputs {
  return {
    src: core.getInput('src'),
    destinations: getInputList('destinations')
  }
}

export function getPullArgs(src: string): string[] {
  const args: string[] = ['pull']

  args.push(src)

  return args
}

export function getTagArgs(src: string, destination: string): string[] {
  const args: string[] = ['tag']
  if (src) {
    args.push(src)
  }

  args.push(destination)

  return args
}

export function getPushArgs(destination: string): string[] {
  const args: string[] = ['push']

  args.push(destination)

  return args
}

export function getInputList(name: string, ignoreComma?: boolean): string[] {
  const res: string[] = []

  const items = core.getInput(name)
  if (items === '') {
    return res
  }

  const outputs = parse(items, {
    columns: false,
    relaxColumnCount: true,
    skipRecordsWithEmptyValues: true
  }) as string[][]

  for (const output of outputs) {
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
