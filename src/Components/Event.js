import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ImageArrayViewer from './ImageArrayViewer'

function Event(props) {
  
    const [contactData, setContactData] = useState(null)
  
    useEffect(()=>{        
        setContactData( props.getContactData(props.eventData.imageKey) )
    },[])

    // Opens the event menu
    function selectEvent(clickEvent){
        clickEvent.stopPropagation()           
        props.openEvent(props.eventData)      
    }

    // Displays the event name (contact name unless there is another name specified)
    function eventName(){
        var returnValue = ""
        if(props.eventData && props.eventData.name !== "")
            returnValue += props.eventData.name
        else if(contactData)
            returnValue += contactData.name
        
        return returnValue
    }

    return (
    <div className='eventContainer'>        
        <div className={'event shadowHilight ' + (props.eventData && props.eventData.color)} onClick={(clickEvent)=>selectEvent(clickEvent, props.eventData)} >
        {eventName()}        
        <div className={'contactPreview '}>       
            <ImageArrayViewer
                imageArray={contactData && contactData.images}                
            ></ImageArrayViewer>                 
            {/* <img src={contactData && contactData.url}></img> */}
        </div>
        </div>        
    </div>
  )
}

export default Event