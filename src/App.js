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
import EventMenu from './Components/EventMenu';
import ImageDetail from './Components/ImageDetail';
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, set, push, update } from 'firebase/database'
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'firebase/storage'

function App() {
  
  //\\// ==================== ==================== Vars and Init ==================== ==================== \\//\\
  // #region
  const [page, setPage] = useState("calendar")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [displayContactMenu, setDisplayContactMenu] = useState(false)  
  const [displayImageDetail, setDisplayImageDetail] = useState(false)
  const [contactsArray, setContactsArray] = useState([])
  const [search, setSearch] = useState("")
  const [evenstArray, setEventsArray] = useState([])
  const [selectedContact, setSelectedContact] = useState({
    name: "",
    key: "",
    color: "Gray",
    notes: "",
    url: "",
    urlList: [], 
    archived: false,
  })
  const [selectedDay, setSelectedDay] = useState({
    color:"",
    date:null,
    imageKey:null,
    key:null,
    name:"",
    notes:"",
  })
  const tabDown = useRef(false)
  const firebase = useRef(null)

  useEffect(()=>{
    setUpKeyListener()
    setBackground("https://i.ytimg.com/vi/Y1qQZbTF8iQ/maxresdefault.jpg")
    firebaseSetup()
    loadEventsArray()
  },[])

  function  firebaseSetup() {
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

    loadContacts()
  }  

  function setBackground(url){
    // live data from the international space station might be cool
    // https://www.youtube.com/watch?v=Y1qQZbTF8iQ
    // https://www.youtube.com/watch?v=86YLFOog4GM
    document.getElementById("mainApp").style.backgroundImage = "url("+url+")"    
  }

  function setUpKeyListener(){
    window.addEventListener("keydown", (event) => {      
            
      if(event.key == "Tab"){
        event.preventDefault()
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
            event.preventDefault()
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
          setSelectedDay={setSelectedDay}
          contactData={contactData}
          eventArray={evenstArray}
          NumbersToString={NumbersToString}
        ></Calendar>
      )
    if(page === "contacts")
      return(
        <Contacts
          openMenu={setDisplayContactMenu}
          firebase={firebase}
          contactsArray={filterContacts(contactsArray)}
          setSelectedContact={setSelectedContact}
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

  function openEvent(_id){
    // //setDisplaEventMenu(true)
  }

  function openContact(_id){
    setDisplayContactMenu(true)
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
  function newContact(){
    setSelectedContact({
      name:"",
      key:"",
      color:"Gray",
      notes:"",
      url:"",
      urlList:[]
    })
    // upload to db now
    openContact("new")
  }
  function newEvent(){
    openEvent("new")
  }
  function closeAll(){
    // close all windows and sidebar
    //setDisplaEventMenu(false)
    setDisplayContactMenu(false)
    setSidebarOpen(false)
  }
  function displayImages(_imageUrlArray){

  }

  // #endregion


  //\\// ==================== ==================== Load ==================== ==================== \\//\\
  // #region
  function loadContacts(){
    onValue(ref(firebase.current.db, "images2"), imagesSnap => {
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

        images.push({
          name:imageSnapName,
          notes:imageSnapNotes,
          color:imageSnap.child("color").val(),
          url:imageSnap.child("url").val(),
          images:imageSnap.child("images").val(),
          key:imageSnap.key,
        })
      })

      // Add the temp array to state
      setContactsArray(images)            
    })
  }    
  function filterContacts(_contactsArray){
    
    if(!Array.isArray(_contactsArray))
      return

    var tempArray = []
    _contactsArray.forEach(contact => {
      if(contact.name.toLowerCase().includes(search.toLocaleLowerCase()))
        tempArray.push(contact)
    })
    return tempArray
  }
  function loadEventsArray(){
    if(firebase.current)
      onValue(ref(firebase.current.db, "events"), eventsSnap => {
        var tempArray = []
        console.log("eventsSnap: ")
        eventsSnap.forEach(eventSnap => {
          tempArray.push(eventSnap.val())
        })
        setEventsArray(tempArray)
      })
  }
  // #endregion
  
  //\\// ==================== ==================== Save / Delete ==================== ==================== \\//\\
  // #region
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
  window.addEventListener("keydown", event=>{
    // if(event.key === "A")
    //   addImageArrays()
  })
  function addImageArrays(){
    contactsArray.forEach(contact => {
      set(ref(firebase.current.db, "images2/"+contact.key+"/images"),         
        [contact.url]
      )
    })
  }
  function contactData(_key){
    if(_key == "None")
      return {name:""}
    //console.log("looking through "+contactsArray.length+" contacts for "+_key)
    var tempContactData = {name:""}
    contactsArray.forEach(contact => {     
      // console.log(contact.key + " =? " + _key) 
      if(contact.key == _key){
        //console.log("found it")
        tempContactData = contact        
      }
    })
    //console.log("returning "+tempContactData)
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
            displayImages={displayImages}
            selectedContact={selectedContact}
            firebase={firebase}
            StringToNumbers={StringToNumbers}
          ></ContactMenu>
        }        
        {displayImageDetail &&
          <ImageDetail></ImageDetail>
        }
      </div>
    </div>
  );
}

export default App;

