import React, { useEffect, useState } from 'react'

function ImageArrayViewer(props) {
  const [index, setIndex] = useState(0)
    
    useEffect(()=>{
        console.log("image array viewer image array: ")
        console.log(props.imageArray)
        console.log((Array.isArray(props.imageArray) && (props.imageArray.length > 0)))
    },[])

    function nextImage(event){
        event.stopPropagation()
        if(index < (props.imageArray.length - 1))
            setIndex(index + 1)
    }
    function lastImage(event){
        event.stopPropagation()
        if(index > 0)
            setIndex(index - 1)
    }

  return (
    <div className='imageArrayViewer' onClick={()=>props.onClick(props.imageArray)}>
        <img src={Array.isArray(props.imageArray) && props.imageArray[index]}></img>
        <div className={props.messageClass}>{props.message}</div>
        { Array.isArray(props.imageArray) && (props.imageArray.length > 1) &&
            <>
                <div className="contactArrow left" onClick={(event)=>lastImage(event)}>{"<"}</div>
                <div className='contactArrow right' onClick={(event)=>nextImage(event)}>{">"}</div>
            </>
        }
    </div>    
  )
}

ImageArrayViewer.defaultProps = {
  onClick: ()=>{}
}

export default ImageArrayViewer