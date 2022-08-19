import { connectStorageEmulator, ref } from 'firebase/storage'
import React, { useState } from 'react'
import "../Styles/Menus.css"
import {update, set, ref as dbRef, remove} from 'firebase/database'
import  {uploadBytes, ref as sRef ,getDownloadURL} from 'firebase/storage'

function ContactMenu(props) {    

  //\\// ==================== ==================== Vars and Init ==================== ==================== \\//\\
  // #region

  const [imageIndex, setImageIndex] = useState(0)

  // #endregion
  
  //\\// ==================== ==================== Display ==================== ==================== \\//\\
  // #region

  function imageLink(){
    return "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_508995.png&f=1&nofb=1"
    return props.contactData.images[imageIndex]
  }


  // #endregion

  //\\// ==================== ==================== DB ==================== ==================== \\//\\
  // #region

  function updateName(){
    var name = document.getElementById("nameInput").value
    update(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key), {name: props.StringToNumbers(name)})
  }
  function updateNotes(){
    var notes = document.getElementById("notesInput").value
    console.log("updating name to "+notes)
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/notes"), props.StringToNumbers(notes))
  }
  function updateStaus(){
    var status = document.getElementById("statusInput").value
    console.log("updating name to "+status)
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/color"), props.StringToNumbers(status))
  }
  function updateArchived(){
    var archiveStatus = document.getElementById("archiveInput").value
    set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/archived"), props.StringToNumbers(archiveStatus))

  }
  function updateImages(){
    // imageArray
  }
  
  function revert(){     
    console.log("reverting contact")   
    // update contact to props.selectedContact values
    update(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key), {
      name: props.StringToNumbers(props.selectedContact.name),
      notes: props.StringToNumbers(props.selectedContact.notes), 
      color: props.selectedContact.color,
      url: props.selectedContact.url,      
    })
    
    document.getElementById("nameInput").value = props.selectedContact.name
    document.getElementById("notesInput").value = props.selectedContact.notes
    document.getElementById("statusInput").value = props.selectedContact.color

  }
  function deleteContact(){
    document.getElementById("nameInput").value = "Contact Deleted"
    remove(dbRef(props.firebase.current.db, "images2/"+props.key))
  }

  // #endregion

  //\\// ==================== ==================== Helper ==================== ==================== \\//\\
  // #region


  // #endregion


  //\\// ==================== ==================== Images ==================== ==================== \\//\\
  // #region

  // Db upload 
  function addImage(image){
    console.log("adding image")
    console.log(image)
    
    // Get the url and display it
    var fileUrl = URL.createObjectURL(image)
    document.getElementById("imageDisplay").src = fileUrl
    
    // upload to db
    uploadBytes(sRef(props.firebase.current.storage, "images2/"+props.selectedContact.key), image).then(imageUpload => {
      getDownloadURL(imageUpload.ref).then(imageUrl => {
         console.log("uploaded image with url "+imageUrl)
         console.log("current image array")
         console.log(props.selectedContact.images)
         set(dbRef(props.firebase.current.db, "images2/"+props.selectedContact.key+"/images"), [imageUrl])
      })
    })
    // add the download url to the array in the db
    // display it in the viewer (update props.contact.images?)
    //   or get images array in useEffect, display that, and update that
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
  }

  // View
  function nextImage(){
    // setImageIndex(imageIndex + 1)    
    // return
    if(Array.isArray(props.selectedContact.images))
      if(imageIndex < props.selectedContact.images.length - 1)
        setImageIndex(imageIndex + 1)
  }
  function lastImage(){
    // setImageIndex(imageIndex - 1)    
    // return
    if(imageIndex > 0)
      setImageIndex(imageIndex - 1)
  }

  // #endregion

  return (
    <>
        { props.open &&  
          
            <div className='box2 menuBox blueGlow'>
                <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
                <div className='leftDiv'>
                  <img id="imageDisplay" src={props.selectedContact && Array.isArray(props.selectedContact.images) && props.selectedContact.images[imageIndex]} onDragOver={(e)=>imageDragOver(e)} onDrop={(e)=>imageDrop(e)}></img>
                  <div className='hoverBox imageButton left'>Edit</div>
                  <label className='hoverBox imageButton right' for="imageInput">+</label>
                  <div className="contactArrow left" onClick={lastImage}>{"<"}</div>
                  <div className='contactArrow right' onClick={nextImage}>{">"}</div>
                  <input type="file" id="imageInput" style={{display:"none"}} onChange={(event)=>newImageSelected(event)}></input>
                </div>
                <div className='contactImageInfo'>
                  <input id='nameInput' placeholder='Name' defaultValue={props.selectedContact ? props.selectedContact.name : ""} onChange={updateName}></input>
                  <select id='statusInput' placeholder='status' defaultValue={props.selectedContact ? props.selectedContact.color : ""} onChange={updateStaus}>
                    <option>Blue</option>
                    <option>Yellow</option>
                    <option>Green</option>
                    <option>Gray</option>
                    <option>Orange</option>
                    <option>LightBlue</option>                    
                  </select>                                                                                             
                  <textarea id='notesInput' placeholder='Notes' defaultValue={props.selectedContact ? props.selectedContact.notes : ""} onChange={updateNotes}></textarea>
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