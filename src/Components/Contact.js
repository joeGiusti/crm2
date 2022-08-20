import React, { useEffect, useState } from 'react'
import ArrowButtons from './ArrowButtons';
import ImageArrayViewer from './ImageArrayViewer';

function Contact(props) {

    const [imageIndex, setImageIndex] = useState(0)

    useEffect(()=>{
      setImageIndex(0)
      setTimeout(() => {
        var element = document.getElementById("contact"+props.index)
        if(element) 
            element.classList.add("blueGlow")
      }, props.index * 250); 
    },[])
 
    function imageLeft(event){
      event.stopPropagation()      
      // setImageIndex(imageIndex - 1)
      // return
      if(imageIndex > 0)
        setImageIndex(imageIndex - 1)
    }
    function imageRight(event){
      event.stopPropagation()
      // setImageIndex(imageIndex + 1)
      // return
      if(Array.isArray(props.contact.images) && imageIndex < (props.contact.images.length - 1))
        setImageIndex(imageIndex + 1)
    }

  return (
    <div className={'hoverBox contactBox '+props.contact.color} id={"contact"+props.contact.key} onClick={()=>props.openContact(props.contact)}>
        <div className='contactName'>                  
          {props.contact.name}
        </div>
        <ImageArrayViewer
          imageArray={props.contact.images}
        ></ImageArrayViewer>
    </div>
  )
}

export default Contact