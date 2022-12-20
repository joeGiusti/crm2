import React from 'react'
import { useRef } from 'react'

function Settings(props) {
  
  const youtubeRef = useRef()
  
  function setYoutubeBackground(){
    console.log("setting yourbe background "+youtubeRef.current.value)
    console.log("https://www.youtube.com/embed/"+youtubeRef.current.value+"?autoplay=1&volume=0")
    props.setYoutubeVideoId(youtubeRef.current.value)
  }
 
  const shortcutArray = [
    " Tab + u = Close Sidebar",
    " Tab + i = Open Sidebar",
    " Tab + h = Switch to Calendar",
    " Tab + j = Switch to Contacts",
    " Tab + k = Switch to Log",
    " Tab + l = Switch to Notes",
    " Tab + ; = Switch to Stats",
    " Tab + ' = Switch to Settings",
    " Tab + g = Switch to Scroller",
    " Tab + m = Open new Contact Menu",
    " Tab + n = Open new Event Menu",
    " Tab + , = Open Sidebar and Search",
    " Tab + . = Clear Sidebar Search",
    " Tab + y = Close All Windows",
    " Esc = Close All Windows and Sidebar",
    " ===== ",
    " Contacts Menu",
    " Tab + 1 = Current Contacts",
    " Tab + 2 = Green Contacts",
    " Tab + 3 = All Contacts",
  ] 
      
  return (
    <div className='box pageBox'>
      <input ref={youtubeRef} placeholder='Youbue Video ID'></input>
      <button onClick={setYoutubeBackground}>Open Youtube Background</button>
      Settings
      <div>
        Shortcuts:
        {shortcutArray.map(string => (
          <div>{string}</div>
        ))}
      </div>
    </div>
  )
}

export default Settings