import { InvalidArgumentError } from 'commander'

export const parseIntArgument = v => {
  const parsed = parseInt(v)
  if (isNaN(parsed)) throw new InvalidArgumentError('Not a valid number')
  return parsed
}
