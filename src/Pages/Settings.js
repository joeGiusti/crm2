import React from 'react'
import { useRef } from 'react'

function Settings(props) {
  
  const youtubeRef = useRef()
  
  function setYoutubeBackground(){
    console.log("setting yourbe background "+youtubeRef.current.value)
    console.log("https://www.youtube.com/embed/"+youtubeRef.current.value+"?autoplay=1&volume=0")
    props.setYoutubeVideoId(youtubeRef.current.value)
  }

  return (
    <div className='box pageBox'>
      <input ref={youtubeRef} placeholder='Youbue Video ID'></input>
      <button onClick={setYoutubeBackground}>Open Youtube Background</button>
      Settings
    </div>
  )
}

export default Settings