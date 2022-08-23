import React, { useEffect, useState } from 'react'
import NoteBox from '../Components/NoteBox'
import {onValue, ref, set, push, update} from 'firebase/database'

function Notes(props) {

  var sampleNoteTitle = {
    title: "",    
    key: "",
    savedDate: "",
    createdDate: "",
  }
  var sampleNoteData = {
    title: "",
    content: "",
    key: "",
    savedDate: "",
    createdDate: "",
  }
  var sampleTitleArray = [
    sampleNoteTitle,
    sampleNoteTitle,
    sampleNoteTitle,
    sampleNoteTitle,
  ]
  // Determines weather a note is being displayed
  const [viewNote, setViewNote] = useState(false)
  const [noteTitles, setNoteTitles] = useState(sampleTitleArray)
  const [noteData, setNoteData] = useState(sampleTitleArray)
  
  useEffect(()=>{

    loadNoteTitles()

  }, [])

  // Put sample data and load the note
  function newNote(){
    setNoteData({
      title: "",
      content: "",
      key: "",
      savedDate: "",
      createdDate: "",
      newNote: true
    })
    setViewNote(true)
  }

  // Load titles, map them
  function loadNoteTitles(){

    onValue(ref(props.firebase.db, "noteTitles"), snap => {

      // Spread the json of jsons into an array and put it in state to be mapped
      setNoteTitles(...snap.val())

      // For each title save the data and key      
      // var tempTitleArray = []
      // snap.forEach(noteTitleSnap => {
      //   var tempNoteTitle = noteTitleSnap
      //   tempNoteTitle.key = snap.key
      //   tempTitleArray.push(tempNoteTitle)
      // })
      // setNoteTitles(tempTitleArray)

    })

  }

  // Load note data, open viewer to display it
  function loadNote(_noteId){

    onValue(ref(props.firebase.db, "noteData"), snap => {
      
      // Get the date, put in state
      setNoteData(snap.val())  

      // Get the date, save the key, put in state
      // var tempNoteData = snap.val
      // tempNoteData.key = snap.key      
      // setNoteData(tempNoteData)  
      
      // open the viewer
      setViewNote(true) 

    })

  }  

  function saveNote(){

    // get typed note data
    var title = document.getElementById("noteTitleInput").value
    var note = document.getElementById("noteArea").value

    var noteDataTemp = {
      title: title,  
      content: note,      
    }
    var noteTitleTemp = {      
      title: title,        
    }

    updateNote(noteDataTemp, noteTitleTemp)

  }

  function updateNote(_noteData, _noteTitle){
    // save it to the db
    update(ref(props.firebase.db, "noteData/"+noteData.key), _noteData)
    update(ref(props.firebase.db, "noteTitles/"+noteData.key), _noteTitle)
  }

  function saveNewNote(){
    var newRef =  push(ref(props.firebase.db, "noteTitles/"))
    
    var title = document.getElementById("noteTitleInput").value
    var note = document.getElementById("noteArea").value

    var newNoteData = {
      title: title,
      content: note,
      key: newRef.key,      
    }
    var newTitleData = {
      title: title,      
      key: newRef.key,      
    }
    
    updateNote(newNoteData, newTitleData)

    // Update note date for future saves
    var tempNoteData = noteData
    tempNoteData.newNote = false
    tempNoteData.key = newRef.key
    setNoteData(tempNoteData)
  }
  
  function closeNoteViewer(){

    // Save the data
    saveButton()    

    // Close the window
    setViewNote(false)

  }

  function saveButton(){
    
    // Call function depending on if it is a new note
    if(noteData.newNote)
      saveNewNote()
    else
      saveNote()
  }

  function deleteNote(){

  }

  function revertNote(){

  }

  return (
    <div className='contactsContainer'>
      <div className='noteBox' onClick={newNote}>
          New Note
        </div>
      {noteTitles.map((noteTitleData, index) => (
        <div className='noteBox' onClick={()=>loadNote(noteTitleData.key)}>
          {noteTitleData.title}               
        </div>
        // Maybe put it just for the animation effect
        // <NoteBox
        //   noteTitleData={noteTitleData}
        //   loadNote={loadNote}
        //   index={index}
        //   openMenu={props.openMenu}          
        //   setViewNote={setViewNote}
        // ></NoteBox>
      ))}
      {viewNote &&
        <div className='noteViewer'>
          <div className='closeButton' onClick={closeNoteViewer}>x</div>
          <textarea id='noteArea' defaultValue={noteData.content}></textarea>
        </div>
      }
    </div>
  )
}

export default Notes