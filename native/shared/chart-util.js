/* eslint-disable import/no-namespace */
import * as scale from "d3-scale"
import * as shape from "d3-shape"
import * as d3Array from "d3-array"
/* eslint-enable import/no-namespace */

const d3 = {
  scale,
  shape,
}

/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
function createScaleX(start, end, width) {
  return d3.scale.scaleTime()
    .domain([ start, end ])
    .range([ 0, width ])
}

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
function createScaleY(minY, maxY, height) {
  return d3.scale.scaleLinear()
    .domain([ minY, maxY ]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([ height, 0 ])
}

/**
 * Creates a area graph SVG path that we can then use to render in our
 * React Native application with ART.
 * @param {Array.<Object>} options.data Array of data we'll use to create
 *   our graphs from.
 * @param {function} xAccessor Function to access the x value from our data.
 * @param {function} yAccessor Function to access the y value from our data.
 * @param {number} width Width our graph will render to.
 * @param {number} distance between two points
 * @param {number} width of the area
 * @param {number} height of the area
 * @return {string} SVG path
 */
export function createArea({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaWidth,
  maxAllowedAreaHeight,
}) {
  const lastDatum = data[data.length - 1]

  let totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints
  if (totalWidth > maxAllowedAreaWidth) {
    totalWidth = maxAllowedAreaWidth
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
 * @param {Array.<Object>} options.data Array of data we'll use to create
 *   our graphs from.
 * @param {function} xAccessor Function to access the x value from our data.
 * @param {function} yAccessor Function to access the y value from our data.
 * @param {number} width Width our graph will render to.
 * @param {number} distance between two points
 * @param {number} width of the area
 * @param {number} height of the area
 * @return {string} SVG path
 */
export function createLine({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaWidth,
  maxAllowedAreaHeight,
}) {
  const lastDatum = data[data.length - 1]

  let totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints
  if (totalWidth > maxAllowedAreaWidth) {
    totalWidth = maxAllowedAreaWidth
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
 * @param {Array.<Object>} options.data Array of data we'll use to create
 *   our graphs from.
 * @param {function} xAccessor Function to access the x value from our data.
 * @param {function} yAccessor Function to access the y value from our data.
 * @param {number} width Width our graph will render to.
 * @param {number} distance between two points
 * @param {number} width of the area
 * @param {number} height of the area
 * @return {Object} Object with x and y coordinates
 */
export function getCoordinatesOfLastItem({
  data,
  xAccessor,
  yAccessor,
  distanceBetweenTwoPoints,
  maxAllowedAreaWidth,
  maxAllowedAreaHeight,
}) {
  const lastDatum = data[data.length - 1]

  let totalWidth =
      data.length
    * distanceBetweenTwoPoints
    - distanceBetweenTwoPoints
  if (totalWidth > maxAllowedAreaWidth) {
    totalWidth = maxAllowedAreaWidth
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
 * @param {number} width Width our graph will render to.
 * @return {String} String with SVG path
 */
export function createCircle({
  size,
} = { size: 30 }) {
  return d3.shape.symbol()
    .size(size)()
}
