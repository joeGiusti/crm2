import React, { useEffect, useState } from 'react'
import "../Styles/Calendar.css"
import Day from '../Components/Day'
import moment from "moment"
import ArrowButtons from '../Components/ArrowButtons'
import {onValue, ref} from 'firebase/database'
import EventMenu from '../Components/EventMenu'

function Calendar(props) {

  
  const [displayEventMenu, setDisplaEventMenu] = useState(false)
  const [calendarArray, setCalendarArray] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(()=>{    
    // Builds a calendar (array of days) and places events in those days. Puts that in state and maps it to screen
    refreshCalendar(props.dayOfFocus)
  },[props.eventArray])

  function nextMonth(){
    var newDay =props.dayOfFocus.clone().add(1, "month")
    refreshCalendar(newDay)
    props.setDayOfFocus(newDay)
  }
  function lastMonth(){    
    var newDay =props.dayOfFocus.clone().subtract(1, "month")
    refreshCalendar(newDay)
    props.setDayOfFocus(newDay)
  }

  function refreshCalendar(_day){    
    setCalendarArray(createCalendarArray(createMonthArray(_day), props.eventArray))
  }

  function createMonthArray(_day){        

    if(!_day)
      _day = moment().clone()    
    var start = _day.clone().startOf("month").startOf("week")
    var counter = start.clone()
    var end = _day.clone().endOf("month").endOf("week").add(1,"day")
    
    var tempArray = []
    while(counter.isBefore(end, "day"))
      tempArray.push({
        moment: counter.add(1, "day").clone(), 
        events: [],
      })

    return tempArray
  }

  function createCalendarArray(_monthArray, _eventArray){
    
    var temCalendarArray = [..._monthArray]
    temCalendarArray.forEach(dayData => {
      _eventArray.forEach(eventData => {
        if(dayData.moment.isSame(eventData.date, "day") && dayData.moment.isSame(eventData.date, "month"))
          dayData.events.push(eventData)
      })
    })

    return temCalendarArray
  }

  function openMenu(){
    console.log("opening menu")
    setDisplaEventMenu(true)
    //console.log(displayEventMenu)
  }
  function closeMenu(){
    console.log("closing menu")
    setDisplaEventMenu(false)
    //console.log(displayEventMenu)
  }

  return (
    <div className='calendar'>
        <ArrowButtons
          message={ props.dayOfFocus.format("MMMM YYYY") }
          arrowLeft={lastMonth}
          arrowRight={nextMonth}
        ></ArrowButtons>
        {displayEventMenu &&         
          <div>
            <EventMenu
              setOpen={closeMenu}
              selectedEvent={selectedEvent}
              NumbersToString={props.NumbersToString}
              contactsArray={props.contactsArray}
              contactData={props.contactData}     
              firebase={props.firebase}    
              StringToNumbers={props.StringToNumbers}     
            ></EventMenu>
          </div>
        }
        {calendarArray.map((dayData, index) => (          
          <Day
            dayData={dayData}
            index={index}
            openMenu={openMenu}            
            setSelectedDay={()=>{}}
            contactData={props.contactData}
            NumbersToString={props.NumbersToString}
            setSelectedEvent={setSelectedEvent}
          >
          </Day>
        ))}
    </div>
  )
}

export default Calendar