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
  maxAllowedAreaWidth: number,
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
  maxAllowedAreaWidth,
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
  if (totalWidth > maxAllowedAreaWidth) {
    // totalWidth = maxAllowedAreaWidth
  }

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
  maxAllowedAreaWidth,
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
  if (totalWidth > maxAllowedAreaWidth) {
    // totalWidth = maxAllowedAreaWidth
  }

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

  const areaShape = d3.shape.line()
    .x((d) => scaleX(xAccessor(d)))
    .y((d) => scaleY(yAccessor(d)))

  return areaShape(data)
}

/**
 * Get coordinates of last data point
 */
export function getCoordinatesOfLastItem({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaWidth,
  maxAllowedAreaHeight,
}:SvgPathFuncArgsType): { x: number, y: number } {
  if (data.length === 0) {
    return { x: 0, y: 0 }
  }

  const lastDatum = data[data.length - 1]

  const totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints
  if (totalWidth > maxAllowedAreaWidth) {
    // totalWidth = maxAllowedAreaWidth
  }

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

  return {
    x: scaleX(xAccessor(lastDatum)),
    y: scaleY(yAccessor(lastDatum)),
  }
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
    .domain([ minY, maxY ]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([ height, 0 ])
}
