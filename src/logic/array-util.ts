export const slicingWindows = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) {
    throw new Error('size must be greater than 0')
  }

  if (size > array.length) {
    return [array]
  }

  const result = []

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}
