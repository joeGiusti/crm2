import React from 'react'
import { useRef } from 'react'
import { useEffect, useState } from 'react'

function Scroller(props) {

    
    // An array of image url's to map
    const [imageArray, setImageArray] = useState([])
    const imageArrayRef = useRef([])

    // An array of all the greem image urls
    const greenImageUrls = useRef([])
    const scrollerref = useRef()
    const scrollerTimeout = useRef()

    useEffect(()=>{
        
        // Create the array of image urls from green contacts
        greenImageUrls.current = filterGreen()        
        
        // Add an initial 10 images to the array
        addImages(10)

        // Creates an intersection observer
        setUpIntersectionOberver()

        //pageScroll()
    },[])


    // use intersection observer to add more the the array when at a certain point

    // Add images to the array
    function addImages(_count){
        
        // Get _count new images to add to the array
        var tempArray = []
        var c = 0
        while(c < _count){
            tempArray.push(greenImage())
            c++
        }
        
        const newImageArray = [...imageArrayRef.current, ...tempArray]
        
        // Set the image array to what was there plus the new ones
        imageArrayRef.current = newImageArray
        setImageArray(newImageArray)
    }

    function setUpIntersectionOberver(){

        const observer = new IntersectionObserver((event)=>{            
            if(event[0].isIntersecting){
                
                console.log("found intersecting image")
                
                // Remove the observer and class             
                const observedElement = event[0].target
                observedElement.classList.remove("toObserve")
                observer.unobserve(observedElement)
                
                // Add more images
                addImages(10)                                                               

                // Looks for images that should be observed and observes them (it waits for state to update then calls this)
                setTimeout(() => {
                    lookToObserve(observer)
                }, 500);
            }
        })

        // For the initial setup. Could alternatively put observer in a ref and call this from use state
        setTimeout(() => {
            lookToObserve(observer)
        }, 500);

    }
    function lookToObserve(observer){

        // Get an arry of posts that should be observed
        var postsToObserve = document.querySelectorAll(".toObserve")

        // Tell the observer to observe them
        postsToObserve.forEach(postElement => {
            observer.observe(postElement)
        })

    }

    // Returns an array of the image urls from the green contacts
    function filterGreen(){
    
        if(!props.contactsArray)
          return
    
        // Create an array of green contacts
        var tempArray = []
        props.contactsArray.forEach(contact => {
          if(contact?.color == "Green")
            tempArray.push(contact)
        })

        // Create an array of all the images on the contacts
        var tempArray2 = []
        tempArray.forEach(contact => {
          tempArray2 = [...tempArray2, ...contact.images]      
        })

        // Return a list of the images from green contacts
        return tempArray2

    }

    // a random number from 0 to _max - 1
    function randomNumber(_max){
        var number =  Math.floor(Math.random() * _max) + 1    
        return number
    }

    // Return a random image url from the array of green image urls
    function greenImage(){     

        var imageUrl = greenImageUrls.current[randomNumber(greenImageUrls.current.length)]              
        
        return imageUrl

    }
    // If the index is one that should be observed the proper class will be returned
    function checkIndex(index){        
        
        if(index == imageArray.length - 4)
            return("toObserve")
    }

    function pageScroll() {                
        if(scrollerref.current){
            scrollerref.current.scrollBy(0,1.5);
            scrollerTimeout.current = setTimeout(pageScroll,50)            
        }
    }
    function startScroll(){
        if(!scrollerTimeout.current)
            pageScroll()
    }
    function pauseScroll(){
        if(scrollerTimeout.current){
            clearTimeout(scrollerTimeout.current)
            scrollerTimeout.current = null
        }
    }
    return (
        <>
            <div className='scrollerButtons'>
                <button onClick={startScroll}>Start Auto Scroll</button>
                <button onClick={pauseScroll}>Pause Auto Scroll</button>
            </div>
            <div className='scrollerContainer'>
                <div className='scroller' ref={scrollerref}>
                    <div className='height20'></div>
                    {imageArray.map((imageUrl, index) => (
                        <div className={checkIndex(index)}>
                            <img src={imageUrl}></img>
                        </div>
                    ))}
                </div>
            </div>
        </>
  )
}

export default Scroller