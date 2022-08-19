import React, { useEffect, useState } from 'react'

function Event(props) {
  
    const [contactData, setContactData] = useState(null)
  
    useEffect(()=>{
        setContactData( props.contactData(props.eventData.imageKey) )
    },[])

    // Opens the event menu
    function selectEvent(clickEvent){
        clickEvent.stopPropagation()   
        props.setSelectedEvent(props.eventData)   
        props.openMenu(true)      
    }

    // Displays the event name (contact name unless there is another name specified)
    function eventName(){
        var returnValue = ""
        if(props.eventData && props.eventData.name !== "")
            returnValue += props.NumbersToString(props.eventData.name)
        else if(contactData)
            returnValue += contactData.name
        
        return returnValue
    }

    return (
    <div className={'event shadowHilight ' + (props.eventData && props.eventData.color)} onClick={(clickEvent)=>selectEvent(clickEvent, props.eventData)} key={"event"+props.eventData.key}>
        {eventName()}
        <div className={'contactPreview '}>                        
            <img src={contactData && contactData.url}></img>
        </div>
    </div>
  )
}

export default Event