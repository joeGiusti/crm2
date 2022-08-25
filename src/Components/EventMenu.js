import React, { useEffect, useRef, useState } from 'react'
import ContactMenu from './ContactMenu'
import { set, update, ref as dbRef, push } from 'firebase/database'
import ImageArrayViewer from './ImageArrayViewer'
import TypeSelect from './TypeSelect'
import TypeSelectContacts from './TypeSelectContacts'

function EventMenu(props) {

  const eventContactRef = useRef()
  const [eventContact, setEventContct]= useState(null)
  const needsUpdate = useRef(false)

  useEffect(()=>{
 
    // If its not a new event get the contact data
    if(!props.selectedEvent.newEvent){
      setEventContct(props.contactData(props.selectedEvent.imageKey))
      eventContactRef.current = props.contactData(props.selectedEvent.imageKey)
    }    
    else{
      document.getElementById("textInput").focus()
    }
    
    setUpKeyListener()

  },[])

  const justPressedTab = useRef(false)
  const tabIndex = useRef(0)
  const tabDown = useRef(false)
  function setUpKeyListener(){
    console.log("in key listener")
    document.getElementById("eventMenu").addEventListener("keydown", event => {     
      console.log(" keywodn "+event.key) 
      if(event.key == "Tab"){

        tabDown.current = true

        if(!justPressedTab.current){
          console.log("tabbing over")
          tabIndex.current = tabIndex.current + 1
          // if(tabIndex.current == 1)
          //   document.getElementById("name").focus()
          justPressedTab.current = true
          setTimeout(() => {
            justPressedTab.current = false
          }, 100);
        }
      }
      if(tabDown.current && event.key == "o"){
        var n = ""
       try{ 
          n = document.getElementById("nameInput").value
          console.log(document.getElementById("nameInput").value)
          console.log(n)      
        }catch(err){}
        closeMenu()
      }
    })
    document.getElementById("eventMenu").addEventListener("keyup", event => {      
      if(event.key == "Tab")
        tabDown.current = false
      if(event.key == "p")
        console.log(document.getElementById("nameInput").value)
    })
  }

  // Db functions
  function updateEvent(){
    
    if(!needsUpdate.current)
      return

      // gather data
      try{ 
        var name = document.getElementById("nameInput").value    
        var date = document.getElementById("dateStartSelector").value
        var dateEnd = document.getElementById("dateEndSelector").value
        var status = document.getElementById("eventStatusSelector").value
        var notes = document.getElementById("notesInput").value  
        var imageKey = ""
      }catch(err){}    

    if(eventContact && eventContact.key && typeof eventContact.key == "string")
      imageKey = eventContact.key    

    if(eventContactRef.current && eventContactRef.current.key && typeof eventContactRef.current.key == "string")
      imageKey = eventContactRef.current.key

    var ref = null
    if(props.selectedEvent.newEvent)
      ref = push(dbRef(props.firebase.current.db, "events/"))
    else
      ref = dbRef(props.firebase.current.db, "events/" + props.selectedEvent.key)

    // if eventContact == null && newContact && newContact != ""
    //   create a contact with push and set

    var eventUpdateObject = {
      name: props.StringToNumbers(name),
      date: date,
      dateEnd: dateEnd,
      color: status,
      notes: props.StringToNumbers(notes),
      // This is silly, will revisit when re-structuring db
      imageKey: imageKey,
      key:ref.key
    }

    // console.log("updating "+props.selectedEvent.key)
    // console.log(eventUpdateObject)

    // upload it
    update(ref, eventUpdateObject)

    // Update the contact status
    if(eventContact){
      if (eventContact.key){
        var tempContactUpdateObject = {
          key: eventContact.key,
          color: status.replace("event",""),
        }
  
        // Some of the event status' are not valid contact status'
        if(tempContactUpdateObject.color === "LightGreen")
          tempContactUpdateObject.color = "Green"
        if(tempContactUpdateObject.color === "DarkGreen")
          tempContactUpdateObject.color = "Gray"
        if(tempContactUpdateObject.color === "LightBlue")
          tempContactUpdateObject.color = "Gray"
          
        // Update contact status in the db
        props.updateContactDb(tempContactUpdateObject)
      }
    } 

    }
  
  function cancel(){
    props.setOpen(false)
  }  

  function deleteEvent(){
    if(props.selectedEvent.newEvent)
      props.setOpen(false)
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

  function selectContact(_contact){
    updatedSomething()
    setEventContct(_contact)   
    eventContactRef.current = _contact
  }
  return (
    <>        
      <div className='box2 menuBox blueGlow eventMenu' id='eventMenu'>
          <div className='closeButton' onClick={closeMenu}>x</div>
          <div className='leftDiv'>
            <div className='leftDivImgArrayContainer'>
              <ImageArrayViewer
                imageArray={eventContact && eventContact.images && eventContact.images}
              ></ImageArrayViewer>
            </div>
          {/* <img src={eventContact && eventContact.images && eventContact.images[0]}></img> */}
          {/* 
            over my head...
            maybe need to learn jquery
            https://stackoverflow.com/questions/65186998/alternatives-to-datalist-tag
            https://twitter.github.io/typeahead.js/ 
            https://twitter.github.io/typeahead.js/examples/
          */}
          <div className='contactNameSelect'>
            {/* <input type="text" name="example" list="exampleList"/>
            <datalist id="exampleList">
              {props.contactsArray.map(contact => (
                <option value={contact.name}></option>
              ))}
            </datalist> */}
            {/* <input type="text" name="example" list="exampleList"/> */}    
            {/* <select id="contactSelector" onChange={selectedAContact} defaultValue={props.selectedEvent && props.selectedEvent.imageKey}>
              {Array.isArray(props.contactsArray) && props.contactsArray.map(contact => (
                <>
                  {contact && <option value={contact.key}>{contact.name}</option>}
                </>
              ))}              
            </select>    */}
          </div>
          <TypeSelectContacts
            optionArray={props.contactsArray}
            selectContact={selectContact}
          ></TypeSelectContacts>     
            <textarea placeholder='notes' defaultValue={eventContact && eventContact.notes}></textarea>                  
          </div>
          <div className='contactImageInfo'>
            <input id='nameInput' placeholder='Name' defaultValue={props.selectedEvent && props.NumbersToString(props.selectedEvent.name)} onChange={updatedSomething}></input>            
            <select id='eventStatusSelector' placeholder='status' className='eventStatusSelect' defaultValue={props.selectedEvent && props.selectedEvent.color} onChange={updatedSomething}>
              <option value="eventBlue">Blue</option>                    
              <option value="eventYellow">Yellow</option>
              <option value="eventLightGreen">Light Green</option>
              <option value="eventGreen">Green</option>
              <option value="eventGray">Gray</option>
              <option value="eventLightBlue">LightBlue</option>
              <option value="eventClear">Clear</option>
              <option value="eventOrange">Orange</option>
              <option value="eventDarkGreen">DarkGreen</option>
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