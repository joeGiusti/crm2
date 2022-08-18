import React from 'react'

function Messages() {
  return (
    <div>
        <div className='messagesLeft'>
            <div className='messagePreview'>
                <div className='messagePreviewContact'>Name</div>
                <div className='messagePreviewMessage'>Message preview</div>
            </div>
        </div>
        <div className='conversation'>
            <div className='message'>
                message content
            </div>
            <div className='message'>
                message content
            </div>
            <div className='message'>
                message content
            </div>
            <div className='message'>
                message content
            </div>
        </div>
    </div>
  )
}

export default Messages