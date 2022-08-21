import { connectStorageEmulator } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'

function TypeSelect(props) {
      
    const [filteredArray, setFilteredArray] = useState([])
    const filteredArrayRef = useRef([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const selectedIndexRef = useRef(-1)
    const [selectedValue, setSelectedValue] = useState(-1)
    const [hideOptions, setHideOptions] = useState(true)
    const justArrowed = useRef(false)

    useEffect(()=>{

        setFilteredArray(props.optionArray)
        filteredArrayRef.current = props.optionArray

        document.getElementById("selectText").addEventListener("focusout", ()=>{  
            // For some reason this runs even when clicking on the options, maybe because absolute positioning   
            console.log("focus out")       
            //setHideOptions(true)
        })
        document.getElementById("selectText").addEventListener("keyup", (event)=>{      
            
            // For double registering
            if(justArrowed.current)
                return      
            justArrowed.current = true
            setTimeout(() => {
                justArrowed.current = false
            }, 100);

            //console.log(event.key)
            if(event.key == "Escape")
                setHideOptions(true)

            if(event.key == "ArrowDown"){
                selectedIndexRef.current = selectedIndexRef.current + 1
                setSelectedIndex(selectedIndexRef.current)
            }
            if(event.key == "ArrowUp"){
                selectedIndexRef.current = selectedIndexRef.current - 1
                setSelectedIndex(selectedIndexRef.current)
            }
            if(event.key == "Enter"){
                selectOption(filteredArrayRef.current[selectedIndexRef.current])                          
            }            
        })
    },[])

    function selectOption(_option){
        console.log("a selected")
        console.log("selected "+_option)  
        setSelectedValue(_option)
        setHideOptions(true)     
        document.getElementById("textInput").value = _option
    }

  function typeChange(){
   
    var val = document.getElementById("textInput").value
    
    var tempArray = []   
    props.optionArray.forEach(value => {
        if(value.includes(val))
            tempArray.push(value)
    })

    setFilteredArray(tempArray)
    filteredArrayRef.current = tempArray

    setHideOptions(false)  

    setSelectedIndex(-1)
    selectedIndexRef.current = -1
  }

    return (
    <div id='selectText' className='typeSelect'>
        <input id='textInput' onChange={typeChange} onFocus={()=>setHideOptions(false)} className="typeSelectInput" autoComplete='off'></input>
        <div className={"typeSelectOptionHolder " + (hideOptions ? 'hidden':'')} onClick={console.log("hello"+Math.random())} >
            {filteredArray.map((value, index) => (
                <div onClick={()=>selectOption(filteredArrayRef.current[index])} className={"typeSelectOption "+((index == selectedIndex) ?" selected " : "")}>
                    {value}
                </div>
            ))}
        </div>
    </div>
  )
}

TypeSelect.defaultProps = {
    optionArray: ["apple", "bannana", "orange", "grape"]
}

export default TypeSelect