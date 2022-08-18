import React from 'react'

function ArrowButtons(props) {
  return (
    <div className='arrowButtons'>
        <div onClick={props.arrowLeft} className="arrow abp arrowLeft hoverBox">{"<"}</div>
        <div className='abp'>{props.message}</div>
        <div onClick={props.arrowRight} className="arrow abp arrowRight hoverBox">{">"}</div>
    </div>
  )
}

export default ArrowButtons