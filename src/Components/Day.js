import React, {useEffect} from 'react'
import moment from 'moment'
import Event from "./Event"

function Day(props) {
    useEffect(()=>{        
        setTimeout(() => {
            var element = document.getElementById("day"+props.index)
            if(element) 
                element.classList.add("blueGlow")
        }, props.index * 250); 
    },[])
 
    function selectDay(){
      props.setSelectedDay()
      props.setSelectedEvent({
        name: "",
        notes: "",
        color: "eventBlue",        
        date: props.dayData.moment.format("YYYY-MM-DD"),
        imageKey: "",
        newEvent: true,
      })   
      props.openMenu(true)
    }    

  return (
    <div className={'day '+(props.selectedDay.isSame(props.dayData.moment, "day") ? "dayHover" : "")} key={"day"+props.index} id={"day"+props.index} onClick={selectDay}>
      {props.dayData.moment.format("D") === "1" ? props.dayData.moment.format("MMMM, DD") : props.dayData.moment.format("DD")}   
      <div key={props.dayData.moment.format("MMMM, DD")}>
        {props.dayData.events.map(eventData => (
          <Event          
            eventData={eventData}
            contactData={props.contactData}
            NumbersToString={props.NumbersToString}
            setSelectedEvent={props.setSelectedEvent}
            openMenu={props.openMenu}
          ></Event>                  
        ))}
      </div>   
    </div>
  )
}

export default Day