import React, {useEffect} from 'react'

function Day(props) {
    useEffect(()=>{        
        setTimeout(() => {
            var element = document.getElementById("day"+props.index)
            if(element) 
                element.classList.add("blueGlow")
        }, props.index * 250); 
    },[])

  return (
    <div className='hoverBox day' key={"day"+props.index} id={"day"+props.index} onClick={props.openMenu}>
      {props.dayData.format("D") === "1" ? props.dayData.format("MMMM, DD") : props.dayData.format("DD")}      
    </div>
  )
}

export default Day