import React, { useEffect, useRef, useState } from 'react'
import ContactMenu from './ContactMenu'
import { set, update, ref as dbRef, push } from 'firebase/database'

function EventMenu(props) {

  const [eventContact, setEventContct]= useState(null)
  const needsUpdate = useRef(false)

  useEffect(()=>{
    console.log("opening event")
    console.log(props.selectedEvent)
    if(!props.selectedEvent.newEvent){
      setEventContct(props.contactData(props.selectedEvent.imageKey))
    }
  },[])

  // Db functions
  function updateEvent(){
    
    if(!needsUpdate.current)
      return

    // gather data
    var name = document.getElementById("nameInput").value
    var date = document.getElementById("dateStartSelector").value
    var dateEnd = document.getElementById("dateEndSelector").value
    var status = document.getElementById("eventStatusSelector").value
    var notes = document.getElementById("notesInput").value
    var imageKey = document.getElementById("contactSelector").value    
    
    var ref = null
    if(props.selectedEvent.newEvent)
      ref = push(dbRef(props.firebase.current.db, "events/"))
    else
      ref = dbRef(props.firebase.current.db, "events/" + props.selectedEvent.key)

    var eventUpdateObject = {
      name: props.StringToNumbers(name),
      date: date,
      dateEnd: dateEnd,
      color: status,
      notes: notes,
      // This is silly, will revisit when re-structuring db
      imageKey: imageKey,
      key:ref.key
    }

    // console.log("updating "+props.selectedEvent.key)
    // console.log(eventUpdateObject)

    // upload it
    update(ref, eventUpdateObject)
  }
  
  function cancel(){
    props.setOpen(false)
  }  

  function deleteEvent(){
    console.log("deleting "+props.selectedEvent.key)
    console.log(props.selectedEvent.newEvent)
    if(props.selectedEvent.newEvent)
      return
    set(dbRef(props.firebase.current.db, "events/"+props.selectedEvent.key), null)
    props.setOpen(false)
  }

  // Helper Functions

  function updatedSomething(){
    needsUpdate.current = true
  }

  function colorFunction(_color){
    if(!_color)
      return ""
    return _color.replace("event", "")
  }

  function closeMenu(){
    updateEvent()
    props.setOpen(false)
  }

  function selectedAContact(){
    var contactKey = document.getElementById("contactSelector").value    
    updatedSomething()
    setEventContct(props.contactData(contactKey))    
  }

  return (
    <>        
      <div className='box2 menuBox blueGlow eventMenu'>
          <div className='closeButton' onClick={closeMenu}>x</div>
          <div className='leftDiv'>
          <img src={eventContact && eventContact.images && eventContact.images[0]}></img>
          {/* https://stackoverflow.com/questions/65186998/alternatives-to-datalist-tag
          https://twitter.github.io/typeahead.js/ */}
          <div className='contactNameSelect'>
            {/* <input type="text" name="example" list="exampleList"/>
            <datalist id="exampleList">
              {props.contactsArray.map(contact => (
                <option value={contact.name}></option>
              ))}
            </datalist> */}
            {/* <input type="text" name="example" list="exampleList"/> */}

            <select id="contactSelector" onChange={selectedAContact} defaultValue={props.selectedEvent && props.selectedEvent.imageKey}>
              {Array.isArray(props.contactsArray) && props.contactsArray.map(contact => (
                <>
                  {contact && <option value={contact.key}>{contact.name}</option>}
                </>
              ))}
            </select>
          </div>
            <textarea placeholder='notes' defaultValue={eventContact && eventContact.notes}></textarea>                  
          </div>
          <div className='contactImageInfo'>
            <input id='nameInput' placeholder='Name' defaultValue={props.selectedEvent && props.NumbersToString(props.selectedEvent.name)} onChange={updatedSomething}></input>            
            <select id='eventStatusSelector' placeholder='status' className='eventStatusSelect' defaultValue={props.selectedEvent && colorFunction(props.selectedEvent.color)} onChange={updatedSomething}>
              <option>Blue</option>                    
              <option>Yellow</option>
              <option>Green</option>
              <option>Gray</option>
              <option>LightBlue</option>
              <option>Clear</option>
              <option>Orange</option>
              <option>DarkGreen</option>
            </select>
            <input type={"checkbox"} className="eventCheckbox" defaultChecked={true} onChange={updatedSomething}></input>
            <input id='dateStartSelector' type={"date"} className="eventDateInput" defaultValue={props.selectedEvent && props.selectedEvent.date} onChange={updatedSomething}></input>
            <input id='dateEndSelector' type={"date"} className="eventDateInput" onChange={updatedSomething}></input>
            <textarea id='notesInput' placeholder='Notes'  defaultValue={props.selectedEvent && props.NumbersToString(props.selectedEvent.notes)} onChange={updatedSomething}></textarea>
            <div className='hoverBox button' onClick={deleteEvent}>Delete</div>
            <div className='hoverBox button' onClick={cancel}>Cancel</div>
          </div>
      </div>        
    </>
  )
}
EventMenu.defaultProps = {
  open: false,
    setOpen: (param) => {console.log("no function: setting open to " + param)}
}
export default EventMenu