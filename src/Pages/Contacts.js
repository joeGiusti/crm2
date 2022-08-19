import React, { useRef, useState } from 'react'
import Contact from '../Components/Contact'
import '../Styles/Contact.css'
import ArrowButtons from '../Components/ArrowButtons'

function Contacts(props) {

  const [pageRange, setPageRange] = useState({start:0, end:12})
  const pageAmount = useRef(12)


  function pagedContacts(_contactsArray){
    var tempContacts = []
    _contactsArray.forEach((contact, index)=>{
      if(index >= pageRange.start && index < pageRange.end)
        tempContacts.push(contact)
    })
    return tempContacts
  }

  function pageNext(){
    
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
      {pagedContacts(props.contactsArray).map((contact, index) => (
        <Contact
          index={index}
          openMenu={props.openMenu}
          contact={contact}
          setSelectedContact={props.setSelectedContact}
          openContact={props.openContact}
        ></Contact>
      ))}
    </div>
  )
}

export default Contacts