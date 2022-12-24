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
import { getDatabase, onValue, ref as dbRef, set, push, update, orderByValue } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL, connectStorageEmulator } from 'firebase/storage'
import moment from 'moment'
import SpaceComponent from './Components/SpaceComponent';
import userEvent from '@testing-library/user-event';
import EventMenu from './Components/EventMenu';
import Log from './Pages/Log';
import { isCompositeComponent } from 'react-dom/test-utils';
import Auth from './Pages/Auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Scroller from './Pages/Scroller';

function App() {
  
  //\\// ==================== ==================== Vars and Init ==================== ==================== \\//\\
  // #region

  // Page
  const [page, setPage] = useState("auth")
  const [userId, setUserId] = useState(null)

  // Display
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [displayContactMenu, setDisplayContactMenu] = useState(false)  
  const [displayImageDetail, setDisplayImageDetail] = useState(false)  
  const [displayEventMenu, setDisplayEventMenu] = useState(false)

  // Data Arrays
  const [contactsArray, setContactsArray] = useState([])
  const [eventsArray, setEventsArray] = useState([])
  const [imageDetailArray, setImageDetailArray] = useState([])
    
  // Object Data
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const dayOfFocusRef = useRef(moment().clone())
  const [dayOfFocus, setDayOfFocus] = useState(dayOfFocusRef.current)

  // Filters
  const [search, setSearch] = useState("")
  const [showGrayContacts, setShowGrayContacts] = useState(true)
  const [showBlueContacts, setShowBlueContacts] = useState(true)
  const [showYellowContacts, setShowYellowContacts] = useState(true)
  const [showGreenContacts, setShowGreenContacts] = useState(false)
  const [showOrangeContacts, setShowOrangeContacts] = useState(false)
  const [showClearContacts, setShowClearContacts] = useState(false)
  const [showArchivedContacts, setShowArchivedContacts] = useState(false)   
  
  const [youtubeVideoId, setYoutubeVideoId] = useState()   

  // Refs
  const tabDown = useRef(false)
  const firebase = useRef(null)

  useEffect(()=>{
    
    setUpKeyListener()
    firebaseSetup()
    loadContacts()
    loadEventsArray()
    
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
    var auth = getAuth()    

    // Save a ref to the refs
    firebase.current = {app: app, db: db, storage: storage, auth: auth}
    
    onAuthStateChanged(firebase.current.auth, (user) => {
      if (user) {
        // When user is signed in save id and go to calendar
        setUserId(user.uid)
        setPage("calendar")
      } else {
        // User is signed out
        setUserId(null)
        setPage("auth")
      }
    });

  }  

  const setUpRef = useRef(false)
  function setUpKeyListener(){
    if(setUpRef.current)
      return
    setUpRef.current = true
    window.addEventListener("keydown", (event) => {      

      // Tab + Arrow keys to move around calendar
      if(tabDown.current && event.key === "ArrowRight"){        
        dayOfFocusRef.current = dayOfFocusRef.current.clone().add(1, "day")
        setDayOfFocus(dayOfFocusRef.current)        
      }
      if(tabDown.current && event.key === "ArrowLeft"){        
        dayOfFocusRef.current = dayOfFocusRef.current.clone().subtract(1, "day")
        setDayOfFocus(dayOfFocusRef.current)        
      }
      if(tabDown.current && event.key === "ArrowUp"){        
        dayOfFocusRef.current = dayOfFocusRef.current.clone().subtract(7, "day")
        setDayOfFocus(dayOfFocusRef.current)        
      }
      if(tabDown.current && event.key === "ArrowDown"){        
        dayOfFocusRef.current = dayOfFocusRef.current.clone().add(7, "day")
        setDayOfFocus(dayOfFocusRef.current)        
      } 
      

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
        setPage("log")
      if(tabDown.current && event.key == "l")
        setPage("notes")
      if(tabDown.current && event.key == ";")
        setPage("stats")   
      if(tabDown.current && event.key == "'")
        setPage("settings")  
      if(tabDown.current && event.key == "g")
        setPage("scroller")        
      if(tabDown.current && event.key == "m")
        openContact()
      if(tabDown.current && event.key == "n")
        openEvent(null)            
      if(tabDown.current && event.key == ","){  
        // Open the sidebar and focus on the search input to start filtering by search input
        setSidebarOpen(true)
        document.getElementById("searchInput").focus()
      }
      if(tabDown.current && event.key == "."){
        // Clear the search filter and input
        setSearch("")
        document.getElementById("searchInput").value = ""
      }          
      if(tabDown.current && event.key == "y")
        closeAll()
      if(event.key == "Escape"){
        // Close all menus and clear search filter
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
    if(page === "auth")
      return(
        <Auth      
          firebase={firebase}
        ></Auth>
      )
    if(page === "calendar")
      return(
        <Calendar          
          firebase={firebase}          
          getContactData={getContactData}
          eventArray={eventsArray}

          // Used to open events. If there is no event creates one
          openEvent={openEvent}

          // Can move the things that use this into app
          NumbersToString={NumbersToString}
          StringToNumbers={StringToNumbers}
          
          // For the contact selector (might move that here)
          contactsArray={contactsArray}

          // idk why this is here and not in Calendar.js
          dayOfFocus={dayOfFocus}
          setDayOfFocus={setDayOfFocus}
          
          // This will be used in the event menu which is maybe moving here 
          updateContactDb={updateContactDb}

        ></Calendar>
      )
    if(page === "contacts")
      return(
        <Contacts
          firebase={firebase}
          contactsArray={filterContacts(contactsArray)}  

          openContact={openContact}    
          updateContactDb={updateContactDb}

          showGrayContacts={showGrayContacts} 
          setShowGrayContacts={setShowGrayContacts} 

          showBlueContacts={showBlueContacts} 
          setShowBlueContacts={setShowBlueContacts} 

          showYellowContacts={showYellowContacts} 
          setShowYellowContacts={setShowYellowContacts}

          showGreenContacts={showGreenContacts} 
          setShowGreenContacts={setShowGreenContacts} 

          showOrangeContacts={showOrangeContacts} 
          setShowOrangeContacts={setShowOrangeContacts} 

          showClearContacts={showClearContacts} 
          setShowClearContacts={setShowClearContacts} 

          showArchived={showArchivedContacts} 
          setShowArchivedContacts={setShowArchivedContacts} 

        ></Contacts>
      )
      if(page === "log")
      return(
        <Log
          firebase={firebase}
        ></Log>        
      )
    if(page === "notes")
      return(
        <Notes
          firebase={firebase}
          NumbersToString={NumbersToString}
          StringToNumbers={StringToNumbers}
        ></Notes>
      )
    if(page === "gallery")
      return(
        <Gallery
        contactsArray={contactsArray}  
        ></Gallery>
      )
    if(page === "stats")
      return(
        <Stats
          eventsArray={eventsArray}
          getContactData={getContactData}
        ></Stats>
      )
    if(page === "account")
      return(        
        <Account
          firebase={firebase}
        ></Account>
      )
    if(page === "settings")
      return(        
        <Settings
          setYoutubeVideoId={setYoutubeVideoId}
        ></Settings>
      )
    if(page === "scroller")
      return(        
        <Scroller
          contactsArray={contactsArray}
        ></Scroller>
      )

  }

  // Open
  function openSidebar(event){
    setSidebarOpen(true)
    if(event)
      event.stopPropagation()
  }
  function openContact(_contact){    

    var newContact = {
      key: null,
      name: "",
      color: "Gray",
      notes: "",        
      images: [],      
    }

    if(_contact)
      setSelectedContact(_contact)
    else      
      setSelectedContact(newContact)
    
    setDisplayContactMenu(true)
  }
  function openEvent(_event){  
    if(_event)
      setSelectedEvent(_event)
    else
        setSelectedEvent({
        key: null,
        name: "",
        notes: "",
        imageKey: null,
        date: dayOfFocusRef.current.clone().format("YYYY-MM-DD"),
        dateEnd: dayOfFocusRef.current.clone().format("YYYY-MM-DD"),
      })
    setDisplayEventMenu(true)
  }
  const imageDetailIndex = useRef(0)
  function openImageDetail(_imageUrlArray, _index){
    if(!_index)
      imageDetailIndex.current = 0
    else
      imageDetailIndex.current = _index

    setImageDetailArray(_imageUrlArray)
    setDisplayImageDetail(true)
  }

  // Close
  function closeAll(){
    setSidebarOpen(false)
    setDisplayEventMenu(false)
    setDisplayContactMenu(false)
  }
  function closeSidebar(event){        
      setSidebarOpen(false)
      if(event)
          event.stopPropagation()
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

    // Sort into arrays by status
    var grayContacts = []
    var blueContacts = []
    var yellowContacts = []
    var darkGreenContacts = []
    var orangeContacts = []
    var clearContacts = []
    var greenContacts = []
    var otherContacts = []
    var archivedContacts = []
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
      else if(contact.color == "Archived")
        archivedContacts.push(contact)
      else
        otherContacts.push(contact)
    })

    // Put them back in by order and filter
    tempArray = []
    if(showGrayContacts)
      tempArray = [...tempArray, ...grayContacts]
    if(showBlueContacts)
      tempArray = [...tempArray, ...blueContacts]
    if(showYellowContacts)
      tempArray = [...tempArray, ...yellowContacts]
    if(showGreenContacts)
      tempArray = [...tempArray, ...greenContacts]
    if(showOrangeContacts)
      tempArray = [...tempArray, ...orangeContacts]
    if(showClearContacts)
      tempArray = [...tempArray, ...clearContacts]
    if(showArchivedContacts)
      tempArray = [...tempArray, ...archivedContacts]
    tempArray = [...tempArray, ...otherContacts]

    //tempArray = [...grayContacts, ...blueContacts, ...yellowContacts, ...orangeContacts, ...greenContacts, ...clearContacts, ...otherContacts,]    

    return tempArray
  }
  function loadEventsArray(){
    if(firebase.current)
      onValue(dbRef(firebase.current.db, "events"), eventsSnap => {        
        var tempArray = []        
        eventsSnap.forEach(eventSnap => {
          
          var tempEvent = eventSnap.val()

          tempEvent.name = NumbersToString(tempEvent.name)
          tempEvent.notes = NumbersToString(tempEvent.notes)
          tempEvent.key = eventSnap.key

          tempArray.push(tempEvent)

        })
        setEventsArray(tempArray)
      })
  }
  // #endregion
  
  //\\// ==================== ==================== Save / Delete ==================== ==================== \\//\\
  // #region

  function updateContactDb(_contactData){

    // If theres no key its a new contact so create it
    if(!_contactData.key){

      var newRef = push(dbRef(firebase.current.db, "images2"))

      var tempContactData = {
        name: _contactData.name,
        notes: _contactData.notes,      
        color: _contactData.color,
        images:_contactData.images,
        key: newRef.key,
        dateCreated: moment().format("DD-MMMM-YYYY"),
      }

      update(dbRef(firebase.current.db, "images2/"+tempContactData.key), tempContactData)
            
      setSelectedContact(tempContactData)
    }
    // else just upload it
    else{
      var tempContactData = _contactData
      
      if(_contactData.name)
        tempContactData.name = StringToNumbers(_contactData.name)
      if(_contactData.notes)
        tempContactData.notes = StringToNumbers(_contactData.notes)    
  
      update(dbRef(firebase.current.db, "images2/"+_contactData.key), _contactData)
    }
  }
  
  function updateEventDb(_eventData){

    if(!_eventData)
      return

    // If the key is null crate a new event
    if(_eventData.key == null){
      
      // Create a ref for a new event
      var ref = push(dbRef(firebase.current.db, "events/"))
      
      // Add the key to the event data
      var tempEventData = _eventData
      tempEventData.key = ref.key

      tempEventData.name = StringToNumbers(tempEventData.name)
      tempEventData.notes = StringToNumbers(tempEventData.notes)
      
      // Put it in the db
      set(ref, tempEventData)

    }else{

      var tempEventData = _eventData
      tempEventData.name = StringToNumbers(tempEventData.name)
      tempEventData.notes = StringToNumbers(tempEventData.notes)
      
      var ref = dbRef(firebase.current.db, "events/"+_eventData.key)

      // Put it in the db
      set(ref, tempEventData)

    }
    
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

  function getContactData(_key){
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
        {userId &&  <Sidebar
          setPage={setPage}
          open={sidebarOpen}
          openFunction={openSidebar}
          closeFunction={closeSidebar}
          setSearch={setSearch} 
          setSidebarOpen={setSidebarOpen} 
        ></Sidebar>}
        {DisplayPage()}
        {displayContactMenu && 
          <ContactMenu
            setOpen={setDisplayContactMenu}
            open={displayContactMenu}            
            selectedContact={selectedContact}
            firebase={firebase}
            StringToNumbers={StringToNumbers}
            updateContactDb={updateContactDb}               
            openImageDetail={openImageDetail}
          ></ContactMenu>
        }
        {displayEventMenu &&
          <EventMenu
            selectedEvent={selectedEvent}            
            updateEventDb={updateEventDb}
            setDisplayEventMenu={setDisplayEventMenu}
            getContactData={getContactData}
            firebase={firebase}
            contactsArray={contactsArray}
            updateContactDb={updateContactDb}               
          ></EventMenu>
        }        
        {displayImageDetail &&
          <ImageDetail
            imageArray={imageDetailArray}
            setOpen={setDisplayImageDetail}
            startingIndex={imageDetailIndex.current}
          ></ImageDetail>
        }
        {/* <SpaceComponent></SpaceComponent> */}
      </div>
    </div>
  );
}

export default App;

