import React, { useEffect, useState } from 'react'
import ImageArrayViewer from './ImageArrayViewer';

function Contact(props) {

    useEffect(()=>{
      
      // Add blueGlow based in the index to create a cool effect
      setTimeout(() => {
        var element = document.getElementById("contact"+props.index)
        if(element) 
            element.classList.add("blueGlow")
      }, props.index * 250); 

    },[])
 

  return (
    <div 
      className={'hoverBox contactBox '+props.contact.color} 
      id={"contact"+props.contact.key} 
      onClick={()=>props.openContact(props.contact)}
    >
      <ImageArrayViewer
        imageArray={(props.contact && props.contact.images) && props.contact.images.length > 0 ? props.contact.images : ["https://firebasestorage.googleapis.com/v0/b/practice-79227.appspot.com/o/images2%2F-MteKD1lOtpuKqb8Dx_J?alt=media&token=bdaa5943-b7d1-4b59-a76b-b94861ed5f9e"]}          
        message={props.contact.name}
        messageClass={"contactName"}
      ></ImageArrayViewer>
    </div>
  )
}

export default Contact