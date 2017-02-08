// @flow

/* eslint-disable import/no-namespace */
import * as scale from "d3-scale"
import * as shape from "d3-shape"
import * as d3Array from "d3-array"
/* eslint-enable import/no-namespace */

const d3 = {
  scale,
  shape,
}

// Declare types of SVG funcs arguments
type SvgPathFuncArgsType = {
  data: {
    time: number,
    value: number
  }[],
  xAccessor: Function,
  yAccessor: Function,
  distanceBetweenTwoPoints: number,
  maxAllowedAreaHeight: number,
}

/**
 * Creates a area graph SVG path that we can then use to render in our
 * React Native application with ART.
 */
export function createArea({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaHeight,
}:SvgPathFuncArgsType): string {
  if (data.length === 0) {
    return ""
  }

  const lastDatum = data[data.length - 1]

  const totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints

  const scaleX = createScaleX(
    data[0].time,
    lastDatum.time,
    totalWidth,
  )

  // Collect all y values.
  const allYValues = data.reduce((all, datum) => {
    all.push(yAccessor(datum))
    return all
  }, [])
  // Get the min and max y value.
  const extentY = d3Array.extent(allYValues)
  const scaleY = createScaleY(0, extentY[1], maxAllowedAreaHeight)

  const areaShape = d3.shape.area()
    .x((d) => scaleX(xAccessor(d)))
    .y0(maxAllowedAreaHeight)
    .y1((d) => scaleY(yAccessor(d)))

  return areaShape(data)
}

/**
 * Creates a line graph SVG path that we can then use to render in our
 * React Native application with ART.
 */
export function createLine({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaHeight,
}:SvgPathFuncArgsType): string {
  if (data.length === 0) {
    return ""
  }

  const lastDatum = data[data.length - 1]

  const totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints

  const scaleX = createScaleX(
    data[0].time,
    lastDatum.time,
    totalWidth,
  )

  const lastValue = lastDatum.value * 1

  // Get the min and max y value.
  const extentY = d3Array.extent(data, yAccessor)
  let deviation = calcYValueDeviation(extentY[0], extentY[1], lastValue)
  if (deviation === 0) {
    deviation = lastValue
  }
  const minYValue = (lastValue - deviation).toFixed(6)
  const maxYValue = (lastValue + deviation).toFixed(6)
  const scaleY = createScaleY(minYValue, maxYValue, maxAllowedAreaHeight)

  const areaShape = d3.shape.line()
    .x((d) => scaleX(xAccessor(d)))
    .y((d) => scaleY(yAccessor(d)))

  return areaShape(data)
}

// This function should calculate the so called "price deviation", which is
// the intended size (in pips) from the current price to the vertical edges
// of the window.
function calcYValueDeviation(minValue, maxValue, lastValue) {
  const padding = 1.25
  return parseFloat(
    (Math.max(maxValue - lastValue, lastValue - minValue) * padding)
      .toFixed(6)
  )
}

/**
 * Creates a circle SVG path that we can then use to render in our
 * React Native application with ART.
 */
type CreateCircleArgsType = {
  x: number,
  y: number,
  size: number,
}
export function createCircle({
  x,
  y,
  size,
}:CreateCircleArgsType = { x: 0, y: 0, size: 30 }): string {
  return [
    `M${(x - size)},${y}`,
    `A ${size} ${size} 0 0 1 ` + (x + size) + " " + y,
    `A ${size} ${size} 0 0 1 ` + (x - size) + " " + y,
  ].join(" ")
}

/**
 * Create an x-scale.
 */
function createScaleX(start, end, width) {
  return d3.scale.scaleTime()
    .domain([ start, end ])
    .range([ 0, width ])
}

/**
 * Create a y-scale.
 */
function createScaleY(minY, maxY, height) {
  return d3.scale.scaleLinear()
    .domain([ minY, maxY ])
    // We invert our range so it outputs using the axis that React uses.
    .range([ height, 0 ])
}
