import React, { useEffect, useState } from 'react'
import ArrowButtons from './ArrowButtons';

function Contact(props) {

    const [imageIndex, setImageIndex] = useState(0)

    useEffect(()=>{
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
    <div className={'hoverBox contactBox '+props.contact.color} key={"contact"+props.index} id={"contact"+props.index} onClick={()=>props.openContact(props.contact)}>
        <div className='contactName'>                  
          {props.contact.name}
        </div>
        {Array.isArray(props.contact.images) &&        
          <img src={props.contact.images[imageIndex]}></img>
        }
        {Array.isArray(props.contact.images) && props.contact.images.length > 1 &&
          <div>          
            <div className='contactArrow left' onClick={(event) => imageLeft(event)}>{"<"}</div>
            <div className='contactArrow right' onClick={(event) => imageRight(event)}>{">"}</div>
          </div>
        }
    </div>
  )
}

export default Contact