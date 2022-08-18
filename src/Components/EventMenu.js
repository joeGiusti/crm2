import React from 'react'
import ContactMenu from './ContactMenu'
function EventMenu(props) {
  return (
    <>
        { props.open &&  
            <div className='box2 menuBox blueGlow eventMenu'>
                <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
                <div className='leftDiv'>
                  <img></img>
                  <select>
                    <option>Name</option>
                    <option>Name</option>
                  </select>                  
                  <textarea placeholder='notes'></textarea>
                </div>
                <div className='contactImageInfo'>
                  <input placeholder='Name'></input>
                  <select placeholder='status' className='eventStatusSelect'>
                    <option>Blue</option>
                    <option>Yellow</option>
                    <option>Green</option>
                    <option>Gray</option>
                    <option>Orange</option>
                  </select>
                  <input type={"checkbox"} className="eventCheckbox" defaultChecked={true}></input>
                  <input type={"date"} className="eventDateInput"></input>
                  <input type={"date"} className="eventDateInput"></input>
                  <textarea placeholder='Notes'></textarea>
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