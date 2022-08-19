import React from 'react'

function SpaceComponent() {
  var src = "https://www.youtube.com/embed/wnhvanMdx4s?autoplay=1&mute=1"
  // tunnel
  //2QSukL7dl5o
  // earth
  //wnhvanMdx4s
  // earth 
  //IMVjlgWby74  
    return (
    <div>SpaceComponent
        <iframe 
            className='spaceIframe'
            width="100vw" 
            height="w00vh" 
            // src="https://www.youtube.com/embed/Y1qQZbTF8iQ?autoplay=1&mute=1" 
            src={src}        
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen            
            
        ></iframe>
        <div className='overIframe'></div>
    </div>
  )
}

export default SpaceComponent