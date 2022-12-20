import React, { useEffect, useRef } from 'react'
import "../Styles/CalendarLog.css"

function CalendarLog(props) {
    
  const elementStartPos = useRef({x: 20, y: 80})
  const mouseStartPos = useRef({x: 20, y: 80})
  const moving = useRef(false)
  const first = useRef(true)
  const logBox = useRef()

  useEffect(()=>{
    if(first.current){
      setUpEventListeners()
      first.current = false
    }
  },[])

  function setUpEventListeners(){
    logBox.current.addEventListener("dragstart", event => {
      dragStart(event)
    })
    logBox.current.addEventListener("dragend", event => {
      dragEnd(event)
    })
    
    return
   
    window.addEventListener("mousemove", event => {

      moveElement(event)

    })
    logBox.current.addEventListener("mousedown", event => {

      startMove(event)

    })
    logBox.current.addEventListener("mouseup", event => {
      console.log("mouseup")
      stopMove(event)

    })
    logBox.current.addEventListener("mouseleave", event => {

      console.log("mouseleave")
      //stopMove(event)

    })
  }

  function dragStart(_event){
    // get initial positions
    // elementStartPos.current = {
    //   x: Number.parseInt(logBox.current.style.top.replace("px","")),
    //   y: Number.parseInt(logBox.current.style.left.replace("px",""))
    // }
    mouseStartPos.current ={x: _event.screenX, y: _event.screenY}
    console.log("==============================")
    console.log("element start position:")
    console.log(elementStartPos.current)
    console.log("mouse start position:")
    console.log(mouseStartPos.current)

  }
  function dragEnd(_event){
    // calculate deltas
    const deltaX = _event.screenX - mouseStartPos.current.x
    const deltaY = _event.screenY - mouseStartPos.current.y

    // Log positions
    console.log("mouse end posiiton: x: "+_event.screenX+" y: "+_event.screenY)
    // console.log(mouseStartPos.current.x + " to " + _event.screenX + " diff: " + deltaX)
    // console.log(mouseStartPos.current.y + " to " + _event.screenY + " diff: " + deltaY)
    // console.log("element start position: ")
    // console.log(elementStartPos.current)

    // Calculate new positions
    const newLeft = elementStartPos.current.x + deltaX
    const newTop = elementStartPos.current.y + deltaY
    console.log("element new position: "+(elementStartPos.current.x + deltaX)+"px "+(elementStartPos.current.y + deltaY)+"px  ")
    
    // adjust element style
    logBox.current.style.top = newTop+"px"
    logBox.current.style.left = newLeft+"px"

    elementStartPos.current = {x: elementStartPos.current.x + deltaX, y: elementStartPos.current.y + deltaY}
    return
    
  }

  function startMove(_event){

    moving.current = true
    mouseStartPos.current = {x: _event.clientX, y: _event.clientY}
 
  }
  function stopMove(_event){
    console.log("mouseup")
    console.log(_event)
    moving.current = false

    // calculate delta
    const deltaX = _event.clientX - mouseStartPos.current.x
    const deltaY = _event.clientY - mouseStartPos.current.y

    // get the current style offsets
    console.log(logBox.current.style.top)
    console.log(logBox.current.style.left)


    // set style based on logBox start position and delta

  }
  function moveElement(_event){
    if(!moving.current)
      return

    // calculate delta
    const deltaX = _event.clientX - mouseStartPos.current.x
    const deltaY = _event.clientY - mouseStartPos.current.y

    // get the current style offsets
    console.log(Number.parseInt(logBox.current.style.top.replace("px","")))
    console.log(Number.parseInt(logBox.current.style.left.replace("px","")))

    console.log("moving element")
    console.log(_event)

  }

  return (
    <div className='calendarLog' draggable={true} ref={logBox} style={{top:"80px", left:"20px"}}>
      <div className='calendarLogTopBar'></div>
        {props.hoverDate ?
            props.hoverDate
            :
            <div>
                No hover date
            </div>
        }
    </div>
  )
}

export default CalendarLog