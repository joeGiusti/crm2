import React, { useEffect, useState } from 'react'
import ContactMenu from './ContactMenu'
function EventMenu(props) {

  const [eventContact, setEventContct]= useState(null)

  useEffect(()=>{
    if(!props.selectedEvent.newEvent){
      setEventContct(props.contactData(props.selectedEvent.imageKey))
      console.log("loading contact")      
      console.log(props.contactData(props.selectedEvent.imageKey))      
    }else{
      console.log("no selected event")
    }
  },[])

  function colorFunction(_color){
    if(!_color)
      return ""
    return _color.replace("event", "")
    if(_color === "eventBlue")
      return "Blue"
    if(_color === "eventYellow")
      return "Yellow"
    if(_color === "eventGreen")
      return "Green"
    if(_color === "eventOrange")
      return "Orange"
  }

  function selectedAContact(){
    var contactKey = document.getElementById("contactSelector").value
    console.log("selected "+contactKey)
    setEventContct(props.contactData(contactKey))    
  }

  return (
    <>
        { 
            <div className='box2 menuBox blueGlow eventMenu'>
                <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
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
                  <input placeholder='Name' defaultValue={props.selectedEvent && props.NumbersToString(props.selectedEvent.name)}></input>
                  {console.log(props.selectedEvent)}
                  <select placeholder='status' className='eventStatusSelect' defaultValue={props.selectedEvent && colorFunction(props.selectedEvent.color)}>
                    <option>Blue</option>                    
                    <option>Yellow</option>
                    <option>Green</option>
                    <option>Gray</option>
                    <option>LightBlue</option>
                    <option>Clear</option>
                    <option>Orange</option>
                    <option>DarkGreen</option>
                  </select>
                  <input type={"checkbox"} className="eventCheckbox" defaultChecked={true}></input>
                  <input type={"date"} className="eventDateInput" defaultValue={props.selectedEvent && props.selectedEvent.date}></input>
                  <input type={"date"} className="eventDateInput"></input>
                  <textarea placeholder='Notes'  defaultValue={props.selectedEvent && props.NumbersToString(props.selectedEvent.notes)}></textarea>
                  <div className='hoverBox button'>Delete</div>
                  <div className='hoverBox button'>Revert</div>
                </div>
            </div>
        }
    </>
  )
}
EventMenu.defaultProps = {
  open: false,
  setOpen: (param) => {console.log("no function: setting open to " + param)}
}
export default EventMenu