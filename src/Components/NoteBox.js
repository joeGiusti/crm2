import React, {useEffect} from 'react'
import "../Styles/Notes.css"

function NoteBox(props) {
    useEffect(()=>{
        setTimeout(() => {
          var element = document.getElementById("note"+props.index)
          if(element) 
              element.classList.add("blueGlow")
        }, props.index * 250); 
    },[])

  return (
    <div className='hoverBox noteBox' key={"note"+props.index} id={"note"+props.index} onClick={props.openMenu}>
          <div className='noteTitle'>Title</div>
          <div className='notePreview'>note preview</div>
    </div>
  )
}

export default NoteBox