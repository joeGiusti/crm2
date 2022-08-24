import { useEffect, useRef, useState } from 'react';
import './App.css';
import Calendar from './Pages/Calendar';
import Contacts from './Pages/Contacts';
import Notes from './Pages/Notes';
import Gallery from './Pages/Gallery';
import Stats from './Pages/Stats';
import Account from './Pages/Account'
import Settings from './Pages/Settings'
import "./Styles/Vars.css"
import Sidebar from './Components/Sidebar';
import ContactMenu from './Components/ContactMenu';
import ImageDetail from './Components/ImageDetail';
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref as dbRef, set, push, update } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'firebase/storage'
import moment from 'moment'
import SpaceComponent from './Components/SpaceComponent';
import userEvent from '@testing-library/user-event';
import EventMenu from './Components/EventMenu';

function App() {
  
  //\\// ==================== ==================== Vars and Init ==================== ==================== \\//\\
  // #region
  const [page, setPage] = useState("calendar")

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [displayContactMenu, setDisplayContactMenu] = useState(false)  
  const [displayImageDetail, setDisplayImageDetail] = useState(false)  
  const [displayEventMenu, setDisplayEventMenu] = useState(false)

  const [contactsArray, setContactsArray] = useState([])
  const [eventsArray, setEventsArray] = useState([])
  const [dayOfFocus, setDayOfFocus] = useState(moment().clone())
  const [imageDetailArray, setImageDetailArray] = useState([])

  const [search, setSearch] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedContact, setSelectedContact] = useState({
    name: "",
    key: "",
    color: "Gray",
    notes: "",
    url: "",
    urlList: [], 
    archived: false,
  })

  const tabDown = useRef(false)
  const firebase = useRef(null)
  const tabIndexRef = useRef(0)

  useEffect(()=>{
    setUpKeyListener()
    // setBackground("https://i.ytimg.com/vi/Y1qQZbTF8iQ/maxresdefault.jpg")
    // setBackground("./Images/cubefield.gif")
    firebaseSetup()
    loadContacts()
    loadEventsArray()
    //window.focus(document.getElementById("root"))    
    
  },[])

  function firebaseSetup() {
    // Connect to the app and get refs to the db and storage
    var app = initializeApp({
      apiKey: "AIzaSyDCrQSCE91lh7GYlr7eTFbX--e1NnvF7Uw",
      authDomain: "practice-79227.firebaseapp.com",
      databaseURL: "https://practice-79227-default-rtdb.firebaseio.com",
      projectId: "practice-79227",
      storageBucket: "practice-79227.appspot.com",
      messagingSenderId: "283438782315",
      appId: "1:283438782315:web:d913f1ed9d87b5401a1e2e"
    })
    var db = getDatabase(app)
    var storage = getStorage(app)
    
    // Save a ref to the refs
    firebase.current = {app: app, db: db, storage: storage}
    
  }  

  function setBackground(url){
    // live data from the international space station might be cool
    // https://www.youtube.com/watch?v=Y1qQZbTF8iQ
    // https://www.youtube.com/watch?v=86YLFOog4GM
    document.getElementById("mainApp").style.backgroundImage = "url("+url+")"    
  }

  // Put this isn app.js because it adds another event listener every time App.js refreshes and useEffect is called
  function keyPressSetup(){
    window.addEventListener("keyup", (event) => {      
            
      if(event.key == "Tab"){
        console.log("pressed tab")

        //tabIndexRef.current = tabIndexRef.current + 1    
        
        if(tabIndexRef.current == 0)
          tabIndexRef.current = tabIndexRef.current = 1
        else
          tabIndexRef.current = tabIndexRef.current = 0

        if(tabIndexRef.current == 0)
          document.getElementById("nameInput").focus()
        if(tabIndexRef.current == 1)
          document.getElementById("notesInput").focus()
      }         

    })
  }

  const justTabbed = useRef(false)

  function tabFocus(){    
    
    if(!justTabbed.current)
      console.log("tab focus"+Math.random())

    // This makes it so there is only one tab press
    justTabbed.current = true
    setTimeout(() => justTabbed.current = false, 100);
  }

  function setUpKeyListener(){
    window.addEventListener("keydown", (event) => {      
            
      if(event.key == "Tab"){        
        //event.preventDefault()
        tabDown.current = true                     
      }         

      if(tabDown.current)
        event.preventDefault()

      if(tabDown.current && event.key == "u")
        closeSidebar()
      if(tabDown.current && event.key == "i")
        openSidebar()
      if(tabDown.current && event.key == "h")
        setPage("calendar")
      if(tabDown.current && event.key == "j")
        setPage("contacts")
      if(tabDown.current && event.key == "k")
        setPage("notes")
      if(tabDown.current && event.key == "l")
        setPage("gallery")
      if(tabDown.current && event.key == ";")
        setPage("stats")   
      if(tabDown.current && event.key == "'")
        setPage("settings")        
      if(tabDown.current && event.key == "m")
        newContact()
      if(tabDown.current && event.key == "n")
        newEvent()      
      if(tabDown.current && event.key == ","){        
        setSidebarOpen(true)
        document.getElementById("searchInput").focus()
      }
      if(tabDown.current && event.key == "."){
        setSearch("")
        document.getElementById("searchInput").value = ""
      }
          
      if(tabDown.current && event.key == "y")
        closeAll()
      if(event.key == "Escape"){
        closeAll()
        document.getElementById("searchInput").value = "" 
      }
            
    })
    window.addEventListener("keyup", (event) => {
        if(event.key == "Tab"){
          //event.preventDefault()
          tabDown.current = false
        }                
    })
  }

  // #endregion

  //\\// ==================== ====================    Display    ==================== ==================== \\//\\
  // #region
  
  function DisplayPage(){    
    if(page === "calendar")
      return(
        <Calendar          
          firebase={firebase}          
          contactData={contactData}
          eventArray={eventsArray}
          NumbersToString={NumbersToString}
          StringToNumbers={StringToNumbers}
          contactsArray={contactsArray}
          dayOfFocus={dayOfFocus}
          setDayOfFocus={setDayOfFocus}
          updateContactDb={updateContactDb}
        ></Calendar>
      )
    if(page === "contacts")
      return(
        <Contacts
          openMenu={setDisplayContactMenu}
          firebase={firebase}
          contactsArray={filterContacts(contactsArray)}
          setSelectedContact={setSelectedContact}
          openContact={openContact}
          newContact={newContact}
          createContactDb={createContactDb}
          updateContactDb={updateContactDb}
        ></Contacts>
      )
    if(page === "notes")
      return(
        <Notes
        
        ></Notes>
      )
    if(page === "gallery")
      return(
        <Gallery
        
        ></Gallery>
      )
    if(page === "stats")
      return(
        <Stats
        
        ></Stats>
      )
    if(page === "account")
      return(        
        <Account
        
        ></Account>
      )
    if(page === "settings")
      return(        
        <Settings
        
        ></Settings>
      )

  }

  function openSidebar(event){
    setSidebarOpen(true)
    if(event)
      event.stopPropagation()
  }
  function closeSidebar(event){        
      setSidebarOpen(false)
      if(event)
          event.stopPropagation()
  }
  function closeAll(){
    //setDisplaEventMenu(false)
    setDisplayContactMenu(false)
    setSidebarOpen(false)
  }


  function openContact(_contact){    
    console.log("opening contact")
    console.log(_contact)
    setSelectedContact(_contact)
    setDisplayContactMenu(true)
  }

  // Opens the new contact button
  function newContact(){
    setSelectedContact({
      name: "",
      key: "",
      color: "Gray",
      notes: "",
      url: "",
      urlList: [], 
      newContact: true,
    })
    setDisplayContactMenu(true)
  }
  function newEvent(){
    //setDisplayEventMenu(true)
    //setSelectedEvent({})    
  }

  function openImageDetail(_imageUrlArray){
    setImageDetailArray(_imageUrlArray)
    setDisplayImageDetail(true)
  }

  

  // #endregion


  //\\// ==================== ==================== Load ==================== ==================== \\//\\
  // #region
  function loadContacts(){
    onValue(dbRef(firebase.current.db, "images2"), imagesSnap => {
      var images = []
      imagesSnap.forEach(imageSnap => {

        // Get the name of the image and convert it if necessary
        var imageSnapName = imageSnap.child("name").val()        
        if(imageSnapName)
          if(imageSnapName.includes(","))
            imageSnapName=NumbersToString(imageSnapName)

        // Get the image notes and convert it if necessary
        var imageSnapNotes = imageSnap.child("notes").val()        
        if(imageSnapNotes)
          if(imageSnapNotes.includes(","))
            imageSnapNotes=NumbersToString(imageSnapNotes)
            
        // Put the values in an object and push it in a temp array which will be added to state

        images.unshift({
          name: imageSnapName,
          notes: imageSnapNotes,
          color: imageSnap.child("color").val(),
          url: imageSnap.child("url").val(),
          images: imageSnap.child("images").val(),
          key: imageSnap.key,
          archived: imageSnap.child("archived").val()
        })
      })

      // Add the temp array to state
      setContactsArray(images)            
    })
  }    
  function filterContacts(_contactsArray){

    if(!Array.isArray(_contactsArray))
      return

    // Filter by search
    var tempArray = []
    _contactsArray.forEach(contact => {      
      if( contact.name && typeof contact.name === 'string' && contact.name.toLowerCase().includes(search.toLocaleLowerCase()))
        tempArray.push(contact)
    })

    // Filter out archived
    if(!showArchived){
      var tempArray2 = []
      tempArray.forEach(contact => {
        if(contact.archived){

        }
        else{
          tempArray2.push(contact)
        }
      })
      tempArray = tempArray2
    }

    // Sort by status
    var grayContacts = []
    var blueContacts = []
    var yellowContacts = []
    var darkGreenContacts = []
    var orangeContacts = []
    var clearContacts = []
    var greenContacts = []
    var otherContacts = []
    tempArray.forEach(contact => {
      if(contact.color == "Gray")
        grayContacts.push(contact)
      else if(contact.color == "Blue")
        blueContacts.push(contact)
      else if(contact.color == "Yellow")
        yellowContacts.push(contact)
      else if(contact.color == "Orange")
        orangeContacts.push(contact)
      else if(contact.color == "Green")
        greenContacts.push(contact)      
      else if(contact.color == "Clear")
        clearContacts.push(contact)
      else
        otherContacts.push(contact)
    })
    console.log(tempArray)
    tempArray = [...grayContacts, ...blueContacts, ...yellowContacts, ...orangeContacts, ...greenContacts, ...clearContacts, ...otherContacts,]
    console.log(tempArray)

    return tempArray
  }
  function loadEventsArray(){
    if(firebase.current)
      onValue(dbRef(firebase.current.db, "events"), eventsSnap => {
        var tempArray = []        
        eventsSnap.forEach(eventSnap => {
          
          var tempEvent = eventSnap.val()

          tempArray.push(tempEvent)

        })
        setEventsArray(tempArray)
      })
  }
  // #endregion
  
  //\\// ==================== ==================== Save / Delete ==================== ==================== \\//\\
  // #region

  function createContactDb(_contactData){

    var newRef = push(dbRef(firebase.current.db, "images2"))

    var tempContactData = {
      name: _contactData.name,
      notes: _contactData.notes,      
      status: _contactData.status,
      images:_contactData.images,
      dateCreated: moment().format("DD-MMMM-YYYY"),
    }

    tempContactData.key = newRef.key

    updateContactDb(tempContactData)
    
  }

  function updateContactDb(_contactData){

    var tempContactData = _contactData
    
    if(_contactData.name)
      tempContactData.name = StringToNumbers(_contactData.name)
    if(_contactData.notes)
      tempContactData.notes = StringToNumbers(_contactData.notes)

    update(dbRef(firebase.current.db, "images2/"+_contactData.key), _contactData)

  }

  // #endregion
  
  //\\// ==================== ==================== Auth ==================== ==================== \\//\\
  // #region

  // #endregion
  
  //\\// ==================== ==================== Helper Functions ==================== ==================== \\//\\
  // #region

  var word = "theWord24&B"
  function NumbersToString(string){    
    
    // If there is no string just return
    if(!string)
      return ""

    if(typeof(string) !== 'string')
      return

    // Initial values
    var c = 0
    var returnString =""    

    // Make a list of char codes from the string
    var charCodes = string.split(',')

    c=0
    // Convert and place each character
    for(var i = 0; i<charCodes.length; i++){
        returnString += String.fromCharCode(parseInt(charCodes[i])-word.charCodeAt(c++))            
        c = c%word.length
    }                                    
    // Return
    return returnString
  }
  function StringToNumbers(string){      
    // If there is no string just return
    if(!string)
      return ""
    if(typeof(string) !== 'string')
      return

    // Initial values
    var c = 0
    var returnString = ""

    // Go through each one
    for(var i = 0; i<string.length; i++){
         returnString += string.charCodeAt(i)+word.charCodeAt(c++)+","
         c = c%word.length
    }
    returnString = returnString.slice(0, returnString.length-1)        

    // Return the result
    return returnString;
  }

  function addImageArrays(){
    contactsArray.forEach(contact => {
      set(dbRef(firebase.current.db, "images2/"+contact.key+"/images"),         
        [contact.url]
      )
    })
  }
  function contactData(_key){
    if(_key == "None")
      return {name:""}
        
    var tempContactData = {name:""}
    contactsArray.forEach(contact => {     
      // console.log(contact.key + " =? " + _key) 
      if(contact.key == _key){        
        tempContactData = contact        
      }
    })
    
    return tempContactData
  }
  // #endregion

  return (
    <div className="App" id='mainApp' onClick={closeSidebar}>
      <div>
        <Sidebar
          setPage={setPage}
          open={sidebarOpen}
          openFunction={openSidebar}
          closeFunction={closeSidebar}
          setSearch={setSearch}  
        ></Sidebar>
        {DisplayPage()}
        {displayContactMenu && 
          <ContactMenu
            setOpen={setDisplayContactMenu}
            open={displayContactMenu}            
            selectedContact={selectedContact}
            firebase={firebase}
            StringToNumbers={StringToNumbers}
            createContactDb={createContactDb}     
            updateContactDb={updateContactDb}               
            openImageDetail={openImageDetail}
          ></ContactMenu>
        }
        {displayEventMenu &&
          <EventMenu
            updateContactDb={updateContactDb}
          ></EventMenu>
        }        
        {displayImageDetail &&
          <ImageDetail
            imageArray={imageDetailArray}
            setOpen={setDisplayImageDetail}
          ></ImageDetail>
        }
        {/* <SpaceComponent></SpaceComponent> */}
      </div>
    </div>
  );
}

export default App;

