import React, {useEffect} from 'react'
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
      props.openEvent({
        name: "",
        notes: "",
        color: "eventBlue",        
        date: props.dayData.moment.format("YYYY-MM-DD"),
        imageKey: "",
        newEvent: true,
      })
    }    

  return (
    <div 
      className={'day '+(props.selectedDay.isSame(props.dayData.moment, "day") ? "dayHover" : "")} 
      key={"day"+props.index} id={"day"+props.index} onClick={selectDay}
      onMouseEnter={()=>props.setHoverDate(props.dayData.moment.format("MM DD YYYY"))}
    >
      {props.dayData.moment.format("D") === "1" ? props.dayData.moment.format("MMMM, DD") : props.dayData.moment.format("DD")}   
      <div key={props.dayData.moment.format("MMMM, DD")}>
        {props.dayData.events.map(eventData => (
          <Event          
            key={eventData ? eventData.key + eventData.imageKey : "eventWithNoData"}
            eventData={eventData}
            getContactData={props.getContactData}            
            setSelectedEvent={props.setSelectedEvent}
            openEvent={props.openEvent}
          ></Event>                  
        ))}
      </div>   
    </div>
  )
}

export default Day