import { connectStorageEmulator, ref } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import "../Styles/Menus.css"
import {update, set, ref as dbRef, remove} from 'firebase/database'
import  {uploadBytes, ref as sRef ,getDownloadURL} from 'firebase/storage'
import userEvent from '@testing-library/user-event'
import ImageArrayViewer from './ImageArrayViewer'

function ContactMenu(props) {    

  // next steps
  // when image is added upload to the image array and display
  //   file select and drag over
  // the new one is index 0
  // can look through those images with arrow keys
  // images are uploaded when menu closes
  //   also with save button
  // those images are loaded and viewable when contact is clicked again

  //\\// ==================== ==================== Vars and Init ==================== ==================== \\//\\
  // #region

  const [imageIndex, setImageIndex] = useState(0)
  const [imageArray, setImageArray] = useState([])
  const updated = useRef(false)
  const imagesToUpload = useRef([])

  // this is a list of image links as they are loaded from or into the db
  const dbImages = useRef([])

  useEffect(()=>{
    if(props.selectedContact && Array.isArray(props.selectedContact.images))
      setImageArray(props.selectedContact.images)
      dbImages.current = props.selectedContact.images
  },[])

  // #endregion
  
  //\\// ==================== ==================== Display ==================== ==================== \\//\\
  // #region

  function imageLink(){
    return "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_508995.png&f=1&nofb=1"
    return props.contactData.images[imageIndex]
  }


  // #endregion

  //\\// ==================== ==================== DB Old ==================== ==================== \\//\\
  // #region

  function updateName(){
    var name = document.getElementById("nameInput").value
    update(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key), {name: props.StringToNumbers(name)})
  }
  function updateNotes(){
    var notes = document.getElementById("notesInput").value    
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/notes"), props.StringToNumbers(notes))
  }
  function updateStaus(){
    var status = document.getElementById("statusInput").value    
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/color"), props.StringToNumbers(status))
  }
  function updateArchived(){
    var archiveStatus = document.getElementById("archiveInput").value
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/archived"), props.StringToNumbers(archiveStatus))

  }
  function updateImages(){
    // imageArray
  }    
  // #endregion

  //\\// ==================== ==================== DB ==================== ==================== \\//\\
  // #region
  
  // If a change is made the db needs to be updated when the menu is closed
  function needsUpdate(){
    update.current = true
  }

  // Updates the db and closes the menu
  function closeMenu(){
    
    // Save the input data into db
    if(updated.current)
      updateContactsDb()
    
    // Close the menu
    props.setOpen(false)
  }

  function updateContactsDb(){

    // Gather the info
    var name = document.getElementById("nameInput").value
    var notes = document.getElementById("notesInput").value
    var status = document.getElementById("statusInput").value

    if(props.selectedContact.newContact)
      props.createContact({
        name: name,
        notes: notes,
        status: status,
        images:[]  
      })

    // Put it in the db
    props.updateContactsDb({
      name: name,
      notes: notes,
      status: status,
      images:[]      
    })
  }

  // Reverts the contact to the way it was before any changes were made *!*! needs to be updated
  function revert(){     
    console.log("reverting contact")   
    // update contact to props.selectedContact values
    // update(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key), {
    //   name: props.StringToNumbers(props.selectedContact.name),
    //   notes: props.StringToNumbers(props.selectedContact.notes), 
    //   color: props.selectedContact.color,
    //   url: props.selectedContact.url,      
    // })
    
    // Set the values to what they were before
    document.getElementById("nameInput").value = props.selectedContact.name
    document.getElementById("notesInput").value = props.selectedContact.notes
    document.getElementById("statusInput").value = props.selectedContact.color
    
    // reset the image array
    if(props.selectedContact && Array.isArray(props.selectedContact.images))
      setImageArray(props.selectedContact.images)
  }  
  
  // Deletes the contact in the db and closes the menu
  function deleteContact(){
    document.getElementById("nameInput").value = "Contact Deleted"
    remove(dbRef(props.firebase.current.db, "images2/"+props.key))
    props.setOpen(false)
  }

  // #endregion

  //\\// ==================== ==================== Helper ==================== ==================== \\//\\
  // #region


  // #endregion


  //\\// ==================== ==================== Images ==================== ==================== \\//\\
  // #region

  // in useEffect images are loaded from selectedContact.images into a state array so it can be modified
  // adding image to contact will put it in the array of contacts that are displayed
  // when menu closes (or save is pressed, or tab + s) they are uploaded and the links are saved into an array and put in the db

  // Db upload 
  function addImage(file){
  
    console.log("uploading image "+file)
    console.log(imageArray)

    // Display it immediately
    setImageArray([URL.createObjectURL(file), ...imageArray])
    
    //Upload to db (adding a random number at the end so it doesn't over write)
    uploadBytes(sRef(props.firebase.current.storage, "images2/"+props.selectedContact.key + (Math.random())*1000), file).then(imageUpload => {
      getDownloadURL(imageUpload.ref).then(imageUrl => {

        // Keep track of the current image urls so multiple can be uploaded and correct array will be put in the db (state will not be accurate here)
        dbImages.current = [imageUrl, ...dbImages.current ]
        set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/images"), dbImages.current)
         
      })
    })
  }

  // Image sources
  function newImageSelected(event){    
    var file = event.target.files[0]    
    addImage(file)    
  }
  function imageDragOver(event){
    event.preventDefault()
  }
  function imageDrop(event){
    event.preventDefault()
    var file = event.dataTransfer.files[0]
    addImage(file)
    // console.log(event.dataTransfer.files)
    // for(var fileId in event.dataTransfer.files)
    //  addImage(event.dataTransfer.files[fileId])
    return
    event.dataTransfer.files.forEach(file =>{

      addImage(file)  
    })
  }


  // View
  function nextImage(){
    setImageIndex(imageIndex + 1)    
    console.log("going to image " + (imageIndex + 1))
    //console.log(imageArray[imageIndex + 1])
    return

    if(imageIndex < imageArray.length - 1)
      setImageIndex(imageIndex + 1)
  }
  function lastImage(){
    setImageIndex(imageIndex - 1)    
    console.log("going to image " + (imageIndex - 1))
    //console.log(imageArray[imageIndex - 1])
    return
    if(imageIndex > 0)
      setImageIndex(imageIndex - 1)
  }

  // #endregion

  return (
    <>
        { props.open &&  
          
            <div className='box2 menuBox blueGlow'>
                <div className='closeButton' onClick={()=>closeMenu()}>x</div>
                <div className='leftDiv'> 
                <div className='imageDisplayContainer' onDragOver={(e)=>imageDragOver(e)} onDrop={(e)=>imageDrop(e)}>
                  <ImageArrayViewer
                    imageArray={imageArray}
                  ></ImageArrayViewer>
                </div>
                  {/* <img id="imageDisplay" src={imageArray[imageIndex]} onDragOver={(e)=>imageDragOver(e)} onDrop={(e)=>imageDrop(e)}></img> */}
                  <div className='hoverBox imageButton left'>Edit</div>
                  <label className='hoverBox imageButton right' htmlFor="imageInput">+</label>
                  <input type="file" id="imageInput" style={{display:"none"}} onChange={(event)=>newImageSelected(event)}></input>
                </div>
                <div className='contactImageInfo'>
                  <input id='nameInput' placeholder='Name' defaultValue={props.selectedContact ? props.selectedContact.name : ""} onChange={needsUpdate}></input>
                  <select id='statusInput' placeholder='status' defaultValue={props.selectedContact ? props.selectedContact.color : ""} onChange={needsUpdate}>
                    <option>Blue</option>
                    <option>Yellow</option>
                    <option>Green</option>
                    <option>Gray</option>
                    <option>Orange</option>
                    <option>LightBlue</option>                    
                  </select>                                                                                             
                  <textarea id='notesInput' placeholder='Notes' defaultValue={props.selectedContact ? props.selectedContact.notes : ""} onChange={needsUpdate}></textarea>
                  <div className='box hoverBox button' onClick={deleteContact}>Delete</div>
                  <div className='box hoverBox button' onClick={revert}>Revert</div>
                </div>
            </div>
        }
    </>
  )
}
ContactMenu.defaultProps = {
    open: false,
    setOpen: (param) => {console.log("no function: setting open to " + param)}
}
export default ContactMenu