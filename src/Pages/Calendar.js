import React, { useEffect, useState } from 'react'
import "../Styles/Calendar.css"
import Day from '../Components/Day'
import moment from "moment"
import ArrowButtons from '../Components/ArrowButtons'
function Calendar(props) {

  const [monthArray, setMonthArray] = useState([])
  const [dayOfFocus, setDayOfFocus] = useState(moment().clone())

  useEffect(()=>{
    setMonthArray(createMonthArray(moment().clone()))
  },[])

  function nextMonth(){
    var newDay = dayOfFocus.clone().add(1, "month")
    setDayOfFocus(newDay)
    setMonthArray(createMonthArray(newDay))
  }
  function lastMonth(){
    var newDay = dayOfFocus.clone().subtract(1, "month")
    setDayOfFocus(newDay)
    setMonthArray(createMonthArray(newDay))
  }

  function createMonthArray(day){    
    if(!day)
      day = moment().clone()    
    var start = day.clone().startOf("month").startOf("week")
    var counter = start.clone()
    var end = day.clone().endOf("month").endOf("week").add(1,"day")
    var dayArray = []
    while(counter.isBefore(end, "day"))
      dayArray.push(counter.add(1, "day").clone())

    return dayArray
  }


  return (
    <div className='calendar'>
        <ArrowButtons
          message={dayOfFocus.format("MMMM")}
          arrowLeft={lastMonth}
          arrowRight={nextMonth}
        ></ArrowButtons>
        {monthArray.map((dayData, index) => (          
          <Day
            dayData={dayData}
            index={index}
            openMenu={props.openMenu}
          >
          </Day>
        ))}
    </div>
  )
}

export default Calendar