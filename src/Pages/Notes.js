import React from 'react'
import NoteBox from '../Components/NoteBox'
function Notes(props) {
  return (
    <div className='contactsContainer'>
      {Array(12).fill("a").map((note, index) => (
        <NoteBox
          index={index}
          openMenu={props.openMenu}
        ></NoteBox>
      ))}
    </div>
  )
}

export default Notes