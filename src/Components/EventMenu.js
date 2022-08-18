import React from 'react'
import ContactMenu from './ContactMenu'
function EventMenu(props) {

  function colorFunction(_color){
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

  return (
    <>
        { 
            <div className='box2 menuBox blueGlow eventMenu'>
                <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
                <div className='leftDiv'>
                <img></img>
                {/* https://stackoverflow.com/questions/65186998/alternatives-to-datalist-tag
                https://twitter.github.io/typeahead.js/ */}
                <div className='contactNameSelect'>
                  <input type="text" name="example" list="exampleList"/>
                  <datalist id="exampleList">
                    {props.contactsArray.map(contact => (
                      <option value={contact.name}></option>
                    ))}
                  </datalist>
                </div>

                  {/* <select>
                    <option>Name</option>
                    <option>Name</option>
                  </select>                   */}
                  <textarea placeholder='notes'></textarea>                  
                </div>
                <div className='contactImageInfo'>
                  <input placeholder='Name' defaultValue={props.NumbersToString(props.selectedEvent.name)}></input>
                  {console.log(props.selectedEvent)}
                  <select placeholder='status' className='eventStatusSelect' defaultValue={colorFunction(props.selectedEvent.color)}>
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
                  <input type={"date"} className="eventDateInput" defaultValue={props.selectedEvent.date}></input>
                  <input type={"date"} className="eventDateInput"></input>
                  <textarea placeholder='Notes'  defaultValue={props.NumbersToString(props.selectedEvent.notes)}></textarea>
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