import React from 'react'
import ImageArrayViewer from './ImageArrayViewer'

function ImageDetail(props) {
  return (
    <div className='imageDetail'>
      <div className='closeButton' onClick={()=>props.setOpen(false)}>x</div>
      <ImageArrayViewer
        imageArray={props.imageArray}
        startingIndex={props.startingIndex}
      ></ImageArrayViewer>
    </div>
  )
}
ImageDetail.defaultProps = {
  startingIndex: 0
}
export default ImageDetail