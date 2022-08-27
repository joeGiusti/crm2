import React, { useEffect, useState } from 'react'
import moment from 'moment'
import "../Styles/Stats.css"

function Stats(props) {

  const [statsObject, setStatsObject] = useState({      
    green: 0,
    gray: 0,
    lightBlue: 0,
    darkGreen: 0,
    months: {},
    monthsArray: [],
  })

  useEffect(()=>{
    buildStatObject()
  },[])

  function buildStatObject(){
    
    var tempStatsObject = {
      green: 0,
      gray: 0,
      lightBlue: 0, 
      donations: 0, 
      months: {},
      monthsArray: [],
      contactKeys: {},
    }

    props.eventsArray.forEach( event => {

      
      // Create a moment object from the data
      var momentDate = moment(event.date, "YYYY-MM-DD").clone()  
      // Get the month from it
      var month = momentDate.format("YYYY MMMM")
      
      if(month === "Invalid date")
        console.log("invalid event with key: "+event.key)

      // Add the month if its not already there
      if(tempStatsObject.months[month] === undefined){
        tempStatsObject.months[month] = {
          name: month,
          green: 0, 
          gray:  0,
          lightBlue: 0,
          darkGreen: 0,
          // Save the moment object for sorting later
          momentDate: momentDate,
        }        
      }
                      
      if(event.color === "eventLightGreen"){
        // Total
        tempStatsObject.green += 1
        tempStatsObject.donations += 1
        
        // Month
        tempStatsObject.months[month].green += 1        

        tempStatsObject.contactKeys[event.imageKey] = true
      }
      if(event.color === "eventGray"){
        // Total
        tempStatsObject.gray += 1
        tempStatsObject.donations += 1
        tempStatsObject.contactKeys[event.imageKey] = true

        // Month
        tempStatsObject.months[month].gray += 1

      }
      if(event.color === "eventLightBlue"){
        // Total
        tempStatsObject.lightBlue += 1
        tempStatsObject.donations += 1
        tempStatsObject.contactKeys[event.imageKey] = true

        // Month
        tempStatsObject.months[month].lightBlue += 1

      }
      if(event.color === "eventDarkGreen"){
        // Total
        tempStatsObject.darkGreen += 1
        tempStatsObject.donations += 1
        tempStatsObject.contactKeys[event.imageKey] = true
        
        // Month
        tempStatsObject.months[month].darkGreen += 1

      }

      if(event.color === "eventGreen"){
        // Total        
        tempStatsObject.donations += 1      
        tempStatsObject.contactKeys[event.imageKey] = true
      }
      if(event.color === "eventYellow"){
        // Total
        tempStatsObject.donations += 1     
        tempStatsObject.contactKeys[event.imageKey] = true
      }
    })    
    
    // A cool reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

    // Create an array with the data for each month
    var tempMonthsArray = []
    for(var monthName in tempStatsObject.months){
      tempMonthsArray.push({
        name: monthName,
        gray: tempStatsObject.months[monthName].gray,
        green: tempStatsObject.months[monthName].green,
        lightBlue: tempStatsObject.months[monthName].lightBlue,      
        darkGreen: tempStatsObject.months[monthName].darkGreen,
        momentDate: tempStatsObject.months[monthName].momentDate,
      })
    }

    // Sort it and place it in the tempStatsObject
    tempStatsObject.monthsArray = sortMonthsArray(tempMonthsArray)

    // save the tempStatsObject into state to be displayed
    setStatsObject(tempStatsObject)
  }

  // Sorts and filters an array of month data and return the sorted array
  function sortMonthsArray(_monthsArray){
    
    // Place each month in the temp array based on its momentDate
    var tempArray = []
    _monthsArray.forEach( month => {

      // Don't worry about stray events with no data
      if(month.gray == 0 && month.green == 0 && month.lightBlue == 0)
        return

      // Get the index of the first month thats before this one
      var c = 0   
      tempArray.forEach( placedMonth => {            
        if(placedMonth.momentDate.isAfter(month.momentDate))
          return                  
        c++
      })

      // Insert the month into the array at the found index
      tempArray.splice(c, 0, month)
      
    })

    // Return the sorted and filtered array
    return tempArray
  }

  // Determines if the event contact (imageKey) was seen within the previous 2 weeks
  function cycleDuplicate(){
    // Check to see if there is an event within 14 days before with same contact
    // The first one will not show any, any attempts after will, so each cycle will count as 1 attempt even if met the multiple times for that cycle
    return false
  }

  return (
    <div className='box statsBox'>
        <div>
          <div className='barGreen statNumber'>Green: {statsObject.green}</div>
          <div className='barLightBlue statNumber'>Light Blue: {statsObject.lightBlue}</div>
          <div className='barGray statNumber'>Gray : {statsObject.gray}</div> 
        </div>
        <div>
          <div className='statNumber barGreen'> {Array.isArray(statsObject.monthsArray) && (statsObject.green / statsObject.monthsArray.length).toFixed(2) + " / month"}</div>    
          <div className='statNumber barLightBlue'> {Array.isArray(statsObject.monthsArray) && (statsObject.lightBlue / statsObject.monthsArray.length).toFixed(2) + " / month"}</div>    
          <div className='statNumber barGray'> {Array.isArray(statsObject.monthsArray) && (statsObject.gray / statsObject.monthsArray.length).toFixed(2) + " / month"}</div>    
        </div>
        <div>
          <div className='statNumber barGreen'> {Array.isArray(statsObject.monthsArray) && (statsObject.green / (statsObject.monthsArray.length / 12)).toFixed(2) + " / year"}</div>    
          <div className='statNumber barLightBlue'> {Array.isArray(statsObject.monthsArray) && (statsObject.lightBlue / (statsObject.monthsArray.length  / 12)).toFixed(2) + " / year"}</div>    
          <div className='statNumber barGray'> {Array.isArray(statsObject.monthsArray) && (statsObject.gray / (statsObject.monthsArray.length / 12)).toFixed(2) + " / year"}</div>    
        </div>
        <div>
          <div className='statNumber'> {Array.isArray(statsObject.monthsArray) && statsObject.monthsArray.length + " months "}</div>  
          <div className='statNumber'> {statsObject.contactKeys && Object.keys(statsObject.contactKeys).length + " contacts "}</div>      
          <div className='statNumber'> {statsObject.donations + " donations "}</div>      
        </div>
        <div>
          <div>
            {statsObject.monthsArray.map( month => (
              <div className='monthStatBox'>                             
                <div className='container'>
                  <div className='columnContainer'>
                    <div>{month.green}</div>
                    <div className='column barGreen' style={{height: (month.green * 20)+"px"}}></div>
                  </div>
                  <div className='columnContainer'>
                    <div>{month.lightBlue}</div>
                    <div className='column barLightBlue' style={{height: (month.lightBlue * 20)+"px"}}></div>
                  </div>
                  <div className='columnContainer'>
                    <div>{month.darkGreen}</div>
                    <div className='column barDarkGreen' style={{height: (month.darkGreen * 20)+"px"}}></div>
                  </div>
                  <div className='columnContainer'>
                    <div>{month.gray}</div>
                    <div className='column barGray' style={{height: (month.gray * 20)+"px"}}></div>
                  </div>
                </div>
                {month.name}
              </div>
              
            ))}
          </div>
        </div>    
    </div>
  ) 
}

export default Stats