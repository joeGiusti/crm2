import { refFromURL } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'

// on dragstart get moveFrom index
// on dragover get moveTo index
// on drag end move array of that index to moveToIndex

function ImageArrayEdit(props) {

    const fromIndex = useRef(0)
    const toIndex = useRef(0)

    const [imageArray, setImageArray] = useState([])
    const imageArrayRef = useRef([])

    useEffect(()=>{
        setImageArray(props.imageArray)
        imageArrayRef.current = props.imageArray

        //setUpListeners()
        setTimeout(() => {
            setUpListeners()
        }, 200);
    },[])
    
    const setUpListenersA = useRef(false)
    function setUpListeners(){
        
        if(setUpListenersA.current)
            return
        setUpListenersA.current = true        

        var imageBoxes = document.querySelectorAll('.imageEditImageContainer')                        

        imageBoxes.forEach((imageBox, index) => {
            imageBox.addEventListener("dragstart", event =>{
                //event.preventDefault()
                fromIndex.current = index
                console.log("aaa")
            })
        })
        imageBoxes.forEach((imageBox, index) => {
            imageBox.addEventListener("dragover", event =>{
                event.preventDefault()
                toIndex.current = index
            })
        })
        imageBoxes.forEach((imageBox, index) => {
            imageBox.addEventListener("dragend", event =>{
                event.preventDefault()
                swapImages(fromIndex.current, toIndex.current)
            })
        })
    }

    function swapImages(_fromIndex, _toIndex){
        console.log("swapping " + _fromIndex+ " to " + _toIndex)
        console.log(imageArrayRef.current)
        
        if(_fromIndex == _toIndex)
            return

        var tempArray = []
        var moveImage = imageArrayRef.current[_fromIndex]
        console.log("moving "+moveImage)

        imageArrayRef.current.forEach((imageUrl, index) => {
            
            // push all but the from one
            if(_fromIndex == index)                           {
                // do nothing
                //tempArray.push(imageUrl)
            }
            // Push the selected one then the next one
            else if(_toIndex == index){
                if(_fromIndex > _toIndex){
                    tempArray.push(moveImage)
                    tempArray.push(imageUrl)
                }
                else{
                    tempArray.push(imageUrl)
                    tempArray.push(moveImage)
                }
            }            
            else{
                tempArray.push(imageUrl)
            }


        })

        console.log("setting image array")
        console.log(tempArray)
 
        imageArrayRef.current = tempArray
        setImageArray(tempArray)     
        
        
        setTimeout(() => {
            setUpListenersA.current = false
            setUpListeners()            
        }, 200);
    }

    function dragOver(event){
        event.preventDefault()
    }

    function closeWindow(){        
        props.saveArray(imageArrayRef.current)
        props.setDisplay(false)
    }
    function cancel(){
        props.setDisplay(false)
    }
    function deleteImage(_index){
        console.log("deleting image at index "+_index)
    }

  return (
    <div className='pageBox imageArrayEdit'>
        <div className='closeButton' onClick={closeWindow}>x</div>
        {imageArray.map((imageUrl, index) => (
            <div className='imageEditImageContainer' onDragOver={(event)=>dragOver(event)} key={imageUrl+Math.random()}>
                <div draggable={true} className={"imageEditImageBox"}>   
                    <div className='closeButton smallCloseButton' onClick={()=>deleteImage(index)}>x</div>
                    <img src={imageUrl}></img>
                </div>
            </div>
        ))}        
        <div className='button' onClick={cancel}>Cancel</div>
    </div>
  )
}

ImageArrayEdit.defaultProps = {
    imageArray: ["www.url.net", "www.url.net"], 
    setDisplay: () => {},
    saveArray:  (prop) => {console.log("saveArray:"); console.log(prop)},
}

export default ImageArrayEdit