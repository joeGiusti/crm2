import React, { useEffect, useRef, useState } from 'react'
import "../Styles/sidebar.css"

function Sidebar(props) {
    
  function updateSearch(){
    var searchInput = document.getElementById("searchInput").value
    props.setSearch(searchInput)
    //props.setPage()
  }

  return (
    <div className={"sidebar " + (props.open ? " sidebarOpen":"")} onClick={(event)=>props.openFunction(event)}>
      <input id='searchInput' placeholder='search' autoComplete='off' onChange={updateSearch}></input>
        {props.open && 
            <>
                <div className='closeButton' onClick={(event)=>props.closeFunction(event)}>x</div>
                {/* <div className='sidebarButton' onClick={() => props.setPage("messages")}>Messages</div> */}
                <div className='sidebarButton' onClick={() => props.setPage("calendar")}>Calendar</div>
                <div className='sidebarButton' onClick={() => props.setPage("contacts")}>Contacts</div>
                <div className='sidebarButton' onClick={() => props.setPage("log")}>Log</div>
                <div className='sidebarButton' onClick={() => props.setPage("notes")}>Notes</div>
                <div className='sidebarButton' onClick={() => props.setPage("stats")}>Stats</div>
                <div className='sidebarButton' onClick={() => props.setPage("gallery")}>Gallery</div>
                <div className='sidebarButton' onClick={() => props.setPage("settings")}>Settings</div>
                <div className='sidebarButton' onClick={() => props.setPage("account")}>Account</div>
                <div className='sidebarButton' onClick={() => props.setPage("scroller")}>Scroller</div>
            </>
        }        
    </div>
  )
}

export default Sidebar