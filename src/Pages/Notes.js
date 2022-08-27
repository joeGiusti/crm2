import React, { useEffect, useRef, useState } from 'react'
import NoteBox from '../Components/NoteBox'
import {onValue, ref, set, push, update} from 'firebase/database'
import { extractQuerystring } from '@firebase/util'
import moment from 'moment'

function Notes(props) {

  // The date for the note currently being edited 
  const [noteData, setNoteData] = useState(null)
  // The array of note titles {title: string}
  const [notesArray, setNotesArray] = useState([])  
  // Flag state that determines what is displayed
  const [editingNote, setEditingNote] = useState(false)
  // Flag ref to keep track of if a db save is needed
  const updatedSomething = useRef(false)
  
  // Load the notes
  useEffect(()=>{
    // Load the notes
    loadNotes()

  },[])

  // Opens note edit window after loading note data if there is any
  function openNote(_noteKey){

    updatedSomething.current = false

    if(!_noteKey){
      
      // Set a default value
      setNoteData({
        title: "",
        content: "",
        key: null,
      })

      // Open the note editing menu
      setEditingNote(true)

    }else{

      // Load the note data from the db then open the note editing menu
      loadNote(_noteKey)

    }        
  }

  // Checks if save is needed, closes note edit window
  function closeNote(){
    if(updatedSomething.current){

      var title = document.getElementById("noteTitleInput").value
      var content = document.getElementById("noteContentInput").value
      
      saveNote({
        title: title,
        content: content,
        key: noteData.key,
        updateDate: moment().format("YYYY-MM-DD HH:MM")
      })

    }
    setEditingNote(false)
    updatedSomething.current = false
  }

  // If there is something to save eitehr creates a new note in the db, or updates an existing note
  function saveNote(_noteData){

    if(!_noteData.key){

      // push a new note, then save in db with that key
      var newNoteRef = push(ref(props.firebase.current.db, "noteTitles"))
      
      // Put the title in the note titles section of the db
      set(ref(props.firebase.current.db, "noteTitles/"+newNoteRef.key), {
        title: props.StringToNumbers(_noteData.title),
        createdDate: moment().format("YYYY-MM-DD HH:MM"),
        updateDate: moment().format("YYYY-MM-DD HH:MM"),
      })
      
      // Put the title and content in the note data section of the db
      set(ref(props.firebase.current.db, "noteData/"+newNoteRef.key), {
        title: props.StringToNumbers(_noteData.title), 
        content: props.StringToNumbers(_noteData.content),
        createdDate: moment().format("YYYY-MM-DD HH:MM"),
        updateDate: moment().format("YYYY-MM-DD HH:MM"),
      })

    }else{      

      // If there is an exting note update the values
      set(ref(props.firebase.current.db, "noteTitles/"+_noteData.key), {
        title: props.StringToNumbers(_noteData.title),
        updateDate: moment().format("YYYY-MM-DD HH:MM"),
      })
      set(ref(props.firebase.current.db, "noteData/"+_noteData.key), {
        title: props.StringToNumbers(_noteData.title), 
        content: props.StringToNumbers(_noteData.content),
        updateDate: moment().format("YYYY-MM-DD HH:MM"),
      })

    }

  }

  // Moves the note data to an archive
  function deleteNote(_noteKey){
    if(!_noteKey)
      return
    set(ref(props.firebase.current.db, "noteTitles/"+_noteKey), null)
    set(ref(props.firebase.current.db, "noteData/"+_noteKey), null)

    set(ref(props.firebase.current.db, "noteArchive/"+_noteKey), {
      title: document.getElementById("noteTitleInput").value,
      content: document.getElementById("noteContentInput").value,     
      deleteDate: moment().format("YYYY-MM-DD HH:MM")
    })
    
    setEditingNote(false)
  }

  // Loads note titles from /noteTitles
  function loadNotes(){

    // Get the list of data from the db
    onValue(ref(props.firebase.current.db, "/noteTitles"), snapshotResponse => {              

      var tempArray = []     
      for( var key in snapshotResponse.val()){
        
        // Get the data (title and key)
        var tempTitleData = {} 
        tempTitleData.title = props.NumbersToString(snapshotResponse.val()[key].title)
        tempTitleData.key = key  
        
        // Put it in the array
        tempArray.push(tempTitleData)
      }
      
      // Put the array in state
      setNotesArray(tempArray)
    })


  }

  // Loads a note from /noteData
  function loadNote(_noteKey){
    console.log("loading note")
    console.log(_noteKey)
    if(!_noteKey)
      return
    onValue(ref(props.firebase.current.db, "noteData/"+_noteKey), noteSnap =>{      

      // Containes key: {title: string, content: string}
      var tempNoteData = noteSnap.val()

      console.log(tempNoteData)
      
      // Convert the data
      tempNoteData.title = props.NumbersToString(tempNoteData.title)
      tempNoteData.content = props.NumbersToString(tempNoteData.content)
      tempNoteData.key = _noteKey

      // Save in state to be displayed.
      setNoteData(tempNoteData)

      // Open the note edit menu
      setEditingNote(true)

    })
  }  

  // Sets a flag so saveNote knows if there is something to save
  function updated(){
    updatedSomething.current = true
  }

  return (
    <div className='notesContainer'>
      {!editingNote ? 
        <div>
          <div onClick={()=>openNote(null)} className="noteBox">New Note</div>
          {console.log(notesArray)}
          {notesArray.map(noteTitleData => (
            <div 
              key={noteTitleData.key}
              className='noteBox' 
              onClick={()=>{openNote(noteTitleData.key)}}
            >
              {noteTitleData.title}
            </div>
          ))}
        </div>
      :
      editingNote &&
        <div className='noteEdit'>
          <div className='closeButton' onClick={closeNote}>x</div>
          <div>
            <input defaultValue={noteData.title} onChange={updated} id="noteTitleInput"></input>
          </div>
          <div>
            <textarea defaultValue={noteData.content} onChange={updated} id="noteContentInput"></textarea> 
          </div>
          <div onClick={()=>deleteNote(noteData.key)} className='noteDeleteButton'>Delete</div>           
        </div>
      }
    </div>
  )
}

export default Notes