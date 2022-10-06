const SNAP_THRESH = 5
const MOUSE_POWER = 3
export const VERTICAL_LINE = "vertical"
export const HORIZONTAL_LINE = "horiznoral"

export const getLayerCoordsOfPoints = (x, y, width, height) => {
  x = Math.round(x)
  y = Math.round(y)
  width = Math.round(width)
  height = Math.round(height)
  const v1 = {
    x,
    y,
  }
  const v2 = {
    x: x + width,
    y: y + height,
  }

  const center = {
    x: x + width / 2,
    y: y + height / 2,
  }
  return [v1, v2, center]
}

const removeGuideLine = (directionLine, coord) => {
  const lines = document.querySelectorAll(`.${directionLine}`)
  lines.forEach((line) => {
    if (directionLine + coord !== line.id) {
      document.getElementById(line.id).remove()
    }
  })
}

const drawGuideLineCanvasCenter = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top =
    directionLine === "vertical" ? 0 : canvasDimentions.height / 2 + "px"
  line.style.left =
    directionLine === "vertical" ? canvasDimentions.width / 2 + "px" : 0
  line.style.height =
    directionLine === "vertical" ? canvasDimentions.height + "px" : 0
  line.style.width =
    directionLine === "vertical" ? 0 : canvasDimentions.width + "px"
  line.style.border = "1px dashed #FF9B7B "
  root.append(line)
}

const drawGuideLineLayers = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = directionLine === "vertical" ? 0 : coord + "px"
  line.style.left = directionLine === "vertical" ? coord + "px" : 0
  line.style.height =
    directionLine === "vertical" ? canvasDimentions.height + "px" : 0
  line.style.width =
    directionLine === "vertical" ? 0 : canvasDimentions.width + "px"
  line.style.border = "1px dashed #777AFF"
  root.append(line)
}

const drawGuideLineCanvasStart = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = 0
  line.style.left = 0
  line.style.height =
    directionLine === "vertical" ? canvasDimentions.height + "px" : 0
  line.style.width =
    directionLine === "vertical" ? 0 : canvasDimentions.width + "px"
  line.style.border = "1px solid #900C3F"
  root.append(line)
}

const drawGuideLineCanvasEnd = (directionLine, coord, canvasDimentions) => {
  if (document.getElementById(directionLine + coord)) {
    return
  }
  const root = document.getElementById("root")
  const line = document.createElement("div")
  line.style.position = "absolute"
  line.className = directionLine
  line.id = directionLine + coord
  line.style.top = "vertical" ? 0 : canvasDimentions.width + "px"
  line.style.left = "vertical" ? canvasDimentions.width - 2 + "px" : 0
  line.style.height =
    directionLine === "vertical" ? canvasDimentions.height - 2 + "px" : 0
  line.style.width =
    directionLine === "vertical" ? 0 : canvasDimentions.width + "px"
  line.style.border = "1px solid #900C3F"
  root.append(line)
}

export const getDraggingPointsCoords = (rect) => {
  const horizontal = []
  const vertical = []

  const coordsPointsDragLayers = getLayerCoordsOfPoints(
    rect.left,
    rect.top,
    rect.width,
    rect.height
  )
  coordsPointsDragLayers.forEach((coords) => {
    horizontal.push(coords.x)
    vertical.push(coords.y)
  })

  return {
    x: horizontal,
    y: vertical,
  }
}

export const getSnapPointsCoords = () => {
  const allLayers = document.querySelectorAll(".layer")
  const horizontal = []
  const vertical = []

  allLayers.forEach((layer) => {
    if (layer.className.includes("draggingLayer") === false) {
      const el = layer.getBoundingClientRect()
      const layersCoordsOfPoints = getLayerCoordsOfPoints(
        el.left,
        el.top,
        el.width,
        el.height
      )
      layersCoordsOfPoints.forEach((coords) => {
        horizontal.push(coords.x)
        vertical.push(coords.y)
      })
    }
  })

  return {
    x: horizontal,
    y: vertical,
  }
}
export const getGuidLines = (
  dragPointsArr,
  snapPointsArr,
  canvasDimentionHalf,
  diffMouseAxes,
  canvasDimention,
  e,
  rectAxes,
  lineDirection,
  coordAxes
) => {
  const element = e.target
  removeGuideLine(lineDirection, coordAxes)
  dragPointsArr.forEach((dragAxes) => {
    if (
      Math.abs(dragAxes - canvasDimentionHalf) < SNAP_THRESH &&
      Math.abs(diffMouseAxes) < MOUSE_POWER
    ) {
      lineDirection === "vertical"
        ? (element.style.left =
            rectAxes - (dragAxes - canvasDimentionHalf) + "px")
        : (element.style.top =
            rectAxes - (dragAxes - canvasDimentionHalf) + "px")

      drawGuideLineCanvasCenter(lineDirection, coordAxes, canvasDimention)
    }
    if (dragAxes < SNAP_THRESH && Math.abs(diffMouseAxes) < MOUSE_POWER) {
      lineDirection === "vertical"
        ? (element.style.left = 0)
        : (element.style.top = 0)
      drawGuideLineCanvasStart(lineDirection, coordAxes, canvasDimention)
    }
    if (
      canvasDimention.width - dragAxes < SNAP_THRESH &&
      Math.abs(diffMouseAxes) < MOUSE_POWER
    ) {
      lineDirection === "vertical"
        ? (element.style.left =
            rectAxes - (dragAxes - canvasDimention.width) + "px")
        : (element.style.top =
            rectAxes - (dragAxes - canvasDimention.width) + "px")
      drawGuideLineCanvasEnd(lineDirection, coordAxes, canvasDimention)
    }
    snapPointsArr.forEach((snapAxes) => {
      if (
        Math.abs(dragAxes - snapAxes) < SNAP_THRESH &&
        Math.abs(diffMouseAxes) < MOUSE_POWER
      ) {
        lineDirection === "vertical"
          ? (element.style.left = rectAxes - (dragAxes - snapAxes) + "px")
          : (element.style.top = rectAxes - (dragAxes - snapAxes) + "px")
        drawGuideLineLayers(lineDirection, snapAxes, canvasDimention)
      }
    })
  })
}
