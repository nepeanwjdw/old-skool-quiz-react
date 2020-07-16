import React from 'react'

const HighestAndLowestPoints = players => {
  const arr = []

  const obj = {
    highest: null,
    lowest: null
  }

  for (const value of Object.values(players)) {
    arr.push(value.points)
  }

  const distinct = [...new Set(arr)].sort((a, b) => a - b)

  if (distinct.length > 1) {
    const _0 = arr.filter(point => distinct[0] === point).length
    const _1 = arr.filter(point => distinct[1] === point).length
    const _2 = arr.filter(point => distinct[2] === point).length

    const _2ndLast = _0 > 2 || _0 + _1 > 4
    const _3rdLast = _0 + _1 > 2 || _0 + _1 + _2 > 4

    obj.highest = distinct.pop()
    obj.lowest = _3rdLast ? distinct[2] : _2ndLast ? distinct[1] : distinct[0]
  }

  return obj
}

const NameCellsFactory = (players, colour) => {
  const { highest, lowest } = HighestAndLowestPoints(players)

  const arr = []

  for (const [key, value] of Object.entries(players)) {
    let className

    if (colour && (highest || lowest)) {
      if (highest === value.points) {
        className = 'highlight-yellow'
      }

      if (lowest >= value.points) {
        className = 'highlight-pink'
      }
    }

    arr.push(<td key={key} data-id={key}><span className={className}>{value.name}</span></td>)
  }

  return arr
}

export default NameCellsFactory
