const SNAP_THRESH = 3
const MOUSE_POWER = 3
export const VERTICAL_LINE = "vertical"
export const HORIZONTAL_LINE = "horiznoral"

export const getLayerCoordsOfPoints = (dimentions) => {
  const { x, y, width, height } = dimentions
  const startPoints = {
    x,
    y,
  }
  const endPoints = {
    x: x + width,
    y: y + height,
  }

  const centerPoints = {
    x: x + width / 2,
    y: y + height / 2,
  }

  return [startPoints, endPoints, centerPoints]
}

const removeGuideLine = (directionLine, coord) => {
  const lines = document.querySelectorAll(`.${directionLine}`)

  lines.forEach((line) => {
    if (directionLine + coord !== line.id) {
      document.getElementById(line.id).remove()
    }
  })
}

const drawGuideLineCanvascenterPoints = (
  directionLine,
  coord,
  canvasDimentions
) => {
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

  const coordsPointsDragLayers = getLayerCoordsOfPoints(rect)
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

  const snapPoints = Array.from(allLayers).reduce(
    (acc, layer) => {
      if (!layer.classList.contains("draggingLayer")) {
        const rect = layer.getBoundingClientRect()
        const layerSnapPoints = getLayerCoordsOfPoints(rect)

        layerSnapPoints.forEach((coords) => {
          acc.x.push(coords.x)
          acc.y.push(coords.y)
        })
      }
      return acc
    },
    { x: [], y: [] }
  )

  return snapPoints
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

  const updateElementStyle = (value) => {
    if (lineDirection === "vertical") {
      element.style.left = `${value}px`
    } else {
      element.style.top = `${value}px`
    }
  }

  if (Math.abs(diffMouseAxes) < MOUSE_POWER) {
    dragPointsArr.forEach((dragAxes) => {
      if (Math.abs(dragAxes - canvasDimentionHalf) < SNAP_THRESH) {
        updateElementStyle(rectAxes - (dragAxes - canvasDimentionHalf))
        drawGuideLineCanvascenterPoints(
          lineDirection,
          coordAxes,
          canvasDimention
        )
      } else if (dragAxes < SNAP_THRESH) {
        updateElementStyle(0)
        drawGuideLineCanvasStart(lineDirection, coordAxes, canvasDimention)
      } else if (canvasDimention.width - dragAxes < SNAP_THRESH) {
        updateElementStyle(rectAxes - (dragAxes - canvasDimention.width))
        drawGuideLineCanvasEnd(lineDirection, coordAxes, canvasDimention)
      } else {
        snapPointsArr.forEach((snapAxes) => {
          if (Math.abs(dragAxes - snapAxes) < SNAP_THRESH) {
            updateElementStyle(rectAxes - (dragAxes - snapAxes))
            drawGuideLineLayers(lineDirection, snapAxes, canvasDimention)
          }
        })
      }
    })
  }
}
