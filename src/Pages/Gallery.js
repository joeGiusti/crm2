import { increment } from 'firebase/database'
import { max } from 'moment'
import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

function Gallery(props) {
  
  // props.contactsArray

  const [greenImageUrls, setgreenImageUrls] = useState([])
  const [counter, setCounter] = useState(1)
  
  const firstEffect = useRef(true)

  useEffect(()=>{
    filterGreen()

    if(firstEffect.current){
      counterUp()
      firstEffect.current = false
    }

  },[props.contactsArray])

  function counterUp(){
    setCounter(Math.random())
    console.log("counter up"+counter)
    setTimeout(() => {
      counterUp()
    }, 5000);
  }

  function filterGreen(){
    
    if(!props.contactsArray)
      return

    // Get an array of green contacts
    var tempArray = []
    props.contactsArray.forEach(contact => {
      if(contact?.color == "Green")
        tempArray.push(contact)
    })
    console.log("found "+tempArray.length+"contacts")
    // get an array of all the images on the contacts
    var tempArray2 = []
    tempArray.forEach(contact => {
      tempArray2 = [...tempArray2, ...contact.images]      
    })
    console.log("images: "+tempArray2.length)
    setgreenImageUrls(tempArray2)
  }

  function randomNumber(_max){
    var number =  Math.floor(Math.random() * _max) + 1    
    return number
  }
  

  // choose a set number of images to display
  function chooseImages(){
    var numberOfImages = 30
    var tempArray = []
    var c = 0
    while(c<numberOfImages){
      // chose a random image
      var newUrl = greenImageUrls[randomNumber(greenImageUrls.length)]      
      tempArray.push(newUrl)
      c++
    }
    // greenImageUrls.forEach(imageUrl => {
    //   if(c < numberOfImages)
    //     tempArray.push(imageUrl)
    //   c++
    // })

    return tempArray
  }

  return (
    <div>      
      {chooseImages().map(imageUrl => (
        <div className='galleryImage'>            
          <img src={imageUrl}></img>
        </div>
      ))}
      {counter}
    </div>
  )
}

export default Gallery