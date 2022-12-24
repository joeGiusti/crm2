import { refFromURL, update } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { deleteObject, ref as storageRef } from 'firebase/storage'
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
                fromIndex.current = index                
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
        
        if(_fromIndex == _toIndex)
            return

        var tempArray = []
        var moveImage = imageArrayRef.current[_fromIndex]        

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
        
        // Remove image from the db
        if(props.firebase)
            deleteObject(storageRef(props.firebase.current.storage, imageArray[_index])).then(msg=>{
                console.log("deleted Image")
            })      
        else
            console.log("need firebase info to delete image "+imageArray[_index])

        // Set the ref array and state
        var tempArray = []
        imageArrayRef.current.forEach((imageUrl, index) => {
            if(index != _index)
            tempArray.push(imageUrl)
        })
        imageArrayRef.current = tempArray
        setImageArray(imageArrayRef.current)
        
    }

    const openViewer = useRef()
    const imageDetailIndex = useRef(0)
    const [showDetail, setShowDetail] = useState()
    function openImageDetail(index){
        // set the index to show in where it can be accessed
        imageDetailIndex.current = index
        setShowDetail(true)
    }

  return (
    <div className='pageBox imageArrayEdit'>
        <div className='closeButton' onClick={closeWindow}>x</div>
        {imageArray.map((imageUrl, index) => (
            <div className='imageEditImageContainer' onDragOver={(event)=>dragOver(event)} key={imageUrl+Math.random()}>
                <div 
                    draggable={true} 
                    className={"imageEditImageBox"} 
                    onDrag={()=>{openViewer.current = false}} 
                    onClick={()=>props.openImageDetail(props.imageArray, index)} 
                >   
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