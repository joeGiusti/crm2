import React, { useEffect, useState } from 'react'
import "../Styles/Calendar.css"
import Day from '../Components/Day'
import moment from "moment"
import ArrowButtons from '../Components/ArrowButtons'
import EventMenu from '../Components/EventMenu'
import CalendarLog from '../Components/CalendarLog'

function Calendar(props) {

  const [calendarArray, setCalendarArray] = useState([])
  const [showLog, setShowLog] = useState(false)
  const [hoverDate, setHoverDate] = useState()

  useEffect(()=>{    

    // Builds a calendar (array of days) and places events in those days. Puts that in state and maps it to screen
    refreshCalendar(props.dayOfFocus)

  },[props.eventArray, props.dayOfFocus])
  
  function nextMonth(){
    var newDay = props.dayOfFocus.clone().add(1, "month")
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
    var start = _day.clone().startOf("month").startOf("week").subtract(1, "day")
    var counter = start.clone()
    var end = _day.clone().endOf("month").endOf("week")
    
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

  return (
    <div className='calendarContainer' id='calendarContainer'>   
      {showLog &&
        <CalendarLog
          hoverDate={hoverDate}
        ></CalendarLog>
      }   
      <div>
        <ArrowButtons
          message={ props.dayOfFocus.format("MMMM YYYY") }
          arrowLeft={lastMonth}
          arrowRight={nextMonth}
        ></ArrowButtons>
        <input type='checkbox' onChange={()=>setShowLog(!showLog)}></input>
      </div>
      <div className='calendar' id='calendar'>

          {calendarArray.map((dayData, index) => (          
            <Day
              key={"day"+index}
              dayData={dayData}
              index={index}
              openEvent={props.openEvent}            
              selectedDay={props.dayOfFocus}
              getContactData={props.getContactData}  
              setHoverDate={setHoverDate}            
            >
            </Day>
          ))}
      </div>

    </div>
  )
}

export default Calendar