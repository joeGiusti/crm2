import { connectStorageEmulator } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'

function TypeSelectContacts(props) {
      
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
        
        setSelectedValue(_option)
        setHideOptions(true)     
        document.getElementById("textInput").value = _option.name
        
        props.selectContact(_option)
    }

  function typeChange(){
   
    var val = document.getElementById("textInput").value
    
    // Filter the array of contacts
    var tempArray = []   
    tempArray = filter(val)
    


    setFilteredArray(tempArray)
    filteredArrayRef.current = tempArray

    setHideOptions(false)  

    setSelectedIndex(-1)
    selectedIndexRef.current = -1
  }

  function filter(_value){
    var tempArray = []
    
    // Make sure there is a valid comparison value
    if(!_value || typeof _value != "string")
        return props.optionArray

    // Make it lower case so the search is not case sensitive
    var lcValue = _value.toLowerCase()

    props.optionArray.forEach(contact => {
        if(compareContactName(contact, lcValue))
            tempArray.push(contact)
    })
    return tempArray
  }

  function compareContactName(_contact, _value){
    if(!_contact || !_contact.name)
        return false

    if(typeof _contact.name !== "string")
        return false

    var name = _contact.name.toLowerCase()

    if(name.includes(_value))
        return true

  }

    return (
    <div id='selectText' className='typeSelect'>
        <input id='textInput' onChange={typeChange} onFocus={()=>setHideOptions(false)} className="typeSelectInput" autoComplete='off'></input>
        <div className={"typeSelectOptionHolder " + (hideOptions ? 'hidden':'')} >
            {filteredArray.map((contact, index) => (
                <div onClick={()=>selectOption(filteredArrayRef.current[index])} className={"typeSelectOption "+((index == selectedIndex) ?" selected " : "")}>
                    {contact.name}
                </div>
            ))}
        </div>
    </div>
  )
}

TypeSelectContacts.defaultProps = {
    optionArray: [
        {
            name:"apple",
            key:"-1234"
        },
        {
            name:"bannana",
            key:"-2234"
        },
        {
            name:"orange",
            key:"-3234"
        },
        {
            name:"grape",
            key:"-4234"
        },
    ],
    selectContact: (_option) => {console.log("selected contact with name "+_option.name) } 
}

export default TypeSelectContacts