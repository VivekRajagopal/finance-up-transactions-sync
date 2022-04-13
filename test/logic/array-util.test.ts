import { slicingWindows } from '../../src/logic/array-util'

describe('array-util', () => {
  test('empty array', () => {
    const inputArray: number[] = []
    const size = 5

    const result = slicingWindows(inputArray, size)

    expect(result).toStrictEqual([[]])
  })

  test('0 size throws', () => {
    const inputArray: number[] = [3, 4]
    const size = 0

    expect(() => slicingWindows(inputArray, size)).toThrow()
  })

  test('larger size than array returns wrapped array', () => {
    const inputArray: number[] = [3, 4, 6]
    const size = 8

    const result = slicingWindows(inputArray, size)
    expect(result).toStrictEqual([[3, 4, 6]])
  })

  test('size of 1', () => {
    const inputArray: number[] = [3, 4, 6, 1, 2, 3, 456, 456, 0]
    const size = 1

    const result = slicingWindows(inputArray, size)
    expect(result).toStrictEqual([
      [3],
      [4],
      [6],
      [1],
      [2],
      [3],
      [456],
      [456],
      [0],
    ])
  })

  test('size divides into array', () => {
    const inputArray: number[] = [3, 4, 6, 1, 2, 3, 456, 456, 0]
    const size = 3

    const result = slicingWindows(inputArray, size)
    expect(result).toStrictEqual([
      [3, 4, 6],
      [1, 2, 3],
      [456, 456, 0],
    ])
  })

  describe('size does not divide into array', () => {
    test('array length 9, window size 4', () => {
      const inputArray: number[] = [3, 4, 6, 3, 4, 6, 3, 4, 6]
      const size = 4

      const result = slicingWindows(inputArray, size)
      expect(result).toStrictEqual([[3, 4, 6, 3], [4, 6, 3, 4], [6]])
    })

    test('array length 5, window size 4', () => {
      const inputArray: number[] = [3, 4, 6, 3, 4]
      const size = 4

      const result = slicingWindows(inputArray, size)
      expect(result).toStrictEqual([[3, 4, 6, 3], [4]])
    })

    test('array length 9, window size 5', () => {
      const inputArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const size = 5

      const result = slicingWindows(inputArray, size)
      expect(result).toStrictEqual([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9],
      ])
    })
  })
})
