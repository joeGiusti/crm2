import React from 'react'
import ImageArrayViewer from './ImageArrayViewer'

function ImageDetail(props) {
  return (
    <div className='imageDetail'>
      <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
      <ImageArrayViewer
        imageArray={props.imageArray}
      ></ImageArrayViewer>
    </div>
  )
}

export default ImageDetail