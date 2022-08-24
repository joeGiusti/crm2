import React, { useRef, useState } from 'react'
import Contact from '../Components/Contact'
import '../Styles/Contact.css'
import ArrowButtons from '../Components/ArrowButtons'

function Contacts(props) {

  const pageAmount = useRef(35)
  const [pageRange, setPageRange] = useState({start:0, end:pageAmount.current})

  function calcPageAmount(){
    // this will be called in useEffect and on window resize

    // get div width
    // calc number of contact squares will fit horizontally

    // get div height
    // calc number of contact squares will fit vertically

    // return nHorizontal * nVertical

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

  return (
    <div className='contactsContainer'>
      <ArrowButtons
        message={pageRange.start + " to " + pageRange.end+" of "+props.contactsArray.length}
        arrowLeft={pageLast}
        arrowRight={pageNext}
      ></ArrowButtons>
      {props.contactsArray.length < 3 &&  
            <div className='hoverBox contactBox newContactBox' onClick={props.newContact}>
              <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MuBiR0Qtsp7RRJ12mOn478.99475428835837?alt=media&token=c10862b2-91e1-4bf3-8953-f8e2930edf00"></img>
              {/* <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MteKD1lOtpuKqb8Dx_J?alt=media&token=bdaa5943-b7d1-4b59-a76b-b94861ed5f9e"></img> */}
              <div className='newContactText'> + New Contact + </div>      
            </div>
        }
      {pagedContacts(props.contactsArray).map((contact, index) => (
        <>
          {index == 8 && 
            <div className='hoverBox contactBox newContactBox' onClick={props.newContact}>
              <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MuBiR0Qtsp7RRJ12mOn478.99475428835837?alt=media&token=c10862b2-91e1-4bf3-8953-f8e2930edf00"></img>
              {/* <img src="https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MteKD1lOtpuKqb8Dx_J?alt=media&token=bdaa5943-b7d1-4b59-a76b-b94861ed5f9e"></img> */}
              <div className='newContactText'> + New Contact + </div>      
            </div>
          }
          <Contact
            key={contact.key}
            index={index}
            openMenu={props.openMenu}
            contact={contact}
            setSelectedContact={props.setSelectedContact}
            openContact={props.openContact}
          ></Contact>
        </>
      ))}
    </div>
  )
}

export default Contacts