import { useState, useEffect } from "react"
import {
  getSnapPointsCoords,
  getDraggingPointsCoords,
  getGuidLines,
  VERTICAL_LINE,
  HORIZONTAL_LINE,
} from "./functions"
import * as Styled from "./styled"
import "./App.css"
import { NewLayers } from "./layers"

function App() {
  const [layers, setLayers] = useState([])
  const createNewLayers = () => setLayers([...layers, layers.length + 1])

  function mouseDown(e) {
    window.addEventListener("mousemove", mouseMove, false)
    window.addEventListener("mouseup", mouseUp, false)
    const element = e.target

    let clickX = e.clientX
    let clickY = e.clientY
    let iinitialX = e.clientX
    let iinitialY = e.clientY
    const list = element.classList
    list.add("draggingLayer")

    const { top: initialTop, left: initialLeft } = element.style

    function mouseMove(e) {
      const deltaX = clickX - e.clientX
      const deltaY = clickY - e.clientY
      const diffMouseX = iinitialX - e.clientX
      const diffMouseY = iinitialY - e.clientY
      const rect = element.getBoundingClientRect()
      const snapPoints = getSnapPointsCoords()
      const dragPoints = getDraggingPointsCoords(rect)
      const draggineElementCoords = {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
      }

      const { x, y } = draggineElementCoords

      element.style.left = parseInt(initialLeft) - deltaX + "px"
      element.style.top = parseInt(initialTop) - deltaY + "px"

      iinitialX = e.clientX
      iinitialY = e.clientY

      const canvasDimention = {
        width: parseInt(window.screen.width),
        height: parseInt(window.screen.height),
      }

      const canvasWidthHalf = canvasDimention.width / 2
      const canvasHeightHalf = canvasDimention.height / 2

      getGuidLines(
        dragPoints.x,
        snapPoints.x,
        canvasWidthHalf,
        diffMouseX,
        canvasDimention,
        e,
        rect.left,
        VERTICAL_LINE,
        x
      )

      getGuidLines(
        dragPoints.y,
        snapPoints.y,
        canvasHeightHalf,
        diffMouseY,
        canvasDimention,
        e,
        rect.top,
        HORIZONTAL_LINE,
        y
      )
    }

    function mouseUp() {
      const allLayers = document.querySelectorAll(".layer")
      allLayers.forEach((layer) => {
        layer.classList.remove("draggingLayer")
      })

      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mouseup", mouseUp)
    }
  }

  useEffect(() => {
    layers.map((id) => {
      const element = document.getElementById(id)
      element.addEventListener("mousedown", mouseDown)
    })
  })

  return (
    <>
      <Styled.Button onClick={createNewLayers}> addNewLayer </Styled.Button>

      {layers.map((layer) => {
        return <NewLayers id={layer} key={layer} className={"layer"} />
      })}
    </>
  )
}

export default App
