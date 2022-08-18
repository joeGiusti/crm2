import React, {useEffect} from 'react'

function Day(props) {
    useEffect(()=>{        
        setTimeout(() => {
            var element = document.getElementById("day"+props.index)
            if(element) 
                element.classList.add("blueGlow")
        }, props.index * 250); 
    },[])
 
    function selectDay(){
      props.setSelectedDay(props.dayData)
      props.openMenu(true)
    }    
    function selectEvent(event){
      props.openMenu(true)      
      event.stopPropagation()      
    }

    function eventName(_eventData){
      var name = _eventData.name
      if(!name || name === "")
        name = props.contactData(_eventData.imageKey).name
      else
        name = props.NumbersToString(name)
      return name
    }

  return (
    <div className='hoverBox day' key={"day"+props.index} id={"day"+props.index} onClick={selectDay}>
      {props.dayData.moment.format("D") === "1" ? props.dayData.moment.format("MMMM, DD") : props.dayData.moment.format("DD")}      
      {props.dayData.events.map(eventData => (
        <div className={'event shadowHilight '+eventData.color} onClick={(event)=>selectEvent(event)}>{eventName(eventData)}</div>        
        // <div className='event'>{console.log(eventData.imageKey)}</div>
      ))}
    </div>
  )
}

export default Day