import React, { useEffect, useState } from 'react'
import "../Styles/Calendar.css"
import Day from '../Components/Day'
import moment from "moment"
import ArrowButtons from '../Components/ArrowButtons'
import {onValue, ref} from 'firebase/database'
import EventMenu from '../Components/EventMenu'

function Calendar(props) {

  const [dayOfFocus, setDayOfFocus] = useState(moment().clone())
  const [displayEventMenu, setDisplaEventMenu] = useState(false)
  const [calendarArray, setCalendarArray] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(()=>{
    refreshCalendar(moment().clone())
  },[props.eventArray])

  function nextMonth(){
    var newDay = dayOfFocus.clone().add(1, "month")
    refreshCalendar(newDay)
    setDayOfFocus(newDay)
  }
  function lastMonth(){    
    var newDay = dayOfFocus.clone().subtract(1, "month")
    refreshCalendar(newDay)
    setDayOfFocus(newDay)
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
          message={dayOfFocus.format("MMMM")}
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