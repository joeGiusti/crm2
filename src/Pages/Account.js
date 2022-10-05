import React from 'react'

function Account(props) {

  function logout(){
    props.firebase.current.auth.signOut()
  }

  return (
    <div className='box pageBox'>
      <button onClick={logout}>Log Out</button>  
    </div>
  )
}

export default Account