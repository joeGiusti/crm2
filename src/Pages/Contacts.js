import React, { useEffect, useRef, useState } from 'react'
import Contact from '../Components/Contact'
import '../Styles/Contact.css'
import ArrowButtons from '../Components/ArrowButtons'

function Contacts(props) {

  const pageAmount = useRef(35)
  const [pageRange, setPageRange] = useState({start:0, end:pageAmount.current})
  const grayCheckboxRef = useRef()
  const blueCheckboxRef = useRef()
  const yellowCheckboxRef = useRef()
  const greenCheckboxRef = useRef()
  const orangeCheckboxRef = useRef()
  const clearCheckboxRef = useRef()
  const redCheckboxRef = useRef()
  const firstUseEffect = useRef(true)
  const pressingTab = useRef()

  useEffect(()=>{

    // On component mount do this:
    window.addEventListener("keydown", keyDownEffects)
    window.addEventListener("keyup", keyUpEffects)

    // On component dismount do this: (does not work)
    return () => {
      console.log("removing event listeners")
      window.removeEventListener("keydown", keyDownEffects)
      window.removeEventListener("keyupn", keyUpEffects)
    }

  },[])

  function keyDownEffects(_event){

    if(_event.key === "Tab")
      pressingTab.current = true
    if(pressingTab.current && _event.key === "1")
      showCurrentContacts()
    if(pressingTab.current && _event.key === "2")
      showGreenContacts()
    if(pressingTab.current && _event.key === "3")
      showAllContacts()
    
  }
  function keyUpEffects(_event){
    if(_event.key === "Tab")
      pressingTab.current = false

  }

  function pagedContacts(_contactsArray){
    var tempContacts = []
    _contactsArray.forEach((contact, index)=>{
      if(index >= pageRange.start && index < pageRange.end)
        tempContacts.push(contact)
    })
    return tempContacts
  }

  function pageNext(){
    
    setPageRange({start: pageRange.start + pageAmount.current, end: pageRange.end + pageAmount.current})
    return
    if(pageRange.start + pageAmount.current >= props.contactsArray.length)
      return      
    if((pageRange.end + pageAmount.current) <= props.contactsArray.length)
      setPageRange({start: pageRange.start + pageAmount.current, end: pageRange.end + pageAmount.current})
    
  }
  function pageLast(){
    if(pageRange.start - pageAmount.current < 0)
      setPageRange({start: 0, end: pageAmount.current})
    else
      setPageRange({start: pageRange.start - pageAmount.current, end: pageRange.end - pageAmount.current})
  }

  function showCurrentContacts(){

    // To show:
    grayCheckboxRef.current.checked = true
    props.setShowGrayContacts(true)
    blueCheckboxRef.current.checked = true
    props.setShowBlueContacts(true)
    yellowCheckboxRef.current.checked = true
    props.setShowYellowContacts(true)

    // To hide:
    greenCheckboxRef.current.checked = false
    props.setShowGreenContacts(false)
    orangeCheckboxRef.current.checked = false
    props.setShowOrangeContacts(false)
    clearCheckboxRef.current.checked = false
    props.setShowOrangeContacts(false) 
    redCheckboxRef.current.checked = false
    props.setShowArchivedContacts(false)

  }

  function showGreenContacts(){

    // To show:
    greenCheckboxRef.current.checked = true
    props.setShowGreenContacts(true)
    
    // To hide:
    grayCheckboxRef.current.checked = false
    props.setShowGrayContacts(false)
    blueCheckboxRef.current.checked = false
    props.setShowBlueContacts(false)
    yellowCheckboxRef.current.checked = false
    props.setShowYellowContacts(false)
    orangeCheckboxRef.current.checked = false
    props.setShowOrangeContacts(false)
    clearCheckboxRef.current.checked = false
    props.setShowOrangeContacts(false) 
    redCheckboxRef.current.checked = false
    props.setShowArchivedContacts(false)

  }

  function showAllContacts(){

    // To show:
    grayCheckboxRef.current.checked = true
    props.setShowGrayContacts(true)
    blueCheckboxRef.current.checked = true
    props.setShowBlueContacts(true)
    yellowCheckboxRef.current.checked = true
    props.setShowYellowContacts(true)
    greenCheckboxRef.current.checked = true
    props.setShowGreenContacts(true)
    orangeCheckboxRef.current.checked = true
    props.setShowOrangeContacts(true)
    clearCheckboxRef.current.checked = true
    props.setShowOrangeContacts(true) 
    redCheckboxRef.current.checked = true
    props.setShowArchivedContacts(true)

  }
  return (
    <div className='contactsContainerContainer'>    
      <div className='checkboxContainer'>
        <div className='Gray checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showGrayContacts} 
            onChange={event => {props.setShowGrayContacts(event.target.checked)}}
            ref={grayCheckboxRef}
          ></input>
        </div>  
        <div className='Blue checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showBlueContacts} 
            onChange={event => {props.setShowBlueContacts(event.target.checked)}}
            ref={blueCheckboxRef}
          ></input>
        </div>  
        <div className='Yellow checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showYellowContacts} 
            onChange={event => {props.setShowYellowContacts(event.target.checked)}}
            ref={yellowCheckboxRef}
          ></input>
        </div>  
        <div className='Green checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showGreenContacts} 
            onChange={event => {props.setShowGreenContacts(event.target.checked)}}
            ref={greenCheckboxRef}
          ></input>
        </div>  
        <div className='Orange checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showOrangeContacts} 
            onChange={event => {props.setShowOrangeContacts(event.target.checked)}}
            ref={orangeCheckboxRef}
          ></input>
        </div>  
        <div className='Clear checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showClearContacts} 
            onChange={event => {props.setShowClearContacts(event.target.checked)}}
            ref={clearCheckboxRef}
          ></input>
        </div>  
        <div className='Archived checkbox'>
          <input 
            type={"checkbox"} 
            defaultChecked={props.showArchivedContacts} 
            onChange={event => {props.setShowArchivedContacts(event.target.checked)}}
            ref={redCheckboxRef}
          ></input>
        </div>  

        <ArrowButtons
          message={pageRange.start + " to " + pageRange.end+" of "+props.contactsArray.length}
          arrowLeft={pageLast}
          arrowRight={pageNext}
        ></ArrowButtons>
      </div>
      <div className='contactsContainer'>
        {props.contactsArray.length < 3 &&  
              <div className='hoverBox contactBox newContactBox' onClick={props.openContact}>
                <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MuBiR0Qtsp7RRJ12mOn478.99475428835837?alt=media&token=c10862b2-91e1-4bf3-8953-f8e2930edf00"></img>
                {/* <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MteKD1lOtpuKqb8Dx_J?alt=media&token=bdaa5943-b7d1-4b59-a76b-b94861ed5f9e"></img> */}
                <div className='newContactText'> + New Contact + </div>      
              </div>
          }
        {pagedContacts(props.contactsArray).map((contact, index) => (
          <>
            {index == 8 && 
              <div className='hoverBox contactBox newContactBox' onClick={props.openContact}>
                <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MuBiR0Qtsp7RRJ12mOn478.99475428835837?alt=media&token=c10862b2-91e1-4bf3-8953-f8e2930edf00"></img>
                {/* <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MteKD1lOtpuKqb8Dx_J?alt=media&token=bdaa5943-b7d1-4b59-a76b-b94861ed5f9e"></img> */}
                <div className='newContactText'> + New Contact + </div>      
              </div>
            }
            <Contact
              key={contact.key}
              index={index}
              contact={contact}
              openContact={props.openContact}
            ></Contact>
          </>
        ))}
      </div>
    </div>
  )
}

export default Contacts